/**
 * Собирает SVG-спрайт для UI Kit из папки /icons.
 *
 * Читает все *.svg, заменяет жёсткий fill на currentColor и вписывает
 * результат между маркерами:
 *   ui-kit:icons:sprite  — сами <symbol> (index.html и home.html)
 *   ui-kit:icons:gallery — карточки в секции «Иконки» (только index.html)
 *
 * Запускается автоматически перед `npm run dev` и `npm run build`
 * (см. predev / prebuild в package.json), так что достаточно
 * положить новый файл в /icons — он появится в ките сам.
 *
 * Разметка вне маркеров не трогается, скрипт идемпотентен.
 */

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ICON_DIR = join(ROOT, 'icons');
const UI_KIT = join(ROOT, 'public', 'ui-kit');

const marker = (name) => ({
  start: `<!-- ui-kit:icons:${name}:start -->`,
  end: `<!-- ui-kit:icons:${name}:end -->`,
});

/** Меняет содержимое между маркерами (если они есть), сами маркеры сохраняет.
    optional=true — молча пропустить файл, где маркера нет. */
function replaceBetween(html, name, body, optional) {
  const { start, end } = marker(name);
  const from = html.indexOf(start);
  const to = html.indexOf(end);
  if (from === -1 || to === -1) {
    if (optional) return html;
    throw new Error(
      `Не найдены маркеры ${start} … ${end}.\n` +
      `Добавьте их в разметку — скрипт вписывает содержимое только между ними.`
    );
  }
  return html.slice(0, from + start.length) + '\n' + body + '\n' + html.slice(to);
}

async function readIcons() {
  const files = (await readdir(ICON_DIR))
    .filter((f) => f.toLowerCase().endsWith('.svg'))
    .sort((a, b) => a.localeCompare(b, 'en'));

  if (files.length === 0) throw new Error(`В ${ICON_DIR} нет ни одного .svg`);

  return Promise.all(
    files.map(async (file) => {
      const raw = await readFile(join(ICON_DIR, file), 'utf8');
      const viewBox = (raw.match(/viewBox="([^"]+)"/) || [, '0 0 12 12'])[1];

      const inner = raw
        .replace(/^[\s\S]*?<svg[^>]*>/, '')   // отрезаем открывающий <svg …>
        .replace(/<\/svg>\s*$/, '')
        .trim()
        // цвет задаёт CSS, а не файл — иначе иконка не наследует цвет кнопки
        .replace(/fill="#[0-9A-Fa-f]{3,8}"/g, 'fill="currentColor"');

      const name = basename(file, '.svg');
      return { id: `icon-${name.toLowerCase()}`, name, viewBox, inner };
    })
  );
}

const icons = await readIcons();

const sprite = icons
  .map((i) => `  <symbol id="${i.id}" viewBox="${i.viewBox}">${i.inner}</symbol>`)
  .join('\n');

const gallery = icons
  .map(
    (i) =>
      `      <div class="icon-cell"><svg class="icon" aria-hidden="true"><use href="#${i.id}"></use></svg>` +
      `<span class="icon-cell__name">${i.name}</span></div>`
  )
  .join('\n');

// Страницы, куда вставляем спрайт. Галерея иконок — только в index.html.
const PAGES = [
  { file: join(UI_KIT, 'index.html'), gallery: true },
  { file: join(UI_KIT, 'home.html'), gallery: false },
];

for (const page of PAGES) {
  let html = await readFile(page.file, 'utf8');
  html = replaceBetween(html, 'sprite', sprite);
  if (page.gallery) html = replaceBetween(html, 'gallery', gallery, true);
  await writeFile(page.file, html);
}

console.log(`ui-kit: спрайт собран из ${icons.length} иконок — ${icons.map((i) => i.name).join(', ')}`);
