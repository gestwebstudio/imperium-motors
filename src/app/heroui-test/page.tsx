"use client";

// Демо интеграции HeroUI v3 (Tailwind v4 / Next 16 / React 19).
import { Button, Card, Input, Label, TextField } from "@heroui/react";

export default function HeroUITestPage() {
  return (
    <div style={{ padding: 40, display: "flex", flexDirection: "column", gap: 24, maxWidth: 480 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>HeroUI v3 — интеграция</h1>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="danger-soft">Danger soft</Button>
      </div>

      <TextField>
        <Label>Email</Label>
        <Input placeholder="you@example.com" />
      </TextField>

      <TextField>
        <Label>Пароль</Label>
        <Input type="password" placeholder="••••••••" />
      </TextField>

      <Card>
        <div style={{ padding: 20 }}>
          <p style={{ fontWeight: 600 }}>Card</p>
          <p style={{ opacity: 0.7 }}>Компоненты HeroUI поверх React Aria + Tailwind v4.</p>
        </div>
      </Card>
    </div>
  );
}
