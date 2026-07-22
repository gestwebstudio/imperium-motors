"use client";

import { useRef, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import { ButtonNode } from "./ButtonNode";
import { VideoNode } from "./VideoNode";
import { resolveVideoEmbedSrc } from "@/lib/videoEmbed";

const COLORS = ["#1b1e1d", "#294434", "#8f8579", "#bb4545", "#5262c0"];

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[13px] transition-colors ${
        active ? "bg-green text-white" : "text-carbon/80 hover:bg-porcelain"
      } disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // даём выбрать тот же файл повторно
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Не удалось загрузить");
      editor.chain().focus().setImage({ src: data.url }).run();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Не удалось загрузить картинку");
    } finally {
      setUploading(false);
    }
  }

  function handleInsertVideo() {
    const input = window.prompt("Ссылка на видео (YouTube, Rutube, VK Видео — embed-ссылка):");
    if (!input) return;
    const result = resolveVideoEmbedSrc(input);
    if (!result.ok) {
      alert(result.error);
      return;
    }
    editor.chain().focus().insertVideo({ src: result.src }).run();
  }

  function handleInsertButton() {
    const label = window.prompt("Текст на кнопке:", "Подробнее");
    if (!label) return;
    const href = window.prompt("Ссылка, куда ведёт кнопка:", "https://");
    if (!href) return;
    editor.chain().focus().insertButton({ label, href }).run();
  }

  const blockValue = editor.isActive("heading", { level: 2 })
    ? "h2"
    : editor.isActive("heading", { level: 3 })
    ? "h3"
    : "p";

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-t-xl border border-b-0 border-[var(--hairline)] bg-porcelain/60 p-1.5">
      <select
        value={blockValue}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "p") editor.chain().focus().setParagraph().run();
          if (v === "h2") editor.chain().focus().toggleHeading({ level: 2 }).run();
          if (v === "h3") editor.chain().focus().toggleHeading({ level: 3 }).run();
        }}
        className="h-8 rounded-lg border border-[var(--hairline)] bg-card px-2 text-[13px] text-carbon outline-none"
      >
        <option value="p">Текст</option>
        <option value="h2">Заголовок</option>
        <option value="h3">Подзаголовок</option>
      </select>

      <div className="mx-1 h-5 w-px bg-[var(--hairline)]" />

      <ToolbarButton title="Жирный" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <strong>Ж</strong>
      </ToolbarButton>
      <ToolbarButton title="Курсив" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <em>К</em>
      </ToolbarButton>
      <ToolbarButton title="Подчёркнутый" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <span className="underline">Ч</span>
      </ToolbarButton>

      <div className="mx-1 h-5 w-px bg-[var(--hairline)]" />

      <div className="flex items-center gap-1">
        {COLORS.map((c) => (
          <button
            key={c}
            type="button"
            title={c}
            onClick={() => editor.chain().focus().setColor(c).run()}
            className="h-6 w-6 rounded-full border border-[var(--hairline)]"
            style={{ backgroundColor: c }}
          />
        ))}
        <button
          type="button"
          title="Без цвета"
          onClick={() => editor.chain().focus().unsetColor().run()}
          className="h-8 rounded-lg px-2 text-[12px] text-taupe hover:bg-porcelain"
        >
          Сброс
        </button>
      </div>

      <div className="mx-1 h-5 w-px bg-[var(--hairline)]" />

      <ToolbarButton title="Вставить картинку" disabled={uploading} onClick={() => fileInputRef.current?.click()}>
        {uploading ? "…" : "🖼"}
      </ToolbarButton>
      <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleImagePick} />

      <ToolbarButton title="Вставить видео" onClick={handleInsertVideo}>
        ▶
      </ToolbarButton>

      <ToolbarButton title="Вставить кнопку" onClick={handleInsertButton}>
        🔘
      </ToolbarButton>
    </div>
  );
}

export default function RichTextEditor({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string;
}) {
  const hiddenRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      TextStyle,
      Color,
      Image,
      ButtonNode,
      VideoNode,
    ],
    content: defaultValue || "<p></p>",
    onUpdate: ({ editor }) => {
      if (hiddenRef.current) hiddenRef.current.value = editor.getHTML();
    },
    editorProps: {
      attributes: {
        class:
          "prose-editor min-h-[280px] rounded-b-xl border border-[var(--hairline)] bg-card px-4 py-3 text-[15px] leading-relaxed text-carbon outline-none",
      },
    },
  });

  if (!editor) return null;

  return (
    <div>
      <input ref={hiddenRef} type="hidden" name={name} defaultValue={defaultValue ?? "<p></p>"} />
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
