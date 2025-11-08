"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Bold, Italic, Strikethrough, Code, List, ListOrdered, Quote, Link2, ImageIcon, Heading2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder = "Add description..." }: RichTextEditorProps) {
  const [isFocused, setIsFocused] = useState(false)

  const insertMarkdown = (prefix: string, suffix = prefix) => {
    // Simple markdown insertion - in a real app, use a proper editor like Tiptap
    const textarea = document.querySelector("textarea") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newText = value.substring(0, start) + prefix + selectedText + suffix + value.substring(end)

    onChange(newText)

    // Reset selection
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + prefix.length, end + prefix.length)
    }, 0)
  }

  return (
    <div className="rounded-lg border border-border bg-background">
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b border-border p-2">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => insertMarkdown("**")} type="button">
          <Bold className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => insertMarkdown("*")} type="button">
          <Italic className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => insertMarkdown("~~")} type="button">
          <Strikethrough className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => insertMarkdown("`")} type="button">
          <Code className="h-3.5 w-3.5" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-4" />

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => insertMarkdown("## ", "\n")}
          type="button"
        >
          <Heading2 className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => insertMarkdown("- ", "\n")}
          type="button"
        >
          <List className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => insertMarkdown("1. ", "\n")}
          type="button"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => insertMarkdown("> ", "\n")}
          type="button"
        >
          <Quote className="h-3.5 w-3.5" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-4" />

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => insertMarkdown("[", "](url)")}
          type="button"
        >
          <Link2 className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => insertMarkdown("![alt](", ")")}
          type="button"
        >
          <ImageIcon className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Text Area */}
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="min-h-[200px] resize-none border-none focus-visible:ring-0"
      />

      {/* Footer hint */}
      {isFocused && (
        <div className="border-t border-border px-3 py-2 text-xs text-muted-foreground">Markdown is supported</div>
      )}
    </div>
  )
}
