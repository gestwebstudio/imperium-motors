import { Node, mergeAttributes } from "@tiptap/core";

export interface ButtonOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    newsButton: {
      insertButton: (attrs: { label: string; href: string }) => ReturnType;
    };
  }
}

// Атомарный блок-кнопка. Рендерится и в редакторе, и на публичной
// странице как <a class="news-button">, стилизуется общим CSS сайта.
export const ButtonNode = Node.create<ButtonOptions>({
  name: "newsButton",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addOptions() {
    return { HTMLAttributes: {} };
  },

  addAttributes() {
    return {
      label: { default: "Кнопка" },
      href: { default: "#" },
    };
  },

  parseHTML() {
    return [{ tag: "a.news-button" }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "a",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: "news-button",
        href: node.attrs.href,
        target: "_blank",
        rel: "noopener noreferrer",
        "data-label": node.attrs.label,
        "data-href": node.attrs.href,
      }),
      node.attrs.label,
    ];
  },

  addCommands() {
    return {
      insertButton:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
    };
  },
});
