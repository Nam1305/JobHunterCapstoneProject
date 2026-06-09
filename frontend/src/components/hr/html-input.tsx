"use client"

import {
  useEffect,
  useRef,
  type ComponentProps,
  type FormEvent,
  type ReactNode,
} from "react"
import {
  BoldIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const htmlInputEditorClassName =
  "min-h-48 bg-background px-4 py-3 text-sm outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"

type HtmlInputProps = Omit<ComponentProps<typeof Textarea>, "onChange"> & {
  onChange?: ComponentProps<typeof Textarea>["onChange"]
  onValueChange?: (value: string) => void
  textareaWrapper?: (textarea: ReactNode) => ReactNode
}

function EditorToolbarButton({
  disabled,
  label,
  onClick,
  children,
}: {
  disabled?: boolean
  label: string
  onClick: () => void
  children: ReactNode
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

export function HtmlInput({
  className,
  defaultValue,
  disabled,
  name,
  onChange,
  onBlur,
  onValueChange,
  placeholder,
  textareaWrapper,
  value,
  ...props
}: HtmlInputProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const htmlValue = String(value ?? defaultValue ?? "")
  const lastHtmlRef = useRef<string | null>(null)

  useEffect(() => {
    const editor = editorRef.current

    if (!editor || htmlValue === lastHtmlRef.current) {
      return
    }

    editor.innerHTML = htmlValue
    lastHtmlRef.current = htmlValue
  }, [htmlValue])

  const emitValue = () => {
    const nextValue = editorRef.current?.innerHTML ?? ""

    lastHtmlRef.current = nextValue
    onValueChange?.(nextValue)
  }

  const handleInput = (event: FormEvent<HTMLDivElement>) => {
    emitValue()
    onChange?.(event as unknown as Parameters<NonNullable<typeof onChange>>[0])
  }

  const handleBlur = (
    event: Parameters<NonNullable<ComponentProps<"div">["onBlur"]>>[0]
  ) => {
    onBlur?.(event as unknown as Parameters<NonNullable<typeof onBlur>>[0])
  }

  const exec = (command: string) => {
    if (disabled) {
      return
    }

    document.execCommand(command, false)
    editorRef.current?.focus()
    emitValue()
  }

  const editor = (
    <div
      ref={editorRef}
      contentEditable={!disabled}
      suppressContentEditableWarning
      aria-disabled={disabled}
      className={cn(htmlInputEditorClassName, className)}
      data-placeholder={placeholder}
      onBlur={handleBlur}
      onInput={handleInput}
    />
  )

  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <div className="flex h-11 items-center gap-1 border-b bg-muted/50 px-3">
        <EditorToolbarButton
          disabled={disabled}
          label="Bold"
          onClick={() => exec("bold")}
        >
          <BoldIcon />
        </EditorToolbarButton>
        <EditorToolbarButton
          disabled={disabled}
          label="Italic"
          onClick={() => exec("italic")}
        >
          <ItalicIcon />
        </EditorToolbarButton>
        <Separator orientation="vertical" className="mx-1 h-4" />
        <EditorToolbarButton
          disabled={disabled}
          label="Bullet list"
          onClick={() => exec("insertUnorderedList")}
        >
          <ListIcon />
        </EditorToolbarButton>
        <EditorToolbarButton
          disabled={disabled}
          label="Numbered list"
          onClick={() => exec("insertOrderedList")}
        >
          <ListOrderedIcon />
        </EditorToolbarButton>
      </div>
      {textareaWrapper ? textareaWrapper(editor) : editor}
      <Textarea
        aria-hidden="true"
        className="hidden"
        disabled={disabled}
        name={name}
        readOnly
        tabIndex={-1}
        value={htmlValue}
        {...props}
      />
    </div>
  )
}
