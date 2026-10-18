import { spawn } from "node:child_process";
import { createServer } from "node:net";

const appPort = Number(process.env.MOCK_APP_PORT || 3200);
const oauthPort = Number(process.env.MOCK_OAUTH_PORT || 4200);
const appUrl = `http://localhost:${appPort}`;
const oauthUrl = `http://localhost:${oauthPort}`;
const children = new Set();
let stopping = false;

function stop(exitCode) {
  if (stopping) return;
  stopping = true;
  process.exitCode = exitCode;
  for (const child of children) child.kill("SIGTERM");
}

function start(args, env) {
  const child = spawn(process.execPath, args, { env, stdio: "inherit" });
  children.add(child);
  child.on("error", (error) => {
    console.error(error.message);
    stop(1);
  });
  child.on("exit", (code) => {
    children.delete(child);
    stop(code ?? 1);
  });
}

async function checkPort(port) {
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid mock port: ${port}`);
  }
  await new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(port, () => server.close(resolve));
  });
}

try {
  if (appPort === oauthPort) throw new Error("Mock app and OAuth ports must be different.");
  await checkPort(appPort);
  await checkPort(oauthPort);
  const env = {
    ...process.env,
    NODE_ENV: "development",
    VERCEL: "",
    TURSO_DATABASE_URL: "",
    TURSO_AUTH_TOKEN: "",
    APP_URL: appUrl,
    DATABASE_PATH: process.env.MOCK_DATABASE_PATH || "data/mock.db",
    NEXT_DIST_DIR: process.env.MOCK_DIST_DIR || ".next-mock",
    MOCK_OAUTH_PORT: String(oauthPort),
    MOCK_DEFAULT_ACCOUNT: "1",
  };
  for (const provider of ["kakao"]) {
    const prefix = provider.toUpperCase();
    env[`${prefix}_CLIENT_ID`] = `mock-${provider}-client`;
    env[`${prefix}_CLIENT_SECRET`] = `mock-${provider}-secret`;
    env[`${prefix}_AUTHORIZE_URL`] = `${oauthUrl}/${provider}/authorize`;
    env[`${prefix}_TOKEN_URL`] = `${oauthUrl}/${provider}/token`;
    env[`${prefix}_USERINFO_URL`] = `${oauthUrl}/${provider}/userinfo`;
  }
  process.on("SIGINT", () => stop(0));
  process.on("SIGTERM", () => stop(0));
  start(["tests/__mock__/oauth-server.mjs"], env);
  start(["node_modules/next/dist/bin/next", "dev", "--port", String(appPort)], env);
  console.log(`Mock Board: ${appUrl}`);
} catch (error) {
  console.error(`Unable to start mock environment: ${error.message}`);
  stop(1);
}
