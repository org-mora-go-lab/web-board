import { randomUUID } from "node:crypto";
import { mkdirSync, rmSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { createClient } from "@libsql/client";

const filePath = path.resolve(process.env.LIBSQL_MOCK_DATABASE_PATH);
mkdirSync(path.dirname(filePath), { recursive: true });
rmSync(filePath, { force: true });
const streams = new Map();

function decodeValue(value) {
  if (value.type === "null") return null;
  if (value.type === "integer") return BigInt(value.value);
  if (value.type === "blob") return Buffer.from(value.base64, "base64");
  return value.value;
}

function encodeValue(value) {
  if (value === null) return { type: "null" };
  if (typeof value === "bigint") return { type: "integer", value: String(value) };
  if (typeof value === "number") return { type: "float", value };
  if (typeof value === "string") return { type: "text", value };
  return { type: "blob", base64: Buffer.from(value).toString("base64") };
}

async function execute(stream, statement) {
  const sql = statement.sql ?? stream.sql.get(statement.sql_id);
  if (/^BEGIN\b/i.test(sql)) {
    stream.transaction = await stream.client.transaction("write");
  } else if (sql === "COMMIT" || sql === "ROLLBACK") {
    if (!stream.transaction) throw new Error("No active transaction");
    if (sql === "COMMIT") await stream.transaction.commit();
    else await stream.transaction.rollback();
    stream.transaction.close();
    stream.transaction = undefined;
  } else {
    const result = await (stream.transaction ?? stream.client).execute({
      sql,
      args: (statement.args ?? []).map(decodeValue),
    });
    return {
      cols: result.columns.map((name) => ({ name })),
      rows: statement.want_rows ? result.rows.map((row) => Array.from(row, encodeValue)) : [],
      affected_row_count: result.rowsAffected,
      last_insert_rowid: result.lastInsertRowid === undefined ? null : String(result.lastInsertRowid),
    };
  }
  return { cols: [], rows: [], affected_row_count: 0, last_insert_rowid: null };
}

function conditionMatches(condition, results, errors) {
  if (!condition) return true;
  if (condition.type === "ok") return results[condition.step] !== null;
  if (condition.type === "error") return errors[condition.step] !== null;
  if (condition.type === "not") return !conditionMatches(condition.cond, results, errors);
  if (condition.type === "and") return condition.conds.every((item) => conditionMatches(item, results, errors));
  if (condition.type === "or") return condition.conds.some((item) => conditionMatches(item, results, errors));
  throw new Error(`Unsupported condition: ${condition.type}`);
}

async function handleRequest(stream, request) {
  if (request.type === "execute") return { type: "execute", result: await execute(stream, request.stmt) };
  if (request.type === "sequence") await stream.client.executeMultiple(request.sql);
  else if (request.type === "store_sql") stream.sql.set(request.sql_id, request.sql);
  else if (request.type === "close_sql") stream.sql.delete(request.sql_id);
  else if (request.type === "close") {
    stream.transaction?.close();
    stream.client.close();
  }
  else if (request.type === "batch") {
    const results = [];
    const errors = [];
    for (const step of request.batch.steps) {
      let result = null;
      let error = null;
      if (conditionMatches(step.condition, results, errors)) {
        try {
          result = await execute(stream, step.stmt);
        } catch (caught) {
          error = { message: caught.message, code: caught.code };
        }
      }
      results.push(result);
      errors.push(error);
    }
    return { type: "batch", result: { step_results: results, step_errors: errors } };
  } else throw new Error(`Unsupported request: ${request.type}`);
  return { type: request.type };
}

const server = createServer(async (request, response) => {
  if (request.url === "/health") {
    response.end("OK");
    return;
  }
  if (request.url !== "/v2/pipeline" || request.method !== "POST") {
    response.writeHead(404).end();
    return;
  }
  if (request.headers.authorization !== `Bearer ${process.env.LIBSQL_MOCK_AUTH_TOKEN}`) {
    response.writeHead(401).end();
    return;
  }
  try {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString());
    const baton = body.baton ?? randomUUID();
    let stream = streams.get(baton);
    if (!stream) {
      stream = { client: createClient({ url: pathToFileURL(filePath).href, intMode: "bigint" }), sql: new Map() };
      await stream.client.execute("PRAGMA foreign_keys = ON");
      streams.set(baton, stream);
    }
    const results = [];
    for (const item of body.requests) {
      try {
        results.push({ type: "ok", response: await handleRequest(stream, item) });
      } catch (error) {
        results.push({ type: "error", error: { message: error.message, code: error.code } });
      }
    }
    if (stream.client.closed) streams.delete(baton);
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({ baton: stream.client.closed ? null : baton, base_url: null, results }));
  } catch (error) {
    console.error(error);
    response.writeHead(500).end();
  }
});

server.listen(Number(process.env.LIBSQL_MOCK_PORT), () => console.log("libSQL mock ready"));