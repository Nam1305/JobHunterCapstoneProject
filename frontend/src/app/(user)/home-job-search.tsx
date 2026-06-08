"use client"

import { Search } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const locations = ["Ha Noi", "Da Nang", "Ho Chi Minh"]

function getJobsHref(search: string, location: string) {
  const params = new URLSearchParams()
  const trimmedSearch = search.trim()

  if (trimmedSearch) params.set("search", trimmedSearch)
  if (location) params.set("location", location)

  const query = params.toString()

  return query ? `/cong-viec?${query}` : "/cong-viec"
}

export function HomeJobSearch() {
  const [search, setSearch] = useState("")
  const [location, setLocation] = useState("")
  const href = useMemo(() => getJobsHref(search, location), [search, location])

  return (
    <div className="mt-10 w-full max-w-3xl rounded-lg border bg-background p-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm kiếm công việc, công ty, kỹ năng..."
            type="search"
            value={search}
          />
        </div>
        <div className="w-full shrink-0 sm:w-48">
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Địa điểm" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href={href}>Tìm kiếm</Link>
        </Button>
      </div>
    </div>
  )
}
