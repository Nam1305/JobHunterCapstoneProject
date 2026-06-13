import { FormControl } from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { JobPostingOption } from "@/types/job"

interface PostingSelectProps {
  disabled?: boolean
  onChange: (value: string) => void
  options: JobPostingOption[]
  placeholder: string
  value: string
}

export function PostingSelect({
  disabled,
  onChange,
  options,
  placeholder,
  value,
}: PostingSelectProps) {
  const safeOptions = Array.isArray(options) ? options : []

  return (
    <Select disabled={disabled} value={value} onValueChange={onChange}>
      <FormControl>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {safeOptions.map((option) => (
          <SelectItem key={option.id} value={option.id}>
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
