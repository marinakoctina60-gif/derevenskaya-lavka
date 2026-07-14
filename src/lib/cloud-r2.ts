type R2ObjectBody = {
  body: ReadableStream | null;
  httpMetadata?: { contentType?: string };
  arrayBuffer(): Promise<ArrayBuffer>;
};

type R2Like = {
  put(
    key: string,
    value: ArrayBuffer | Uint8Array | string,
    options?: { httpMetadata?: { contentType?: string } },
  ): Promise<unknown>;
  get(key: string): Promise<R2ObjectBody | null>;
};

type CloudflareEnv = {
  LAVKA_UPLOADS?: R2Like;
};

export async function getCloudR2(): Promise<R2Like | null> {
  try {
    const mod = await import("@opennextjs/cloudflare");
    const context = await mod.getCloudflareContext({ async: true });
    const env = context.env as CloudflareEnv;
    return env.LAVKA_UPLOADS ?? null;
  } catch {
    return null;
  }
}
