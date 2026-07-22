// Создаёт (или обновляет пароль) аккаунт для входа в /admin.
// Публичной регистрации нет специально — доступ выдаёт тот, у кого уже
// есть доступ к серверу/БД.
//
// Запуск:
//   node scripts/create-admin.mjs "email@example.com" "пароль" "Имя"

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const [, , email, password, name] = process.argv;

if (!email || !password) {
  console.error(
    'Использование: node scripts/create-admin.mjs "email@example.com" "пароль" "Имя"'
  );
  process.exit(1);
}

const prisma = new PrismaClient();

const passwordHash = await bcrypt.hash(password, 12);

const user = await prisma.user.upsert({
  where: { email: email.toLowerCase() },
  create: { email: email.toLowerCase(), passwordHash, name: name || email },
  update: { passwordHash, ...(name ? { name } : {}) },
});

console.log(`Готово: ${user.email} (id ${user.id})`);
await prisma.$disconnect();
