import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { HtmlInput as HtmlEditorInput } from "@/components/hr/html-input"

interface HtmlInputProps {
  disabled?: boolean
  field: {
    name: string
    onBlur: () => void
    onChange: (value: string) => void
    value: string
  }
  label: string
}

export function HtmlInput({
  disabled,
  field,
  label,
}: HtmlInputProps) {
  return (
    <FormItem className="space-y-2.5">
      <FormLabel>{label}</FormLabel>
      <HtmlEditorInput
        disabled={disabled}
        name={field.name}
        value={field.value}
        onBlur={field.onBlur}
        onValueChange={field.onChange}
        textareaWrapper={(textarea) => <FormControl>{textarea}</FormControl>}
      />
      <FormMessage />
    </FormItem>
  )
}
