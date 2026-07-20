// ─── Storage Adapter ────────────────────────────────────────────────────────
// Personal data  (shared = false) → localStorage
// Shared data    (shared = true)  → Upstash Redis REST API

const REDIS_URL   = import.meta.env.VITE_UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = import.meta.env.VITE_UPSTASH_REDIS_REST_TOKEN;

// ─── Upstash Redis REST helper ───────────────────────────────────────────────
async function redis(...args) {
  const res = await fetch(REDIS_URL, {
    method:  "POST",
    headers: {
      Authorization:  `Bearer ${REDIS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });
  if (!res.ok) throw new Error(`Upstash ${res.status}`);
  const { result } = await res.json();
  return result;
}

// ─── Upstash helpers ─────────────────────────────────────────────────────────
async function sbGet(key) {
  const value = await redis("GET", key);
  if (value === null) return null;
  return { key, value, shared: true };
}

async function sbSet(key, value) {
  await redis("SET", key, value);
  return { key, value, shared: true };
}

async function sbList(prefix) {
  const keys = await redis("KEYS", `${prefix}*`);
  return { keys: keys || [], prefix, shared: true };
}

// ─── Public API (window.storage-compatible) ──────────────────────────────────
export const storage = {
  async get(key, shared = false) {
    if (shared) return sbGet(key);
    const v = localStorage.getItem(key);
    return v !== null ? { key, value: v, shared: false } : null;
  },

  async set(key, value, shared = false) {
    if (shared) return sbSet(key, value);
    localStorage.setItem(key, value);
    return { key, value, shared: false };
  },

  async list(prefix = "", shared = false) {
    if (shared) return sbList(prefix);
    const keys = Object.keys(localStorage).filter(k => k.startsWith(prefix));
    return { keys, prefix, shared: false };
  },

  async delete(key, shared = false) {
    if (!shared) localStorage.removeItem(key);
    else await redis("DEL", key);
    return { key, deleted: true, shared };
  },
};
