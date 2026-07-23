# Imperium Motors — UI Kit и главная страница (сводка для продолжения)

Этот файл — точка входа для новой сессии, чтобы продолжить работу без потери
контекста. Здесь: что сделано, где что лежит, договорённости и что дальше.

- **Репозиторий:** `gestwebstudio/imperium-motors`
- **Ветка:** `claude/git-project-check-g7ry36`
- **Figma:** https://www.figma.com/design/bERRa0eUHmPImiBdiP62UR/Imperium-Motors
  (главная — node `141-1958`; страница «UI Kit» с компонентами — node `1-3360`)
- **git-идентичность:** `gest / gest.webstudio@gmail.com`

---

## ⚠️ Важные условия работы

1. **В этой же ветке параллельно работает другая сессия** (админка, `src/app/**`,
   Prisma, редактор новостей). Перед каждым коммитом: `git fetch origin` →
   при расхождении `git rebase origin/<branch>`. Не трогать `src/app/**`,
   `prisma/**`, `src/components/admin/**` — это их зона. Наша зона:
   `public/ui-kit/**`, `public/home/**`, `public/brand-logos/**`, `icons/**`,
   `scripts/build-ui-kit-icons.mjs`, `src/components/ui/**`, `tests/ui/**`.
2. **Скриншоты в этом окружении не рендерятся** (браузерная панель не композитит
   кадры). Проверять визуал нельзя — сверяться **замерами через JS**
   (`getComputedStyle`, `getBoundingClientRect`) и **Playwright-тестами**.
   Для сверки цветов с макетом — сэмплировать пиксели скриншота Figma через `sharp`.
3. **Коммит-сообщения** заканчивать строкой
   `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
4. Каждую задачу проверять после выполнения; на UI писать/дополнять автотесты.

---

## Где что лежит

### UI Kit (`public/ui-kit/`)
- `tokens.css` — **только цвета и шрифты** (@font-face Wix Madefor Display + Onest,
  все переменные `--carbon-black-*`, `--heritage-green-*`, `--warm-taupe-*`,
  `--stone-beige-*`, `--additional-*`, типографика). Тени/эффекты сюда НЕ кладём.
- `components.css` — все компоненты: Icon, Tag, Badge, Indicator, Tooltip,
  Icon-action (Wishlist/Comparison), Price Block, Slider, Brand logo, Tag list,
  Card, Car Card, Brand Logo Card, **CTA Button (анимированная)**, **Circle Button**,
  hover-подъём карточек. Эффект-токены `--shadow-popover`, `--shadow-card-brand`
  объявлены здесь (в `:root`).
- `buttons.css` — компонент Button (Surface/Flat/Outlined/CTA, size S/M/L,
  states, inverse). Обводка через `box-shadow: inset` (stroke «inside», не меняет габарит).
- `index.html` — витрина кита (демо всех компонентов). Иконки — из спрайта.
- `home.html` + `home.css` — **главная страница** (собирается из компонентов кита).

### Иконки
- Исходники: папка `icons/*.svg` (12×12, fill заменяется на currentColor).
- `scripts/build-ui-kit-icons.mjs` собирает SVG-спрайт и вставляет его в
  `index.html` и `home.html` между маркерами `<!-- ui-kit:icons:sprite:start/end -->`
  (+ галерею в index между `...:gallery:...`). Идемпотентно.
- Запускается автоматически: `predev` / `prebuild` в package.json.
  Вручную: `npm run ui-kit:icons`. **Положил новый .svg в /icons → он сам появится.**

### Картинки — всё в webp
- Машины hero: `public/home/cars/{1big,1small,2big,2small}.webp`
  (исходники PNG — `images/firstcars/`, не в git).
- Логотипы марок: `public/brand-logos/{bmw,mercedes,lexus,porsche,rollsroyce,audi}.webp`
  (исходники — `images/logo_brands/`). Конвертация: sharp, near-lossless для логотипов.
- Прочие исходники для будущих блоков: `images/{cars,reviews,logo_cards,firstcars}/`,
  `images/logo_Imperium_Motors.svg`.

### React-компонент
- `src/components/ui/BrandLogo.tsx` — логотип марки (карта `BRAND_LOGOS` → webp).
  Существующий `src/components/CarCard.tsx` — СТАРАЯ карточка приложения, её НЕ трогали.

### Тесты
- `tests/ui/*.spec.ts` (Playwright), конфиг `playwright.config.ts`.
- Запуск: `npm run test:ui`. Гоняются с `reducedMotion: reduce` (выключает
  авто-прокрутку hero → детерминизм). На данный момент **18 тестов, все зелёные**.
- Артефакты прогонов — в `.gitignore`.

### Как посмотреть
```bash
npm run dev
```
Затем: `http://localhost:3000/ui-kit/home.html` (главная) и
`http://localhost:3000/ui-kit/index.html` (витрина кита).

---

## Договорённости с заказчиком (важно соблюдать)

- **Все компоненты — из кита**, иконки — из папки `icons`.
- **Все картинки — в webp** (быстрее, без потери качества, поддерживает прозрачность).
- Анимированные CTA-кнопки (шапка «Каталог», блоки Трейд-ин/Лизинг) — **отдельный
  компонент** `.cta-button` в ките.
- Анимации кнопок/карточек — «как в прототипе»
  (proto: page-id `9:1784`, node `141-1958`). Прототип программно не
  вытаскивается (нужен логин) — делаем по интенции дизайна, при вопросах уточнять.
- **Цвет названия машины в hero — `#1b1e1d`** (сверено по слою `141:25192` и по
  пикселю макета; заказчик подтвердил «оставить как в макете»).
- Характеристики 2-й (красной) машины в hero — придуманы намеренно (заказчик разрешил).

---

## Что уже собрано в ките (компоненты)

Токены (цвета 30 шт, типографика 25 стилей, 2 шрифта) · Icon (спрайт) · Tag · Badge
(4 цвета × Surface/Outlined) · Indicator · Tooltip (S/L) · Wishlist · Comparison
(4 состояния, живое переключение) · Price Block · Slider (авто-заполнение, «сторис»)
· Brand logo · Card · Car Card (In stock / Waiting) · Brand Logo Card (6 марок, hover)
· CTA Button (анимированная) · Circle Button · hover-подъём карточек.

## Главная страница — статус блоков (node 141-1958)

- ✅ **Блок 1 — Hero** (`1 screen`, node 141:17782): шапка (лого, навигация,
  circle-btn звонок, CTA «Каталог»), заголовок Display/Hero в 3 строки, тэглайн,
  водяной знак, карточка авто (car-card, `--static`), 4 характеристики,
  **карусель на 2 машины** (полоски-прогресс из кита, 4с, авто-смена + кнопки).
  2-я машина — красный Porsche. Позиции выверены по макету.
- ✅ **Блок 2 — Логотипы** (node 141:25243): 6 марок (brand-logo-card),
  **бесконечная прокрутка** кнопками, видно ровно 5, 6-й выезжает при прокрутке.
- ⬜ **Блоки 3+** — ещё не собраны. По макету дальше идут: каталог авто (сетка
  car-card с кнопками-стрелками), плитки услуг (Трейд-ин/Лизинг/Авто под заказ и
  т.д. с CTA-кнопкой), блок отзывов, большой промо-блок, футер. Заказчик присылает
  промты по несколько блоков за раз.

### Заметки по реализации hero (чтобы не переоткрывать)
- Слайдер-прогресс: заливка активной полоски — через **Web Animations API**
  (`el.animate` scaleX 0→1), НЕ через `transition:none`+reflow (тот «прыгал»).
  Пройденные полоски scaleX(1), будущие 0. `--slider-duration` = 4s.
- Карусели: завершение анимации — по `transitionend` **с fallback-таймером**
  (иначе в фоновой вкладке `transitionend` не приходит и карусель залипает).
- Фон страницы — `--stone-beige-100` (#f3f0ee), сверено сэмплом пикселя макета.
- Блок логотипов: стрелки — flex-соседи окна (не поверх карточек); окно = 1721px
  (ровно 5 карточек 324.8 + 4 гэпа 24).

---

## Быстрый старт для новой сессии

1. `git fetch origin && git status` — убедиться, что на ветке и синхронно.
2. Прочитать `public/ui-kit/home.html`, `home.css`, `components.css`.
3. `npm run dev`, открыть `http://localhost:3000/ui-kit/home.html`.
4. `npm run test:ui` — убедиться, что тесты зелёные.
5. Собрать следующий блок из компонентов кита; при нехватке компонента — сначала
   завести его в ките, затем использовать. Дополнить автотесты. Коммит после
   `git fetch`/rebase.
