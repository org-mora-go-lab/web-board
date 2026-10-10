// Stand-in for the Kakao and Google OAuth servers used by the E2E suite.
// Flow: /{provider}/authorize (consent form) -> /{provider}/approve -> redirect_uri?code&state
//       -> /{provider}/token -> /{provider}/userinfo. Codes and tokens are base64url JSON, so it is stateless.
import { createServer } from "node:http";

const PORT = Number(process.env.MOCK_OAUTH_PORT || 4100);
const PROVIDERS = new Set(["kakao", "google"]);

const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
const decode = (value) => {
  try {
    return JSON.parse(Buffer.from(String(value), "base64url").toString());
  } catch {
    return null;
  }
};
const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

const readForm = async (request) => {
  let body = "";
  for await (const chunk of request) body += chunk;
  return Object.fromEntries(new URLSearchParams(body));
};

const send = (response, status, body, headers = {}) => {
  const isJson = typeof body === "object";
  response.writeHead(status, {
    "Content-Type": isJson ? "application/json" : "text/html; charset=utf-8",
    ...headers,
  });
  response.end(isJson ? JSON.stringify(body) : body);
};

const redirect = (response, url) => {
  response.writeHead(302, { Location: url });
  response.end();
};

function authorizePage(provider, query) {
  const hidden = ["client_id", "redirect_uri", "state", "scope"]
    .map((name) => `<input type="hidden" name="${name}" value="${escapeHtml(query.get(name))}">`)
    .join("");
  const title = provider === "kakao" ? "Mock Kakao" : "Mock Google";
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>${title}</title></head><body>
<h1>${title} 로그인</h1>
<form method="post" action="/${provider}/approve">
  ${hidden}
  <label>계정 ID <input name="id" required></label>
  <label>닉네임 <input name="nickname"></label>
  <label>이메일 <input name="email"></label>
  <button type="submit" name="decision" value="approve">동의하고 계속하기</button>
  <button type="submit" name="decision" value="deny">취소</button>
</form></body></html>`;
}

function profileFor(provider, account) {
  if (provider === "kakao") {
    return {
      id: Number.isNaN(Number(account.id)) ? account.id : Number(account.id),
      properties: { nickname: account.nickname },
      kakao_account: {
        profile: { nickname: account.nickname },
        ...(account.email && { email: account.email, is_email_verified: true }),
      },
    };
  }
  return { sub: account.id, name: account.nickname, email: account.email, email_verified: true };
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://localhost:${PORT}`);
  if (url.pathname === "/health") return send(response, 200, { ok: true });

  const [, provider, action] = url.pathname.split("/");
  if (!PROVIDERS.has(provider)) return send(response, 404, { error: "unknown_provider" });

  if (action === "authorize" && request.method === "GET") {
    if (!url.searchParams.get("client_id") || url.searchParams.get("response_type") !== "code") {
      return send(response, 400, "invalid authorize request");
    }
    return send(response, 200, authorizePage(provider, url.searchParams));
  }

  if (action === "approve" && request.method === "POST") {
    const form = await readForm(request);
    const target = new URL(form.redirect_uri);
    if (form.decision === "deny") {
      target.searchParams.set("error", "access_denied");
    } else {
      const account = { id: form.id, nickname: form.nickname, email: form.email || null };
      target.searchParams.set(
        "code",
        encode({ provider, account, clientId: form.client_id, redirectUri: form.redirect_uri }),
      );
    }
    target.searchParams.set("state", form.state);
    return redirect(response, target.toString());
  }

  if (action === "token" && request.method === "POST") {
    const form = await readForm(request);
    const code = decode(form.code);
    const valid =
      form.grant_type === "authorization_code" &&
      code?.provider === provider &&
      code.clientId === form.client_id &&
      code.redirectUri === form.redirect_uri &&
      !!form.client_secret;
    if (!valid) return send(response, 400, { error: "invalid_grant" });
    return send(response, 200, { access_token: encode({ provider, account: code.account }), token_type: "bearer" });
  }

  if (action === "userinfo" && request.method === "GET") {
    const token = decode((request.headers.authorization ?? "").replace(/^Bearer /, ""));
    if (token?.provider !== provider) return send(response, 401, { error: "invalid_token" });
    return send(response, 200, profileFor(provider, token.account));
  }

  return send(response, 404, { error: "not_found" });
});

server.listen(PORT, () => console.log(`mock oauth server listening on ${PORT}`));
