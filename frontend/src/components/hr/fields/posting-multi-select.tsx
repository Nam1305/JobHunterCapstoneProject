import { ChevronDownIcon } from "lucide-react"

import { FormControl } from "@/components/ui/form"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { JobPostingOption } from "@/types/job"

interface PostingMultiSelectProps {
  disabled?: boolean
  onChange: (value: string[]) => void
  options: JobPostingOption[]
  placeholder: string
  value: string[]
}

export function PostingMultiSelect({
  disabled,
  onChange,
  options,
  placeholder,
  value,
}: PostingMultiSelectProps) {
  const safeOptions = Array.isArray(options) ? options : []
  const selectedOptions = safeOptions.filter((option) =>
    value.includes(option.id)
  )
  const displayValue =
    selectedOptions.length === 0
      ? placeholder
      : selectedOptions.length <= 2
        ? selectedOptions.map((option) => option.name).join(", ")
        : `${selectedOptions.length} cấp độ đã chọn`

  function handleToggle(optionId: string, checked: boolean) {
    onChange(
      checked
        ? [...value, optionId]
        : value.filter((currentValue) => currentValue !== optionId)
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <FormControl>
          <button
            type="button"
            className="flex h-9 w-full items-center justify-between gap-1.5 rounded-4xl border border-input bg-input/30 px-3 py-2 text-sm whitespace-nowrap transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={disabled}
          >
            <span
              className={`min-w-0 flex-1 truncate text-left ${
                selectedOptions.length === 0 ? "text-muted-foreground" : ""
              }`}
            >
              {displayValue}
            </span>
            <ChevronDownIcon className="pointer-events-none size-4 shrink-0 text-muted-foreground" />
          </button>
        </FormControl>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {safeOptions.length === 0 ? (
          <DropdownMenuLabel>Không có dữ liệu</DropdownMenuLabel>
        ) : (
          safeOptions.map((option) => {
            const checked = value.includes(option.id)

            return (
              <DropdownMenuCheckboxItem
                key={option.id}
                checked={checked}
                onCheckedChange={(nextChecked) =>
                  handleToggle(option.id, nextChecked === true)
                }
                onSelect={(event) => event.preventDefault()}
              >
                <span className="min-w-0 flex-1 truncate">{option.name}</span>
              </DropdownMenuCheckboxItem>
            )
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
