import { Node, mergeAttributes } from "@tiptap/core";

export interface VideoOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    newsVideo: {
      insertVideo: (attrs: { src: string }) => ReturnType;
    };
  }
}

// Атомарный блок-видео: обёртка 16:9 + iframe. src уже проверен и приведён
// к безопасному embed-адресу в lib/videoEmbed.ts до вставки в редактор.
export const VideoNode = Node.create<VideoOptions>({
  name: "newsVideo",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addOptions() {
    return { HTMLAttributes: {} };
  },

  addAttributes() {
    return {
      // rendered: false — src принадлежит вложенному <iframe>, не обёртке
      // <div>; без этого Tiptap продублировал бы его как атрибут div'а.
      src: { default: "", rendered: false },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div.news-video",
        getAttrs: (el) => {
          if (typeof el === "string") return {};
          const iframe = el.querySelector("iframe");
          return { src: iframe?.getAttribute("src") ?? "" };
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { class: "news-video" }),
      [
        "iframe",
        {
          src: node.attrs.src,
          class: "news-video__iframe",
          frameborder: "0",
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
          allowfullscreen: "true",
        },
      ],
    ];
  },

  addCommands() {
    return {
      insertVideo:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
    };
  },
});
