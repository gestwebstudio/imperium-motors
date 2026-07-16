import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { importPayload } from "@/lib/carSchema";

export const runtime = "nodejs";

// Приёмник данных из 1С.
//   POST /api/import/cars
//   Authorization: Bearer <IMPORT_TOKEN>
//   Body: { mode: "full" | "partial", cars: [...] }
export async function POST(req: NextRequest) {
  // 1. Авторизация по общему токену
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.replace(/^Bearer\s+/i, "");
  if (!process.env.IMPORT_TOKEN || token !== process.env.IMPORT_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Валидация тела
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = importPayload.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { mode, cars } = parsed.data;
  const now = new Date();
  let created = 0;
  let updated = 0;

  // 3. Upsert по VIN + перезапись фото
  for (const c of cars) {
    const data = {
      brand: c.brand,
      model: c.model,
      year: c.year,
      status: c.status,
      price: c.price,
      currency: c.currency,
      fuel: c.specs?.fuel ?? null,
      drive: c.specs?.drive ?? null,
      transmission: c.specs?.transmission ?? null,
      acceleration: c.specs?.acceleration ?? null,
      power: c.specs?.power ?? null,
      maxSpeed: c.specs?.max_speed ?? null,
      lastSeenAt: now,
    };

    const existing = await prisma.car.findUnique({ where: { vin: c.vin } });

    await prisma.car.upsert({
      where: { vin: c.vin },
      create: {
        vin: c.vin,
        ...data,
        photos: { create: c.photos.map((url, i) => ({ url, sort: i })) },
      },
      update: {
        ...data,
        // фото полностью пересобираем из свежей выгрузки
        photos: {
          deleteMany: {},
          create: c.photos.map((url, i) => ({ url, sort: i })),
        },
      },
    });

    if (existing) updated++;
    else created++;
  }

  // 4. Полная выгрузка: то, что не пришло, считаем проданным
  let markedSold = 0;
  if (mode === "full") {
    const vins = cars.map((c) => c.vin);
    const res = await prisma.car.updateMany({
      where: { vin: { notIn: vins }, status: { not: "sold" } },
      data: { status: "sold" },
    });
    markedSold = res.count;
  }

  return NextResponse.json({
    ok: true,
    mode,
    received: cars.length,
    created,
    updated,
    markedSold,
  });
}
