import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getCloudR2 } from "@/lib/cloud-r2";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Нужен вход" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Некорректный файл" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Выберите файл" }, { status: 400 });
  }

  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: "Можно JPG, PNG, WEBP или GIF" },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Файл больше 5 МБ" }, { status: 400 });
  }

  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : file.type === "image/gif"
          ? "gif"
          : "jpg";

  const filename = `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const r2 = await getCloudR2();
  if (r2) {
    await r2.put(`uploads/${filename}`, buffer, {
      httpMetadata: { contentType: file.type },
    });
    return NextResponse.json({ url: `/api/media/${filename}` });
  }

  try {
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), buffer);
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch {
    return NextResponse.json(
      {
        error:
          "Загрузка фото недоступна: подключите R2 (привязка LAVKA_UPLOADS).",
      },
      { status: 503 },
    );
  }
}
