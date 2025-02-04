"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface TodoFormProps {
  onSubmit: (text: string) => void;
}

export function TodoForm({ onSubmit }: TodoFormProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text.trim());
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Neue Aufgabe hinzufügen..."
        className="flex-1"
      />
      <Button
        type="submit"
        variant="outline"
        size="icon"
        disabled={!text.trim()}
      >
        <Plus className="h-4 w-4" />
        <span className="sr-only">Aufgabe hinzufügen</span>
      </Button>
    </form>
  );
}
