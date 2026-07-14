type KvLike = {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
};

type CloudflareEnv = {
  LAVKA_DATA?: KvLike;
};

async function getBindingKv(): Promise<KvLike | null> {
  try {
    const mod = await import("@opennextjs/cloudflare");
    const context = await mod.getCloudflareContext({ async: true });
    const env = context.env as CloudflareEnv;
    return env.LAVKA_DATA ?? null;
  } catch {
    return null;
  }
}

function getRestKv(): KvLike | null {
  const accountId = process.env.CF_ACCOUNT_ID?.trim();
  const namespaceId = process.env.CF_KV_NAMESPACE_ID?.trim();
  const token = process.env.CF_API_TOKEN?.trim();
  if (!accountId || !namespaceId || !token) return null;

  const base = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values`;

  return {
    async get(key: string) {
      const res = await fetch(`${base}/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 404) return null;
      if (!res.ok) {
        throw new Error("Не удалось прочитать данные из Cloudflare KV");
      }
      return res.text();
    },
    async put(key: string, value: string) {
      const res = await fetch(`${base}/${encodeURIComponent(key)}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: value,
      });
      if (!res.ok) {
        throw new Error("Не удалось сохранить данные в Cloudflare KV");
      }
    },
  };
}

export async function getCloudKv(): Promise<KvLike | null> {
  return (await getBindingKv()) ?? getRestKv();
}
