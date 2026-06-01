"use client"

import { useState, type Dispatch, type SetStateAction } from "react"
import {
  BriefcaseBusiness,
  BriefcaseIcon,
  Building2,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Heart,
  ListFilter,
  MapPin,
  Search,
  SlidersHorizontal,
  Users,
  X,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const PAGE_SIZE = 5

const experienceLevels = [
  "Intern",
  "Fresher",
  "Junior",
  "Middle",
  "Senior",
  "Trưởng nhóm",
  "Trưởng phòng",
  "Director",
]

const workTypes = ["Fulltime", "Hybrid", "Remote", "Oversea"]

const locations = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Remote"]

const jobCategories = [
  {
    label: "IT",
    subcategories: [
      "Business Analyst",
      "Backend Developer",
      "Data Engineer",
      "DevOps",
      "UI/UX Designer",
      "Game Artist",
    ],
  },
  {
    label: "Business, Finance",
    subcategories: ["Ngân hàng", "Fintech", "Phân tích kinh doanh"],
  },
  {
    label: "Management",
    subcategories: ["Project Coordinator", "Product Manager", "PMO"],
  },
]

const jobs = [
  {
    id: 1,
    initials: "VP",
    title: "Chuyên viên Phân tích nghiệp vụ (BA)",
    company: "Công ty Dịch vụ Số Bưu điện (Vietnam Post Digital)",
    salary: "12.000.000 VND to 25.000.000 VND",
    location: "Quận Nam Từ Liêm, Hà Nội",
    type: "Fulltime",
    experience: "Junior",
    category: "Business Analyst",
    tags: ["Business Analyst"],
    posted: "1 week ago",
    deadline: "03-06-2026",
    companySize: "500+ nhân sự",
    sections: [
      {
        title: "Mô tả công việc",
        items: [
          "Xây dựng quy trình nghiệp vụ (sử dụng UML), cập nhật mô tả - diễn giải trong tài liệu quy trình nghiệp vụ.",
          "Dựng layout - mockup.",
          "Trao đổi tư vấn sản phẩm, đưa ra giải pháp tối ưu dự án.",
          "Xây dựng tài liệu phân tích yêu cầu nghiệp vụ cho hệ thống.",
          "Viết tài liệu và quản lý các yêu cầu.",
          "Tổ chức các cuộc họp trao đổi, chốt thông tin với các bộ phận liên quan.",
          "Làm việc với đối tác outsource nếu dự án cần outsource.",
          "Hỗ trợ QC nhằm đáp ứng sản phẩm trước khi đẩy lên production.",
        ],
      },
      {
        title: "Kỹ năng & trình độ của bạn",
        items: [
          "Yêu cầu từ 1 năm kinh nghiệm làm IT BA.",
          "Đã có bằng Cao đẳng/Đại học chuyên ngành Điện tử - Viễn thông, CNTT.",
          "Có khả năng đọc hiểu tài liệu tiếng Anh.",
          "Khả năng lấy yêu cầu, phân tích yêu cầu nghiệp vụ, viết tài liệu.",
          "Sử dụng tốt UML, Microsoft Word, Excel, Project, Visio, Axure.",
        ],
      },
      {
        title: "Quyền lợi",
        items: [
          "Thu nhập: 12.000.000 VNĐ - 25.000.000 VNĐ.",
          "Được xét tăng lương theo định kỳ.",
          "Thưởng lễ, Tết, phụ cấp ăn trưa.",
        ],
      },
    ],
  },
  {
    id: 2,
    initials: "EM",
    title: "Mid-level UI/UX Designer",
    company: "CÔNG TY TNHH EMCT",
    salary: "Up to 1.000 USD",
    location: "Quận 4, Hồ Chí Minh",
    type: "Hybrid",
    experience: "Middle",
    category: "UI/UX Designer",
    tags: ["HTML5", "Graphic Design", "UI/UX"],
    posted: "4 days ago",
    deadline: "30-06-2026",
    companySize: "100-300 nhân sự",
    sections: [
      {
        title: "Mô tả công việc",
        items: [
          "Thiết kế UI/UX cho các sản phẩm web và mobile.",
          "Làm việc chặt chẽ với team product và developer.",
          "Xây dựng design system và component library.",
          "Thực hiện user research và usability testing.",
        ],
      },
      {
        title: "Yêu cầu",
        items: [
          "Tối thiểu 2 năm kinh nghiệm UI/UX.",
          "Thành thạo Figma, Adobe XD.",
          "Có portfolio rõ ràng và đa dạng.",
        ],
      },
    ],
  },
  {
    id: 3,
    initials: "NS",
    title: "[Việt Nam] UI Game Artist",
    company: "CÔNG TY TNHH NSTAGE VIỆT NAM",
    salary: "Negotiable",
    location: "Hà Nội",
    type: "Fulltime",
    experience: "Middle",
    category: "Game Artist",
    tags: ["UX/UI Design", "Game", "Game Design"],
    posted: "2 days ago",
    deadline: "15-07-2026",
    companySize: "50-100 nhân sự",
    sections: [
      {
        title: "Mô tả công việc",
        items: [
          "Thiết kế UI cho game mobile theo phong cách anime/cartoon.",
          "Phối hợp với game designer và programmer.",
          "Tạo asset UI: icon, button, frame, popup, loading screen.",
        ],
      },
      {
        title: "Yêu cầu",
        items: [
          "Kinh nghiệm thiết kế game UI tối thiểu 1 năm.",
          "Thành thạo Photoshop, Illustrator.",
          "Yêu thích game, am hiểu thị trường game Việt Nam.",
        ],
      },
    ],
  },
  {
    id: 4,
    initials: "KI",
    title: "IT Project Coordinator",
    company: "CÔNG TY CỔ PHẦN CHỨNG KHOÁN KIS VIỆT NAM",
    salary: "Negotiable",
    location: "Quận 1, Hồ Chí Minh",
    type: "Fulltime",
    experience: "Senior",
    category: "Project Coordinator",
    tags: ["PMO", "Project Coordinator"],
    posted: "3 days ago",
    deadline: "20-06-2026",
    companySize: "300+ nhân sự",
    sections: [
      {
        title: "Mô tả công việc",
        items: [
          "Hỗ trợ quản lý và điều phối các dự án IT trong công ty.",
          "Theo dõi tiến độ, báo cáo tình trạng dự án.",
          "Lên lịch họp, ghi chép biên bản và theo dõi action items.",
        ],
      },
      {
        title: "Yêu cầu",
        items: [
          "Tốt nghiệp đại học chuyên ngành CNTT, Quản trị dự án.",
          "Kinh nghiệm trong môi trường tài chính/chứng khoán là lợi thế.",
          "Kỹ năng giao tiếp và tổ chức tốt.",
        ],
      },
    ],
  },
  {
    id: 5,
    initials: "TK",
    title: "Senior Backend Developer (Java)",
    company: "CÔNG TY CỔ PHẦN CÔNG NGHỆ TIKI",
    salary: "40.000.000 - 60.000.000 VND",
    location: "Quận 1, Hồ Chí Minh",
    type: "Remote",
    experience: "Senior",
    category: "Backend Developer",
    tags: ["Java", "Spring Boot", "Microservices"],
    posted: "5 days ago",
    deadline: "10-07-2026",
    companySize: "1000+ nhân sự",
    sections: [
      {
        title: "Mô tả công việc",
        items: [
          "Thiết kế và phát triển microservices phục vụ hàng triệu người dùng.",
          "Tối ưu hóa hiệu suất hệ thống backend.",
          "Code review và mentoring junior developers.",
        ],
      },
      {
        title: "Yêu cầu",
        items: [
          "Tối thiểu 4 năm kinh nghiệm Java backend.",
          "Thành thạo Spring Boot, Hibernate, Kafka, Redis.",
          "Kinh nghiệm với hệ thống phân tán và microservices.",
        ],
      },
    ],
  },
  {
    id: 6,
    initials: "MM",
    title: "DevOps Engineer",
    company: "CÔNG TY TNHH MOMO",
    salary: "30.000.000 - 50.000.000 VND",
    location: "Quận 4, Hồ Chí Minh",
    type: "Hybrid",
    experience: "Senior",
    category: "DevOps",
    tags: ["AWS", "Kubernetes", "Terraform"],
    posted: "1 day ago",
    deadline: "25-06-2026",
    companySize: "1000+ nhân sự",
    sections: [
      {
        title: "Mô tả công việc",
        items: [
          "Quản lý và vận hành hạ tầng cloud AWS.",
          "Xây dựng CI/CD pipeline cho các dịch vụ.",
          "Giám sát hệ thống và xử lý sự cố.",
        ],
      },
      {
        title: "Yêu cầu",
        items: [
          "Tối thiểu 3 năm kinh nghiệm DevOps.",
          "Thành thạo AWS, Docker, Kubernetes.",
          "Kinh nghiệm với Terraform hoặc Ansible.",
        ],
      },
    ],
  },
  {
    id: 7,
    initials: "TC",
    title: "Product Manager - Fintech",
    company: "NGÂN HÀNG TMCP KỸ THƯƠNG VIỆT NAM",
    salary: "Negotiable",
    location: "Hoàn Kiếm, Hà Nội",
    type: "Fulltime",
    experience: "Trưởng phòng",
    category: "Product Manager",
    tags: ["Product Management", "Fintech", "Agile"],
    posted: "6 days ago",
    deadline: "30-06-2026",
    companySize: "5000+ nhân sự",
    sections: [
      {
        title: "Mô tả công việc",
        items: [
          "Xác định và ưu tiên các tính năng sản phẩm fintech.",
          "Làm việc chặt chẽ với engineering, design và business stakeholders.",
          "Phân tích dữ liệu người dùng để định hướng phát triển sản phẩm.",
        ],
      },
      {
        title: "Yêu cầu",
        items: [
          "Tối thiểu 3 năm kinh nghiệm product management trong fintech.",
          "Hiểu biết về payment, lending hoặc digital banking.",
          "Kinh nghiệm làm việc với Agile/Scrum.",
        ],
      },
    ],
  },
  {
    id: 8,
    initials: "VN",
    title: "Data Engineer",
    company: "CÔNG TY CỔ PHẦN VNG",
    salary: "25.000.000 - 45.000.000 VND",
    location: "Quận 10, Hồ Chí Minh",
    type: "Fulltime",
    experience: "Middle",
    category: "Data Engineer",
    tags: ["Python", "Spark", "Data Pipeline"],
    posted: "2 days ago",
    deadline: "05-07-2026",
    companySize: "1000+ nhân sự",
    sections: [
      {
        title: "Mô tả công việc",
        items: [
          "Xây dựng và duy trì data pipeline phục vụ phân tích.",
          "Thiết kế data warehouse và data lake trên cloud.",
          "Tối ưu hóa hiệu suất các ETL jobs.",
        ],
      },
      {
        title: "Yêu cầu",
        items: [
          "Tối thiểu 2 năm kinh nghiệm data engineering.",
          "Thành thạo Python, SQL, Apache Spark.",
          "Kinh nghiệm với cloud data platforms.",
        ],
      },
    ],
  },
]

type Job = (typeof jobs)[number]

function CompanyMark({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex size-11 shrink-0 items-center justify-center rounded-md border bg-muted text-sm font-semibold text-muted-foreground">
      {children}
    </div>
  )
}

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

function shortLocation(location: string) {
  return `${location.split(",")[0]}...`
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
  options: string[]
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
        {options.map((option) => (
          <Button
            key={option}
            type="button"
            variant="ghost"
            className="justify-start"
            onClick={() => onToggle(option)}
          >
            <span
              className={cn(
                "flex size-4 items-center justify-center rounded-[6px] border",
                selected.includes(option) &&
                "border-primary bg-primary text-primary-foreground"
              )}
            >
              {selected.includes(option) && <Check className="size-3" />}
            </span>
            {option}
          </Button>
        ))}
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
  selected,
  onToggle,
  onClear,
}: {
  selected: string[]
  onToggle: (value: string) => void
  onClear: () => void
}) {
  const [activeCategory, setActiveCategory] = useState(jobCategories[0].label)
  const active =
    jobCategories.find((category) => category.label === activeCategory) ??
    jobCategories[0]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button">
          <ListFilter />
          Danh mục ({selected.length})
          <ChevronDown className="transition-transform group-data-[state=open]/button:rotate-180" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[34rem] gap-0 p-0">
        <div className="grid min-h-72 grid-cols-[12rem_1fr]">
          <div className="border-r p-2">
            {jobCategories.map((category) => {
              const hasSelected = category.subcategories.some((subcategory) =>
                selected.includes(subcategory)
              )

              return (
                <Button
                  key={category.label}
                  type="button"
                  variant={
                    activeCategory === category.label ? "secondary" : "ghost"
                  }
                  className="w-full justify-between"
                  onClick={() => setActiveCategory(category.label)}
                >
                  <span className="flex items-center gap-2">
                    {hasSelected && (
                      <span className="size-1.5 rounded-full bg-primary" />
                    )}
                    {category.label}
                  </span>
                  <ChevronRight />
                </Button>
              )
            })}
          </div>
          <div className="p-3">
            <p className="px-2 pb-2 text-xs text-muted-foreground">
              {active.label}
            </p>
            <div className="grid gap-1">
              {active.subcategories.map((subcategory) => (
                <Button
                  key={subcategory}
                  type="button"
                  variant="ghost"
                  className="justify-between"
                  onClick={() => onToggle(subcategory)}
                >
                  {subcategory}
                  {selected.includes(subcategory) && <Check />}
                </Button>
              ))}
            </div>
          </div>
        </div>
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

function JobCard({
  job,
  selected,
  saved,
  onSelect,
  onToggleSave,
}: {
  job: Job
  selected: boolean
  saved: boolean
  onSelect: () => void
  onToggleSave: () => void
}) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onSelect()
        }
      }}
      className={cn(
        "w-full cursor-pointer rounded-lg border bg-background p-3.5 text-left transition-colors hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        selected && "border-primary bg-muted/40"
      )}
    >
      <div className="flex gap-3">
        <CompanyMark>{job.initials}</CompanyMark>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold">{job.title}</h2>
          <p className="truncate text-xs text-muted-foreground">{job.company}</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs">
            <BriefcaseIcon className="size-3.5 shrink-0" />
            {job.salary}
          </p>
          <div className="mt-1.5 flex min-w-0 items-center gap-3 text-xs text-muted-foreground">
            <span className="flex min-w-0 items-center gap-1">
              <MapPin className="size-3 shrink-0" />
              <span className="truncate">{shortLocation(job.location)}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock3 className="size-3" />
              {job.type}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {job.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>{job.posted}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={saved ? "Bỏ lưu việc làm" : "Lưu việc làm"}
          onClick={(event) => {
            event.stopPropagation()
            onToggleSave()
          }}
        >
          <Heart fill={saved ? "currentColor" : "none"} />
        </Button>
      </div>
    </article>
  )
}

function AllFiltersSheet({
  open,
  onOpenChange,
  keyword,
  location,
  selectedCategories,
  selectedExperience,
  selectedWorkTypes,
  onToggleCategory,
  onToggleExperience,
  onToggleWorkType,
  onClearCategories,
  onClearExperience,
  onClearWorkTypes,
  onClearAll,
  activeCount,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  keyword: string
  location: string
  selectedCategories: string[]
  selectedExperience: string[]
  selectedWorkTypes: string[]
  onToggleCategory: (value: string) => void
  onToggleExperience: (value: string) => void
  onToggleWorkType: (value: string) => void
  onClearCategories: () => void
  onClearExperience: () => void
  onClearWorkTypes: () => void
  onClearAll: () => void
  activeCount: number
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <SlidersHorizontal className="size-4" />
            Tất cả bộ lọc
            {activeCount > 0 && <Badge variant="secondary">{activeCount}</Badge>}
          </SheetTitle>
          <SheetDescription>
            Xem và điều chỉnh các lựa chọn tìm kiếm hiện tại.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-5 overflow-y-auto px-6 pb-6">
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
          <FilterSheetSection
            title="Danh mục"
            options={jobCategories.flatMap((category) => category.subcategories)}
            selected={selectedCategories}
            onToggle={onToggleCategory}
            onClear={onClearCategories}
          />
          <Separator />
          <FilterSheetSection
            title="Kinh nghiệm làm việc"
            options={experienceLevels}
            selected={selectedExperience}
            onToggle={onToggleExperience}
            onClear={onClearExperience}
          />
          <Separator />
          <FilterSheetSection
            title="Hình thức làm việc"
            options={workTypes}
            selected={selectedWorkTypes}
            onToggle={onToggleWorkType}
            onClear={onClearWorkTypes}
          />
        </div>
        <SheetFooter className="flex-row">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            disabled={activeCount === 0}
            onClick={onClearAll}
          >
            Xóa tất cả ({activeCount})
          </Button>
          <Button
            type="button"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Áp dụng
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function FilterSheetSection({
  title,
  options,
  selected,
  onToggle,
  onClear,
}: {
  title: string
  options: string[]
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
        {options.map((option) => (
          <Button
            key={option}
            type="button"
            variant={selected.includes(option) ? "default" : "outline"}
            size="sm"
            onClick={() => onToggle(option)}
          >
            {option}
          </Button>
        ))}
      </div>
    </section>
  )
}

export default function JobsPage() {
  const [keyword, setKeyword] = useState("")
  const [location, setLocation] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedExperience, setSelectedExperience] = useState<string[]>([])
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([])
  const [selectedJobId, setSelectedJobId] = useState(jobs[0].id)
  const [savedJobIds, setSavedJobIds] = useState<number[]>([])
  const [page, setPage] = useState(1)
  const [sheetOpen, setSheetOpen] = useState(false)

  const totalPages = Math.max(1, Math.ceil(jobs.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const paginatedJobs = jobs.slice(pageStart, pageStart + PAGE_SIZE)
  const selectedJob = jobs.find((job) => job.id === selectedJobId) ?? jobs[0]
  const totalActiveFilters =
    (keyword.trim() ? 1 : 0) +
    (location ? 1 : 0) +
    selectedCategories.length +
    selectedExperience.length +
    selectedWorkTypes.length

  const toggleSavedJob = (id: number) => {
    setSavedJobIds((current) =>
      current.includes(id)
        ? current.filter((savedId) => savedId !== id)
        : [...current, id]
    )
  }
  const clearAllFilters = () => {
    setKeyword("")
    setLocation("")
    setSelectedCategories([])
    setSelectedExperience([])
    setSelectedWorkTypes([])
  }

  return (
    <div className="min-h-[calc(100svh-4rem)] bg-background">
      <section className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6">
          <div className="grid gap-3 lg:grid-cols-[12rem_1fr_10rem]">
            <CategoryPopover
              selected={selectedCategories}
              onToggle={(value) => {
                toggleValue(setSelectedCategories, value)
              }}
              onClear={() => {
                setSelectedCategories([])
              }}
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
              <Select
                value={location}
                onValueChange={(value) => {
                  setLocation(value)
                }}
              >
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
            <Button type="button">Tìm kiếm</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <MultiFilterPopover
              label="Kinh nghiệm làm việc"
              icon={Users}
              options={experienceLevels}
              selected={selectedExperience}
              onToggle={(value) => {
                toggleValue(setSelectedExperience, value)
              }}
              onClear={() => {
                setSelectedExperience([])
              }}
            />
            <MultiFilterPopover
              label="Hình thức làm việc"
              icon={BriefcaseBusiness}
              options={workTypes}
              selected={selectedWorkTypes}
              onToggle={(value) => {
                toggleValue(setSelectedWorkTypes, value)
              }}
              onClear={() => {
                setSelectedWorkTypes([])
              }}
            />
            <Button
              type="button"
              onClick={() => setSheetOpen(true)}
            >
              <SlidersHorizontal />
              Tất cả bộ lọc
              {totalActiveFilters > 0 && (
                <Badge variant="secondary">{totalActiveFilters}</Badge>
              )}
            </Button>
            {(keyword ||
              location ||
              selectedCategories.length > 0 ||
              selectedExperience.length > 0 ||
              selectedWorkTypes.length > 0) && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setKeyword("")
                    setLocation("")
                    clearAllFilters()
                  }}
                >
                  <X />
                  Xóa lọc
                </Button>
              )}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl px-4 sm:px-6 lg:grid-cols-[24rem_1fr]">
        <aside className="border-r">
          <div className="flex flex-col gap-2.5 py-3 pr-3">
            {paginatedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                selected={selectedJob?.id === job.id}
                saved={savedJobIds.includes(job.id)}
                onSelect={() => setSelectedJobId(job.id)}
                onToggleSave={() => toggleSavedJob(job.id)}
              />
            ))}
          </div>
          <div className="flex items-center justify-between border-t px-4 py-3 text-xs text-muted-foreground">
            <span>
              {`${pageStart + 1}-${Math.min(
                pageStart + PAGE_SIZE,
                jobs.length
              )} / ${jobs.length}`}
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="Trang trước"
                disabled={currentPage === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                <ChevronLeft />
              </Button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <Button
                    key={pageNumber}
                    type="button"
                    variant={currentPage === pageNumber ? "default" : "ghost"}
                    size="icon-sm"
                    aria-current={currentPage === pageNumber ? "page" : undefined}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                )
              )}
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="Trang sau"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        </aside>

        <main className="min-w-0 py-5 lg:pl-7">
          {selectedJob ? (
            <>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <CompanyMark>{selectedJob.initials}</CompanyMark>
                <div className="min-w-0 flex-1">
                  <div className="flex gap-3">
                    <div className="min-w-0 flex-1">
                      <h1 className="text-lg font-semibold sm:text-xl">
                        {selectedJob.title}
                      </h1>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {selectedJob.company}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={
                        savedJobIds.includes(selectedJob.id)
                          ? "Bỏ lưu việc làm"
                          : "Lưu việc làm"
                      }
                      className="shrink-0"
                      onClick={() => toggleSavedJob(selectedJob.id)}
                    >
                      <Heart
                        fill={
                          savedJobIds.includes(selectedJob.id)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </Button>
                  </div>
                  <p className="mt-2 flex items-center gap-1.5 text-sm">
                    <BriefcaseIcon className="size-4" />
                    {selectedJob.salary}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-4" />
                      {selectedJob.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock3 className="size-4" />
                      Hạn nộp hồ sơ: {selectedJob.deadline}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {selectedJob.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button className="w-full sm:w-auto">Ứng tuyển ngay</Button>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-6">
                {selectedJob.sections.map((section, index) => (
                  <section key={section.title}>
                    <div className="mb-3 flex items-center gap-2">
                      <span className="flex size-7 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
                        {index + 1}
                      </span>
                      <h2 className="text-base font-semibold">
                        {section.title}
                      </h2>
                    </div>
                    <ul className="space-y-2 pl-7 text-sm leading-6">
                      {section.items.map((item) => (
                        <li
                          key={item}
                          className="list-disc marker:text-muted-foreground"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>

              <Separator className="my-6" />

              <section>
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
                    {selectedJob.sections.length + 1}
                  </span>
                  <h2 className="text-base font-semibold">Thông tin công ty</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border p-3">
                    <Building2 className="mb-2 size-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Công ty</p>
                    <p className="mt-0.5 text-sm">{selectedJob.company}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <Users className="mb-2 size-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Quy mô</p>
                    <p className="mt-0.5 text-sm">{selectedJob.companySize}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <MapPin className="mb-2 size-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Địa điểm</p>
                    <p className="mt-0.5 text-sm">{selectedJob.location}</p>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <div className="rounded-lg border p-6 text-sm text-muted-foreground">
              Chọn một việc làm để xem chi tiết.
            </div>
          )}
        </main>
      </section>

      <AllFiltersSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        keyword={keyword}
        location={location}
        selectedCategories={selectedCategories}
        selectedExperience={selectedExperience}
        selectedWorkTypes={selectedWorkTypes}
        activeCount={totalActiveFilters}
        onToggleCategory={(value) => {
          toggleValue(setSelectedCategories, value)
        }}
        onToggleExperience={(value) => {
          toggleValue(setSelectedExperience, value)
        }}
        onToggleWorkType={(value) => {
          toggleValue(setSelectedWorkTypes, value)
        }}
        onClearCategories={() => setSelectedCategories([])}
        onClearExperience={() => setSelectedExperience([])}
        onClearWorkTypes={() => setSelectedWorkTypes([])}
        onClearAll={clearAllFilters}
      />
    </div>
  )
}
