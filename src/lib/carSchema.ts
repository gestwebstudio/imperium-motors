import { z } from "zod";

// Контракт данных из системы учёта. Всё, что приходит на /api/import/cars,
// валидируется по этой схеме — кривой JSON не попадёт в базу.

export const carStatus = z.enum(["in_stock", "reserved", "sold"]);

export const carInput = z.object({
  vin: z.string().min(5),
  brand: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1900).max(2100),
  status: carStatus.default("in_stock"),
  price: z.number().int().nonnegative(),
  currency: z.string().default("RUB"),
  specs: z
    .object({
      fuel: z.string().optional(),
      drive: z.string().optional(),
      transmission: z.string().optional(),
      acceleration: z.string().optional(),
      power: z.string().optional(),
      max_speed: z.string().optional(),
    })
    .optional(),
  photos: z.array(z.string().url()).default([]),
});

export const importPayload = z.object({
  // full  — полная выгрузка: машины, которых нет в списке, помечаются проданными
  // partial — частичная: трогаем только присланные VIN
  mode: z.enum(["full", "partial"]).default("full"),
  cars: z.array(carInput),
});

export type CarInput = z.infer<typeof carInput>;
export type ImportPayload = z.infer<typeof importPayload>;
