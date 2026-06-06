"use client"

import { type ComponentProps, type ReactNode } from "react"
import {
  BoldIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const htmlInputTextareaClassName =
  "min-h-48 rounded-none border-0 bg-background px-4 py-3 font-mono text-sm shadow-none focus-visible:ring-0"

type HtmlInputProps = Omit<ComponentProps<typeof Textarea>, "onChange"> & {
  onChange?: ComponentProps<typeof Textarea>["onChange"]
  onValueChange?: (value: string) => void
  textareaWrapper?: (textarea: ReactNode) => ReactNode
}

function EditorToolbarButton({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
    >
      {children}
    </Button>
  )
}

export function HtmlInput({
  className,
  onChange,
  onValueChange,
  textareaWrapper,
  ...props
}: HtmlInputProps) {
  const textarea = (
    <Textarea
      className={className ?? htmlInputTextareaClassName}
      spellCheck={false}
      onChange={(event) => {
        onChange?.(event)
        onValueChange?.(event.target.value)
      }}
      {...props}
    />
  )

  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <div className="flex h-11 items-center gap-1 border-b bg-muted/50 px-3">
        <EditorToolbarButton label="Bold">
          <BoldIcon />
        </EditorToolbarButton>
        <EditorToolbarButton label="Italic">
          <ItalicIcon />
        </EditorToolbarButton>
        <EditorToolbarButton label="Bullet list">
          <ListIcon />
        </EditorToolbarButton>
        <EditorToolbarButton label="Numbered list">
          <ListOrderedIcon />
        </EditorToolbarButton>
      </div>
      {textareaWrapper ? textareaWrapper(textarea) : textarea}
    </div>
  )
}
