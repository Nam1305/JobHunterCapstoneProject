import { KeyboardEvent, useState } from "react"
import { XIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"

interface TagsInputProps {
  disabled?: boolean
  onChange: (value: string[]) => void
  placeholder: string
  value: string[]
}

export function TagsInput({
  disabled,
  onChange,
  placeholder,
  value,
}: TagsInputProps) {
  const [draftTag, setDraftTag] = useState("")

  function addTag() {
    const nextTag = draftTag.trim()

    if (!nextTag) {
      return
    }

    if (!value.includes(nextTag)) {
      onChange([...value, nextTag])
    }

    setDraftTag("")
  }

  function removeTag(tag: string) {
    onChange(value.filter((currentTag) => currentTag !== tag))
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter" && event.key !== "Tab") {
      return
    }

    if (!draftTag.trim()) {
      return
    }

    event.preventDefault()
    addTag()
  }

  return (
    <div className="flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-4xl border border-input bg-input/30 px-3 py-1 text-sm transition-colors outline-none focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50">
      {value.map((tag) => (
        <Badge key={tag} variant="secondary" className="max-w-full">
          <span className="max-w-48 truncate">{tag}</span>
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            disabled={disabled}
            aria-label={`Xóa tag ${tag}`}
            onClick={() => removeTag(tag)}
          >
            <XIcon className="size-3.5" />
          </button>
        </Badge>
      ))}
      <input
        disabled={disabled}
        value={draftTag}
        placeholder={value.length === 0 ? placeholder : ""}
        className="min-w-36 flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        onChange={(event) => setDraftTag(event.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}
