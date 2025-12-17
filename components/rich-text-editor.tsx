"use client"

import { useState, useRef } from "react"
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
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  // Store selection when textarea loses focus
  const selectionRef = useRef<{ start: number; end: number }>({ start: 0, end: 0 })

  const handleSelectionChange = () => {
    const textarea = textareaRef.current
    if (textarea) {
      selectionRef.current = {
        start: textarea.selectionStart,
        end: textarea.selectionEnd,
      }
    }
  }

  const insertMarkdown = (prefix: string, suffix = prefix) => {
    const textarea = textareaRef.current
    if (!textarea) return

    // Use stored selection
    const start = selectionRef.current.start
    const end = selectionRef.current.end
    const selectedText = value.substring(start, end)
    const newText = value.substring(0, start) + prefix + selectedText + suffix + value.substring(end)

    onChange(newText)

    // Reset selection and focus
    const newCursorPos = start + prefix.length + selectedText.length + suffix.length
    setTimeout(() => {
      textarea.focus()
      if (selectedText.length > 0) {
        // If text was selected, place cursor after the formatted text
        textarea.setSelectionRange(newCursorPos, newCursorPos)
      } else {
        // If no text was selected, place cursor between the markers
        textarea.setSelectionRange(start + prefix.length, start + prefix.length)
      }
    }, 0)
  }

  // Prevent button from stealing focus
  const preventFocusLoss = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  return (
    <div className="rounded-lg border border-border bg-background">
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b border-border p-2">
        <Button variant="ghost" size="icon" className="h-7 w-7" onMouseDown={preventFocusLoss} onClick={() => insertMarkdown("**")} type="button">
          <Bold className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onMouseDown={preventFocusLoss} onClick={() => insertMarkdown("*")} type="button">
          <Italic className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onMouseDown={preventFocusLoss} onClick={() => insertMarkdown("~~")} type="button">
          <Strikethrough className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onMouseDown={preventFocusLoss} onClick={() => insertMarkdown("`")} type="button">
          <Code className="h-3.5 w-3.5" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-4" />

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onMouseDown={preventFocusLoss}
          onClick={() => insertMarkdown("## ", "\n")}
          type="button"
        >
          <Heading2 className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onMouseDown={preventFocusLoss}
          onClick={() => insertMarkdown("- ", "\n")}
          type="button"
        >
          <List className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onMouseDown={preventFocusLoss}
          onClick={() => insertMarkdown("1. ", "\n")}
          type="button"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onMouseDown={preventFocusLoss}
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
          onMouseDown={preventFocusLoss}
          onClick={() => insertMarkdown("[", "](url)")}
          type="button"
        >
          <Link2 className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onMouseDown={preventFocusLoss}
          onClick={() => insertMarkdown("![alt](", ")")}
          type="button"
        >
          <ImageIcon className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Text Area */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onSelect={handleSelectionChange}
        onKeyUp={handleSelectionChange}
        onClick={handleSelectionChange}
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
