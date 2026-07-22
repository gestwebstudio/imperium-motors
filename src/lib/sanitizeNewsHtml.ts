import "server-only";
import sanitizeHtml from "sanitize-html";
import { ALLOWED_EMBED_HOSTS_LIST } from "@/lib/videoEmbed";

// Разрешаем ровно то, что умеет производить наш редактор (RichTextEditor +
// ButtonNode/VideoNode) — ничего сверх этого, никаких <script>/on*-атрибутов.
export function sanitizeNewsHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags: ["p", "h2", "h3", "strong", "em", "u", "span", "img", "div", "iframe", "a", "br"],
    allowedAttributes: {
      span: ["style"],
      img: ["src", "alt"],
      div: ["class"],
      iframe: ["src", "class", "frameborder", "allow", "allowfullscreen"],
      a: ["href", "class", "target", "rel", "data-label", "data-href"],
    },
    allowedStyles: {
      span: { color: [/^#[0-9a-fA-F]{3,8}$/, /^rgb/] },
    },
    allowedClasses: {
      div: ["news-video"],
      iframe: ["news-video__iframe"],
      a: ["news-button"],
    },
    allowedSchemesByTag: { img: ["http", "https"], a: ["http", "https"] },
    // iframe.src ограничиваем строго списком доменов, которые сами же
    // подставляем в lib/videoEmbed.ts — это единственная точка, куда
    // мог бы просочиться сторонний JS через "код для вставки".
    exclusiveFilter: (frame) => {
      if (frame.tag !== "iframe") return false;
      const src = frame.attribs.src ?? "";
      try {
        const host = new URL(src).hostname;
        return !ALLOWED_EMBED_HOSTS_LIST.includes(host);
      } catch {
        return true;
      }
    },
  });
}
