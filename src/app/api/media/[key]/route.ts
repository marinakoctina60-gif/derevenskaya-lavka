import { NextResponse } from "next/server";
import { getCloudR2 } from "@/lib/cloud-r2";

type Params = { params: Promise<{ key: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { key } = await params;
  const safeKey = key.replace(/[^a-zA-Z0-9._-]/g, "");
  if (!safeKey || safeKey !== key) {
    return NextResponse.json({ error: "Некорректный файл" }, { status: 400 });
  }

  const r2 = await getCloudR2();
  if (!r2) {
    return NextResponse.json({ error: "Файлы недоступны" }, { status: 404 });
  }

  const object = await r2.get(`uploads/${safeKey}`);
  if (!object || !object.body) {
    return NextResponse.json({ error: "Файл не найден" }, { status: 404 });
  }

  const contentType =
    object.httpMetadata?.contentType || "application/octet-stream";

  return new NextResponse(object.body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
