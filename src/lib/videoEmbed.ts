// Превращает ссылку на видео (YouTube/Rutube/VK или уже готовая embed-ссылка)
// в безопасный src для <iframe>. Произвольный HTML-код embed'а не принимаем —
// только URL, домен которого мы явно разрешили, чтобы не пускать в статью
// чужой JS через "код для вставки".

const ALLOWED_EMBED_HOSTS = [
  "www.youtube.com",
  "youtube.com",
  "www.youtube-nocookie.com",
  "youtube-nocookie.com",
  "rutube.ru",
  "vk.com",
  "vkvideo.ru",
];

function youtubeId(url: URL): string | null {
  if (url.hostname === "youtu.be") {
    return url.pathname.slice(1) || null;
  }
  if (url.hostname.endsWith("youtube.com")) {
    if (url.pathname === "/watch") return url.searchParams.get("v");
    if (url.pathname.startsWith("/embed/")) return url.pathname.split("/")[2] ?? null;
    if (url.pathname.startsWith("/shorts/")) return url.pathname.split("/")[2] ?? null;
  }
  return null;
}

export function resolveVideoEmbedSrc(input: string): { ok: true; src: string } | { ok: false; error: string } {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return { ok: false, error: "Это не похоже на ссылку" };
  }

  if (url.hostname === "youtu.be" || url.hostname.endsWith("youtube.com")) {
    const id = youtubeId(url);
    if (!id) return { ok: false, error: "Не нашли ID видео в ссылке YouTube" };
    return { ok: true, src: `https://www.youtube-nocookie.com/embed/${id}` };
  }

  if (ALLOWED_EMBED_HOSTS.includes(url.hostname)) {
    // Rutube/VK — просим именно embed-ссылку (кнопка «Поделиться → Код для вставки»
    // на этих площадках отдаёт ссылку вида .../embed/... или video_ext.php).
    return { ok: true, src: url.toString() };
  }

  return {
    ok: false,
    error: "Поддерживаются только YouTube, Rutube и VK Видео (вставьте embed-ссылку)",
  };
}

export const ALLOWED_EMBED_HOSTS_LIST = ALLOWED_EMBED_HOSTS;
