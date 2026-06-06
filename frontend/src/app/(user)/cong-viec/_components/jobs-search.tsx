"use client"

import {
  useState,
  type Dispatch,
  type SetStateAction,
} from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  BriefcaseBusiness,
  Check,
  ChevronDown,
  ChevronRight,
  ListFilter,
  Search,
  SlidersHorizontal,
  Users,
  X,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { UserContainer } from "@/components/user/user-container"
import { cn } from "@/lib/utils"
import type {
  JobCategoryOption,
  JobFilterOptions,
  JobsSearchState,
  SlugOption,
} from "@/types/job"

function toggleValue(
  setter: Dispatch<SetStateAction<string[]>>,
  value: string
) {
  setter((current) =>
    current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value]
  )
}

function MultiFilterPopover({
  label,
  icon: Icon,
  options,
  selected,
  onToggle,
  onClear,
}: {
  label: string
  icon: LucideIcon
  options: string[] | SlugOption[]
  selected: string[]
  onToggle: (value: string) => void
  onClear: () => void
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={selected.length > 0 ? "default" : "outline"}
        >
          <Icon />
          {label}
          {selected.length > 0 && (
            <Badge variant="secondary">{selected.length}</Badge>
          )}
          <ChevronDown className="transition-transform group-data-[state=open]/button:rotate-180" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 gap-1 p-2">
        {options.map((option) => {
          const value = typeof option === "string" ? option : option.slug
          const label = typeof option === "string" ? option : option.name

          return (
            <Button
              key={value}
              type="button"
              variant="ghost"
              className="justify-start"
              onClick={() => onToggle(value)}
            >
              <span
                className={cn(
                  "flex size-4 items-center justify-center rounded-[6px] border",
                  selected.includes(value) &&
                  "border-primary bg-primary text-primary-foreground"
                )}
              >
                {selected.includes(value) && <Check className="size-3" />}
              </span>
              {label}
            </Button>
          )
        })}
        {selected.length > 0 && (
          <>
            <Separator />
            <Button type="button" variant="ghost" onClick={onClear}>
              <X />
              Xóa bộ lọc
            </Button>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}

function CategoryPopover({
  categories,
  selected,
  onToggle,
  onClear,
}: {
  categories: JobCategoryOption[]
  selected: string[]
  onToggle: (value: string) => void
  onClear: () => void
}) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.slug ?? "")
  const active =
    categories.find((category) => category.slug === activeCategory) ??
    categories[0]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button">
          <ListFilter />
          Danh mục ({selected.length})
          <ChevronDown className="transition-transform group-data-[state=open]/button:rotate-180" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[min(44rem,calc(100vw-2rem))] gap-0 p-0"
      >
        {active ? (
          <div className="grid min-h-72 grid-cols-[17rem_minmax(0,1fr)]">
            <div className="border-r p-2">
              {categories.map((category) => {
                const hasSelected = category.subcategories.some((subcategory) =>
                  selected.includes(subcategory.slug)
                )

                return (
                  <Button
                    key={category.slug}
                    type="button"
                    variant={
                      activeCategory === category.slug ? "secondary" : "ghost"
                    }
                    className="w-full min-w-0 justify-between"
                    onClick={() => setActiveCategory(category.slug)}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      {hasSelected && (
                        <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                      )}
                      <span className="truncate">{category.name}</span>
                    </span>
                    <ChevronRight className="shrink-0" />
                  </Button>
                )
              })}
            </div>
            <div className="p-3">
              <p className="px-2 pb-2 text-xs text-muted-foreground">
                {active.name}
              </p>
              <div className="grid gap-1">
                {active.subcategories.map((subcategory) => (
                  <Button
                    key={subcategory.slug}
                    type="button"
                    variant="ghost"
                    className="justify-between"
                    onClick={() => onToggle(subcategory.slug)}
                  >
                    {subcategory.name}
                    {selected.includes(subcategory.slug) && <Check />}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 text-sm text-muted-foreground">
            Chưa có danh mục tìm kiếm.
          </div>
        )}
        {selected.length > 0 && (
          <div className="flex items-center justify-between border-t p-3 text-sm text-muted-foreground">
            <span>{selected.length} đã chọn</span>
            <Button type="button" variant="ghost" size="sm" onClick={onClear}>
              Xóa tất cả
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

function AllFiltersDrawer({
  filterOptions,
  open,
  onOpenChange,
  keyword,
  location,
  selectedSubcategories,
  selectedJobLevels,
  selectedWorkTypes,
  onToggleSubcategory,
  onToggleJobLevel,
  onToggleWorkType,
  onClearSubcategories,
  onClearJobLevels,
  onClearWorkTypes,
  onClearAll,
  onApply,
  activeCount,
}: {
  filterOptions: JobFilterOptions
  open: boolean
  onOpenChange: (open: boolean) => void
  keyword: string
  location: string
  selectedSubcategories: string[]
  selectedJobLevels: string[]
  selectedWorkTypes: string[]
  onToggleSubcategory: (value: string) => void
  onToggleJobLevel: (value: string) => void
  onToggleWorkType: (value: string) => void
  onClearSubcategories: () => void
  onClearJobLevels: () => void
  onClearWorkTypes: () => void
  onClearAll: () => void
  onApply: () => void
  activeCount: number
}) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerClose asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute right-6 top-6"
            aria-label="Đóng bộ lọc"
          >
            <X />
          </Button>
        </DrawerClose>
        <DrawerHeader className="pr-16">
          <DrawerTitle className="flex items-center gap-2">
            <SlidersHorizontal className="size-4" />
            Tất cả bộ lọc
            {activeCount > 0 && <Badge variant="secondary">{activeCount}</Badge>}
          </DrawerTitle>
          <DrawerDescription>
            Xem và điều chỉnh các lựa chọn tìm kiếm hiện tại.
          </DrawerDescription>
        </DrawerHeader>
        <div className="max-h-[55svh] space-y-5 overflow-y-auto px-6 pb-6 text-left">
          <section className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Từ khóa tìm kiếm
            </p>
            <p className="text-sm">{keyword || "Chưa nhập từ khóa"}</p>
          </section>
          <Separator />
          <section className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Địa điểm
            </p>
            <p className="text-sm">{location || "Tất cả địa điểm"}</p>
          </section>
          <Separator />
          <CategoryDrawerSection
            categories={filterOptions.categories}
            selected={selectedSubcategories}
            onToggle={onToggleSubcategory}
            onClear={onClearSubcategories}
          />
          <Separator />
          <FilterDrawerSection
            title="Cấp bậc"
            options={filterOptions.levels}
            selected={selectedJobLevels}
            onToggle={onToggleJobLevel}
            onClear={onClearJobLevels}
          />
          <Separator />
          <FilterDrawerSection
            title="Hình thức làm việc"
            options={filterOptions.workTypes}
            selected={selectedWorkTypes}
            onToggle={onToggleWorkType}
            onClear={onClearWorkTypes}
          />
        </div>
        <DrawerFooter className="grid grid-cols-2">
          <Button
            type="button"
            variant="outline"
            disabled={activeCount === 0}
            onClick={onClearAll}
          >
            Xóa tất cả ({activeCount})
          </Button>
          <Button
            type="button"
            onClick={() => {
              onApply()
              onOpenChange(false)
            }}
          >
            Áp dụng
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function CategoryDrawerSection({
  categories,
  selected,
  onToggle,
  onClear,
}: {
  categories: JobCategoryOption[]
  selected: string[]
  onToggle: (value: string) => void
  onClear: () => void
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Danh mục
        </p>
        {selected.length > 0 && (
          <Button type="button" variant="ghost" size="sm" onClick={onClear}>
            Xóa ({selected.length})
          </Button>
        )}
      </div>
      <div className="space-y-4">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div key={category.slug} className="space-y-2">
              <p className="text-sm font-medium">{category.name}</p>
              <div className="flex flex-wrap gap-2">
                {category.subcategories.map((subcategory) => (
                  <Button
                    key={subcategory.slug}
                    type="button"
                    variant={
                      selected.includes(subcategory.slug)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => onToggle(subcategory.slug)}
                  >
                    {subcategory.name}
                  </Button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            Chưa có danh mục tìm kiếm.
          </p>
        )}
      </div>
    </section>
  )
}

function FilterDrawerSection({
  title,
  options,
  selected,
  onToggle,
  onClear,
}: {
  title: string
  options: string[] | SlugOption[]
  selected: string[]
  onToggle: (value: string) => void
  onClear: () => void
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {title}
        </p>
        {selected.length > 0 && (
          <Button type="button" variant="ghost" size="sm" onClick={onClear}>
            Xóa ({selected.length})
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const value = typeof option === "string" ? option : option.slug
          const label = typeof option === "string" ? option : option.name

          return (
            <Button
              key={value}
              type="button"
              variant={selected.includes(value) ? "default" : "outline"}
              size="sm"
              onClick={() => onToggle(value)}
            >
              {label}
            </Button>
          )
        })}
      </div>
    </section>
  )
}

export function JobsSearch({
  filterOptions,
  initialState,
}: {
  filterOptions: JobFilterOptions
  initialState: JobsSearchState
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [keyword, setKeyword] = useState(initialState.search)
  const [location, setLocation] = useState(initialState.location)
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    initialState.subcategorySlugs
  )
  const [selectedJobLevels, setSelectedJobLevels] = useState<string[]>(
    initialState.levelSlugs
  )
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>(
    initialState.workTypes
  )
  const [drawerOpen, setDrawerOpen] = useState(false)

  const totalActiveFilters =
    (keyword.trim() ? 1 : 0) +
    (location ? 1 : 0) +
    selectedSubcategories.length +
    selectedJobLevels.length +
    selectedWorkTypes.length

  const replaceQuery = (update: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString())

    update(params)

    const queryString = params.toString()
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    })
  }

  const setArrayParams = (
    params: URLSearchParams,
    key: string,
    values: string[]
  ) => {
    params.delete(key)
    values.forEach((value) => params.append(key, value))
  }

  const applySearch = () => {
    replaceQuery((params) => {
      const search = keyword.trim()

      if (search) {
        params.set("search", search)
      } else {
        params.delete("search")
      }

      if (location) {
        params.set("location", location)
      } else {
        params.delete("location")
      }

      setArrayParams(params, "categorySlugs", initialState.categorySlugs)
      setArrayParams(params, "subcategorySlugs", selectedSubcategories)
      setArrayParams(params, "levelSlugs", selectedJobLevels)
      setArrayParams(params, "workTypes", selectedWorkTypes)
      params.set("page", "1")
      params.delete("jobSlug")
    })
  }

  const clearAllFilters = () => {
    setKeyword("")
    setLocation("")
    setSelectedSubcategories([])
    setSelectedJobLevels([])
    setSelectedWorkTypes([])
    replaceQuery((params) => {
      params.delete("search")
      params.delete("location")
      params.delete("categorySlugs")
      params.delete("subcategorySlugs")
      params.delete("levelSlugs")
      params.delete("workTypes")
      params.delete("page")
      params.delete("jobSlug")
    })
  }

  return (
    <section className="border-b bg-background">
      <UserContainer className="flex flex-col gap-3 py-4">
        <div className="grid gap-3 lg:grid-cols-[12rem_1fr_10rem]">
          <CategoryPopover
            categories={filterOptions.categories}
            selected={selectedSubcategories}
            onToggle={(value) => toggleValue(setSelectedSubcategories, value)}
            onClear={() => setSelectedSubcategories([])}
          />
          <div className="grid gap-3 md:grid-cols-[1fr_13rem]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="MBBank tuyển dụng nhiều vị trí"
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
              />
            </div>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Địa điểm" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.locations.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="button" onClick={applySearch}>
            Tìm kiếm
          </Button>
        </div>
        <div className="flex flex-wrap gap-3">
          <MultiFilterPopover
            label="Cấp bậc"
            icon={Users}
            options={filterOptions.levels}
            selected={selectedJobLevels}
            onToggle={(value) => toggleValue(setSelectedJobLevels, value)}
            onClear={() => setSelectedJobLevels([])}
          />
          <MultiFilterPopover
            label="Hình thức làm việc"
            icon={BriefcaseBusiness}
            options={filterOptions.workTypes}
            selected={selectedWorkTypes}
            onToggle={(value) => toggleValue(setSelectedWorkTypes, value)}
            onClear={() => setSelectedWorkTypes([])}
          />
          <Button type="button" onClick={() => setDrawerOpen(true)}>
            <SlidersHorizontal />
            Tất cả bộ lọc
            {totalActiveFilters > 0 && (
              <Badge variant="secondary">{totalActiveFilters}</Badge>
            )}
          </Button>
          {totalActiveFilters > 0 && (
            <Button type="button" variant="ghost" onClick={clearAllFilters}>
              <X />
              Xóa lọc
            </Button>
          )}
        </div>
      </UserContainer>

      <AllFiltersDrawer
        filterOptions={filterOptions}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        keyword={keyword}
        location={location}
        selectedSubcategories={selectedSubcategories}
        selectedJobLevels={selectedJobLevels}
        selectedWorkTypes={selectedWorkTypes}
        activeCount={totalActiveFilters}
        onToggleSubcategory={(value) =>
          toggleValue(setSelectedSubcategories, value)
        }
        onToggleJobLevel={(value) => toggleValue(setSelectedJobLevels, value)}
        onToggleWorkType={(value) => toggleValue(setSelectedWorkTypes, value)}
        onClearSubcategories={() => setSelectedSubcategories([])}
        onClearJobLevels={() => setSelectedJobLevels([])}
        onClearWorkTypes={() => setSelectedWorkTypes([])}
        onClearAll={clearAllFilters}
        onApply={applySearch}
      />
    </section>
  )
}
