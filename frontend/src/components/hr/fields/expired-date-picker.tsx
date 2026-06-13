import { useState } from "react"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { FormControl } from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  formatDateDisplay,
  toDateFieldValue,
  toDateValue,
} from "../job-posting-form-schema"

interface ExpiredDatePickerProps {
  disabled?: boolean
  onChange: (value: string) => void
  value: string
}

export function ExpiredDatePicker({
  disabled,
  onChange,
  value,
}: ExpiredDatePickerProps) {
  const [open, setOpen] = useState(false)
  const selectedDate = toDateValue(value)

  function isPastOrToday(date: Date) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return date <= today
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-between text-left font-normal"
            disabled={disabled}
          >
            <span
              className={`min-w-0 flex-1 truncate ${
                value ? "" : "text-muted-foreground"
              }`}
            >
              {formatDateDisplay(value)}
            </span>
            <CalendarIcon
              data-icon="inline-end"
              className="text-muted-foreground"
            />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          defaultMonth={selectedDate}
          disabled={isPastOrToday}
          onSelect={(date) => {
            if (!date) {
              return
            }

            onChange(toDateFieldValue(date))
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
