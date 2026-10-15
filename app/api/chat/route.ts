import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const runtime = "nodejs";

const ALLOWED_ORIGINS = new Set([
  "https://thaus.co",
  "https://www.thaus.co",
  "http://localhost:3000",
]);

const SESSION_ID_RE = /^[A-Za-z0-9_-]{8,64}$/;
const MAX_MESSAGE = 500;
const UPSTREAM_TIMEOUT_MS = 30_000;

const MSG_INVALID = "Sorry, I couldn't read that message. Please try again.";
const MSG_RATE_LIMIT =
  "You're sending messages a bit fast. Please wait a moment, or use the contact form on thaus.co.";
const MSG_UNAVAILABLE =
  "Sorry, the assistant is unavailable right now. Please use the contact form on thaus.co.";

type Limiters = {
  ipMinute: Ratelimit;
  ipDay: Ratelimit;
  sessionDay: Ratelimit;
};

let limiters: Limiters | null | undefined;

function getLimiters(): Limiters | null {
  if (limiters !== undefined) return limiters;

  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    console.error(
      "[chat] Upstash env vars missing; rate limiting is disabled (n8n caps still apply).",
    );
    limiters = null;
    return limiters;
  }

  const redis = new Redis({ url, token });
  limiters = {
    ipMinute: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "60 s"),
      prefix: "thaus:chat:ip:min",
    }),
    ipDay: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(60, "24 h"),
      prefix: "thaus:chat:ip:day",
    }),
    sessionDay: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, "24 h"),
      prefix: "thaus:chat:session:day",
    }),
  };
  return limiters;
}

function reply(text: string, status: number) {
  return Response.json({ reply: text }, { status });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || !ALLOWED_ORIGINS.has(origin)) {
    return reply("Forbidden.", 403);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return reply(MSG_INVALID, 400);
  }

  const { sessionId, message } = (body ?? {}) as {
    sessionId?: unknown;
    message?: unknown;
  };
  if (typeof sessionId !== "string" || !SESSION_ID_RE.test(sessionId)) {
    return reply(MSG_INVALID, 400);
  }
  if (typeof message !== "string") return reply(MSG_INVALID, 400);
  const text = message.trim();
  if (text.length < 1 || text.length > MAX_MESSAGE) {
    return reply(
      `Please keep your message between 1 and ${MAX_MESSAGE} characters.`,
      400,
    );
  }

  const webhookUrl = process.env.N8N_CHAT_WEBHOOK_URL;
  const secret = process.env.N8N_CHAT_SECRET;
  if (!webhookUrl || !secret) {
    console.error("[chat] N8N_CHAT_WEBHOOK_URL / N8N_CHAT_SECRET not configured.");
    return reply(MSG_UNAVAILABLE, 502);
  }

  const rl = getLimiters();
  if (rl) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    try {
      const results = await Promise.all([
        rl.ipMinute.limit(ip),
        rl.ipDay.limit(ip),
        rl.sessionDay.limit(sessionId),
      ]);
      if (results.some((r) => !r.success)) {
        return reply(MSG_RATE_LIMIT, 429);
      }
    } catch (err) {
      // Fail open: a Redis outage shouldn't take the assistant down.
      console.error("[chat] rate limit check failed", err);
    }
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Thaus-Secret": secret,
      },
      body: JSON.stringify({ sessionId, message: text }),
      signal: controller.signal,
      cache: "no-store",
    });

    let data: unknown = null;
    try {
      data = await upstream.json();
    } catch {
      // non-JSON upstream body; handled below
    }
    const upstreamReply = (data as { reply?: unknown } | null)?.reply;

    if (typeof upstreamReply === "string" && upstreamReply.length > 0) {
      return reply(upstreamReply, upstream.status);
    }
    console.error("[chat] upstream returned no reply, status", upstream.status);
    return reply(MSG_UNAVAILABLE, 502);
  } catch (err) {
    console.error(
      "[chat] upstream request failed",
      err instanceof Error ? err.name : "unknown",
    );
    return reply(MSG_UNAVAILABLE, 502);
  } finally {
    clearTimeout(timer);
  }
}
