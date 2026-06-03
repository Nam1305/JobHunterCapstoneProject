"use client"

import { useState, type Dispatch, type SetStateAction } from "react"
import {
  BriefcaseBusiness,
  BriefcaseIcon,
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
import { UserContainer } from "@/components/user/user-container"
import { cn } from "@/lib/utils"
import type { JobCard, JobDetails } from "@/types/job"

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

const jobs: JobDetails[] = [
  {
    id: "7d49dc16-cf59-4bb0-90f3-6b0d558cb61e",
    companyId: "0935c729-42a3-4a58-9558-543d514386c9",
    branchId: "34f7a76a-f881-47ed-9f14-8f7791208d0e",
    subcategoryId: null,
    title: "Chuyên viên Phân tích nghiệp vụ (BA)",
    companyName: "Công ty Dịch vụ Số Bưu điện (Vietnam Post Digital)",
    companyImage: null,
    salaryRange: "12.000.000 VND to 25.000.000 VND",
    responsibilities:
      "Xây dựng quy trình nghiệp vụ (sử dụng UML), cập nhật mô tả - diễn giải trong tài liệu quy trình nghiệp vụ.\nDựng layout - mockup.\nTrao đổi tư vấn sản phẩm, đưa ra giải pháp tối ưu dự án.\nXây dựng tài liệu phân tích yêu cầu nghiệp vụ cho hệ thống.",
    requirements:
      "Yêu cầu từ 1 năm kinh nghiệm làm IT BA.\nĐã có bằng Cao đẳng/Đại học chuyên ngành Điện tử - Viễn thông, CNTT.\nCó khả năng đọc hiểu tài liệu tiếng Anh.\nSử dụng tốt UML, Microsoft Word, Excel, Project, Visio, Axure.",
    experienceRequirement: "Junior",
    benefits:
      "Thu nhập: 12.000.000 VNĐ - 25.000.000 VNĐ.\nĐược xét tăng lương theo định kỳ.\nThưởng lễ, Tết, phụ cấp ăn trưa.",
    workType: "Onsite",
    expiredAt: "2026-06-30T17:00:00+07:00",
    tags: ["Business Analyst"],
    slug: "chuyen-vien-phan-tich-nghiep-vu-ba",
    city: "Hà Nội",
    branch: {
      id: "34f7a76a-f881-47ed-9f14-8f7791208d0e",
      companyId: "0935c729-42a3-4a58-9558-543d514386c9",
      name: "Công ty Dịch vụ Số Bưu điện (Vietnam Post Digital)",
      address: "Quận Nam Từ Liêm, Hà Nội",
      city: "Hà Nội",
      citySlug: "ha-noi",
    },
    jobLevels: ["Junior"],
  },
  {
    id: "7a3e9718-164f-40f3-8298-dcf1fbfc9a6e",
    companyId: "0c9c4691-3e2e-41d5-a0b3-50a04f91866b",
    branchId: "cf15b8c8-7f73-448c-8f5c-fc2b6af62475",
    subcategoryId: null,
    title: "Mid-level UI/UX Designer",
    companyName: "CÔNG TY TNHH EMCT",
    companyImage: null,
    salaryRange: "Up to 1.000 USD",
    responsibilities:
      "Thiết kế UI/UX cho các sản phẩm web và mobile.\nLàm việc chặt chẽ với team product và developer.\nXây dựng design system và component library.\nThực hiện user research và usability testing.",
    requirements:
      "Tối thiểu 2 năm kinh nghiệm UI/UX.\nThành thạo Figma, Adobe XD.\nCó portfolio rõ ràng và đa dạng.",
    experienceRequirement: "Middle",
    benefits: null,
    workType: "Hybrid",
    expiredAt: "2026-06-30T17:00:00+07:00",
    tags: ["HTML5", "Graphic Design", "UI/UX"],
    slug: "mid-level-ui-ux-designer",
    city: "Hồ Chí Minh",
    branch: {
      id: "cf15b8c8-7f73-448c-8f5c-fc2b6af62475",
      companyId: "0c9c4691-3e2e-41d5-a0b3-50a04f91866b",
      name: "CÔNG TY TNHH EMCT",
      address: "Quận 4, Hồ Chí Minh",
      city: "Hồ Chí Minh",
      citySlug: "ho-chi-minh",
    },
    jobLevels: ["Middle"],
  },
  {
    id: "e9a29681-c7ea-4e2c-b8fb-db7ac8159998",
    companyId: "cbb6c0f6-ed7f-4f19-b6bd-89b43c8b24e8",
    branchId: "7654227f-e8f6-4fe4-88c7-4148c1176e82",
    subcategoryId: null,
    title: "[Việt Nam] UI Game Artist",
    companyName: "CÔNG TY TNHH NSTAGE VIỆT NAM",
    companyImage: null,
    salaryRange: "Negotiable",
    responsibilities:
      "Thiết kế UI cho game mobile theo phong cách anime/cartoon.\nPhối hợp với game designer và programmer.\nTạo asset UI: icon, button, frame, popup, loading screen.",
    requirements:
      "Kinh nghiệm thiết kế game UI tối thiểu 1 năm.\nThành thạo Photoshop, Illustrator.\nYêu thích game, am hiểu thị trường game Việt Nam.",
    experienceRequirement: "Middle",
    benefits: null,
    workType: "Onsite",
    expiredAt: "2026-07-15T17:00:00+07:00",
    tags: ["UX/UI Design", "Game", "Game Design"],
    slug: "viet-nam-ui-game-artist",
    city: "Hà Nội",
    branch: {
      id: "7654227f-e8f6-4fe4-88c7-4148c1176e82",
      companyId: "cbb6c0f6-ed7f-4f19-b6bd-89b43c8b24e8",
      name: "CÔNG TY TNHH NSTAGE VIỆT NAM",
      address: "Hà Nội",
      city: "Hà Nội",
      citySlug: "ha-noi",
    },
    jobLevels: ["Middle"],
  },
  {
    id: "de14fb3b-5dec-45b9-a767-3e098b37e56c",
    companyId: "dbf7f8df-1d53-43f5-bba2-e9d8292315af",
    branchId: "cd48a486-5526-4063-a7a8-b79f2d777ff1",
    subcategoryId: null,
    title: "IT Project Coordinator",
    companyName: "CÔNG TY CỔ PHẦN CHỨNG KHOÁN KIS VIỆT NAM",
    companyImage: null,
    salaryRange: "Negotiable",
    responsibilities:
      "Hỗ trợ quản lý và điều phối các dự án IT trong công ty.\nTheo dõi tiến độ, báo cáo tình trạng dự án.\nLên lịch họp, ghi chép biên bản và theo dõi action items.",
    requirements:
      "Tốt nghiệp đại học chuyên ngành CNTT, Quản trị dự án.\nKinh nghiệm trong môi trường tài chính/chứng khoán là lợi thế.\nKỹ năng giao tiếp và tổ chức tốt.",
    experienceRequirement: "Senior",
    benefits: null,
    workType: "Onsite",
    expiredAt: "2026-06-20T17:00:00+07:00",
    tags: ["PMO", "Project Coordinator"],
    slug: "it-project-coordinator",
    city: "Hồ Chí Minh",
    branch: {
      id: "cd48a486-5526-4063-a7a8-b79f2d777ff1",
      companyId: "dbf7f8df-1d53-43f5-bba2-e9d8292315af",
      name: "CÔNG TY CỔ PHẦN CHỨNG KHOÁN KIS VIỆT NAM",
      address: "Quận 1, Hồ Chí Minh",
      city: "Hồ Chí Minh",
      citySlug: "ho-chi-minh",
    },
    jobLevels: ["Senior"],
  },
  {
    id: "481022da-d305-4202-8401-1c0a516c77e0",
    companyId: "960a7241-a898-4eb9-b72f-1938308f7e0d",
    branchId: "d14680c1-62ec-4ae1-b4de-ac3bb1754cc9",
    subcategoryId: null,
    title: "Senior Backend Developer (Java)",
    companyName: "CÔNG TY CỔ PHẦN CÔNG NGHỆ TIKI",
    companyImage: null,
    salaryRange: "40.000.000 - 60.000.000 VND",
    responsibilities:
      "Thiết kế và phát triển microservices phục vụ hàng triệu người dùng.\nTối ưu hóa hiệu suất hệ thống backend.\nCode review và mentoring junior developers.",
    requirements:
      "Tối thiểu 4 năm kinh nghiệm Java backend.\nThành thạo Spring Boot, Hibernate, Kafka, Redis.\nKinh nghiệm với hệ thống phân tán và microservices.",
    experienceRequirement: "Senior",
    benefits: null,
    workType: "Remote",
    expiredAt: "2026-07-10T17:00:00+07:00",
    tags: ["Java", "Spring Boot", "Microservices"],
    slug: "senior-backend-developer-java",
    city: "Hồ Chí Minh",
    branch: {
      id: "d14680c1-62ec-4ae1-b4de-ac3bb1754cc9",
      companyId: "960a7241-a898-4eb9-b72f-1938308f7e0d",
      name: "CÔNG TY CỔ PHẦN CÔNG NGHỆ TIKI",
      address: "Quận 1, Hồ Chí Minh",
      city: "Hồ Chí Minh",
      citySlug: "ho-chi-minh",
    },
    jobLevels: ["Senior"],
  },
  {
    id: "da7df316-7c59-46dc-88b8-23679af3a0e7",
    companyId: "cd278233-8be4-42ec-9e2b-311b8ec49d88",
    branchId: "b906051d-34e4-4318-bf15-455e968fc40e",
    subcategoryId: null,
    title: "DevOps Engineer",
    companyName: "CÔNG TY TNHH MOMO",
    companyImage: null,
    salaryRange: "30.000.000 - 50.000.000 VND",
    responsibilities:
      "Quản lý và vận hành hạ tầng cloud AWS.\nXây dựng CI/CD pipeline cho các dịch vụ.\nGiám sát hệ thống và xử lý sự cố.",
    requirements:
      "Tối thiểu 3 năm kinh nghiệm DevOps.\nThành thạo AWS, Docker, Kubernetes.\nKinh nghiệm với Terraform hoặc Ansible.",
    experienceRequirement: "Senior",
    benefits: null,
    workType: "Hybrid",
    expiredAt: "2026-06-25T17:00:00+07:00",
    tags: ["AWS", "Kubernetes", "Terraform"],
    slug: "devops-engineer",
    city: "Hồ Chí Minh",
    branch: {
      id: "b906051d-34e4-4318-bf15-455e968fc40e",
      companyId: "cd278233-8be4-42ec-9e2b-311b8ec49d88",
      name: "CÔNG TY TNHH MOMO",
      address: "Quận 4, Hồ Chí Minh",
      city: "Hồ Chí Minh",
      citySlug: "ho-chi-minh",
    },
    jobLevels: ["Senior"],
  },
  {
    id: "a1aa0154-2533-4ad5-8467-187c84d573f5",
    companyId: "e9f46e1e-d432-4f9b-b4aa-ed3954dc05da",
    branchId: "d7e782c8-6bc2-4276-a0dd-e8daa4e927da",
    subcategoryId: null,
    title: "Product Manager - Fintech",
    companyName: "NGÂN HÀNG TMCP KỸ THƯƠNG VIỆT NAM",
    companyImage: null,
    salaryRange: "Negotiable",
    responsibilities:
      "Xác định và ưu tiên các tính năng sản phẩm fintech.\nLàm việc chặt chẽ với engineering, design và business stakeholders.\nPhân tích dữ liệu người dùng để định hướng phát triển sản phẩm.",
    requirements:
      "Tối thiểu 3 năm kinh nghiệm product management trong fintech.\nHiểu biết về payment, lending hoặc digital banking.\nKinh nghiệm làm việc với Agile/Scrum.",
    experienceRequirement: "3 năm",
    benefits: null,
    workType: "Onsite",
    expiredAt: "2026-06-30T17:00:00+07:00",
    tags: ["Product Management", "Fintech", "Agile"],
    slug: "product-manager-fintech",
    city: "Hà Nội",
    branch: {
      id: "d7e782c8-6bc2-4276-a0dd-e8daa4e927da",
      companyId: "e9f46e1e-d432-4f9b-b4aa-ed3954dc05da",
      name: "NGÂN HÀNG TMCP KỸ THƯƠNG VIỆT NAM",
      address: "Hoàn Kiếm, Hà Nội",
      city: "Hà Nội",
      citySlug: "ha-noi",
    },
    jobLevels: ["Trưởng phòng"],
  },
  {
    id: "103f8c8b-4637-42df-b477-686063324a5f",
    companyId: "45986afd-4afb-40f0-ac0b-bce6298a0c95",
    branchId: "edee9d82-94f2-4bc8-a28d-b4389c7f7b8e",
    subcategoryId: null,
    title: "Data Engineer",
    companyName: "CÔNG TY CỔ PHẦN VNG",
    companyImage: null,
    salaryRange: "25.000.000 - 45.000.000 VND",
    responsibilities:
      "Xây dựng và duy trì data pipeline phục vụ phân tích.\nThiết kế data warehouse và data lake trên cloud.\nTối ưu hóa hiệu suất các ETL jobs.",
    requirements:
      "Tối thiểu 2 năm kinh nghiệm data engineering.\nThành thạo Python, SQL, Apache Spark.\nKinh nghiệm với cloud data platforms.",
    experienceRequirement: "Middle",
    benefits: null,
    workType: "Onsite",
    expiredAt: "2026-07-05T17:00:00+07:00",
    tags: ["Python", "Spark", "Data Pipeline"],
    slug: "data-engineer",
    city: "Hồ Chí Minh",
    branch: {
      id: "edee9d82-94f2-4bc8-a28d-b4389c7f7b8e",
      companyId: "45986afd-4afb-40f0-ac0b-bce6298a0c95",
      name: "CÔNG TY CỔ PHẦN VNG",
      address: "Quận 10, Hồ Chí Minh",
      city: "Hồ Chí Minh",
      citySlug: "ho-chi-minh",
    },
    jobLevels: ["Middle"],
  },
]

function CompanyMark({
  image,
  name,
}: {
  image: string | null
  name: string
}) {
  return (
    <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted text-sm font-semibold text-muted-foreground">
      {image ? (
        <span
          aria-label={`${name} logo`}
          className="size-full bg-contain bg-center bg-no-repeat"
          role="img"
          style={{ backgroundImage: `url(${image})` }}
        />
      ) : (
        getCompanyMark(name)
      )}
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

function getCompanyMark(name: string | null | undefined) {
  return (name ?? "CO")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
}

function shortLocation(location: string | null | undefined) {
  if (!location) return "Chưa cập nhật"

  return location.includes(",") ? `${location.split(",")[0]}...` : location
}

function formatDaysUntil(expiredAt: string | null) {
  if (!expiredAt) return "Chưa cập nhật hạn"

  const diff = new Date(expiredAt).getTime() - Date.now()
  const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))

  return days === 0 ? "Hết hạn hôm nay" : `Còn ${days} ngày`
}

function formatDeadline(expiredAt: string | null) {
  if (!expiredAt) return "Chưa cập nhật"

  return new Intl.DateTimeFormat("vi-VN").format(new Date(expiredAt))
}

function textItems(value: string | null) {
  return value?.split("\n").filter(Boolean) ?? []
}

function getJobSections(job: JobDetails) {
  return [
    {
      title: "Mô tả công việc",
      items: textItems(job.responsibilities),
    },
    {
      title: "Yêu cầu",
      items: textItems(job.requirements),
    },
    {
      title: "Quyền lợi",
      items: textItems(job.benefits),
    },
  ]
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

function JobListCard({
  job,
  selected,
  saved,
  onSelect,
  onToggleSave,
}: {
  job: JobCard
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
        <CompanyMark image={job.companyImage} name={job.companyName} />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold">
            {job.title ?? "Chưa cập nhật tiêu đề"}
          </h2>
          <p className="truncate text-xs text-muted-foreground">
            {job.companyName}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs">
            <BriefcaseIcon className="size-3.5 shrink-0" />
            {job.salaryRange ?? "Thương lượng"}
          </p>
          <div className="mt-1.5 flex min-w-0 items-center gap-3 text-xs text-muted-foreground">
            <span className="flex min-w-0 items-center gap-1">
              <MapPin className="size-3 shrink-0" />
              <span className="truncate">{shortLocation(job.city)}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock3 className="size-3" />
              {job.workType ?? "Chưa cập nhật"}
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
        <span>{formatDaysUntil(job.expiredAt)}</span>
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
  const [savedJobIds, setSavedJobIds] = useState<string[]>([])
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

  const toggleSavedJob = (id: string) => {
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
        <UserContainer className="flex flex-col gap-3 py-4">
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
        </UserContainer>
      </section>

      <UserContainer as="section" className="grid lg:grid-cols-[24rem_1fr]">
        <aside className="border-r">
          <div className="flex flex-col gap-2.5 py-3 pr-3">
            {paginatedJobs.map((job) => (
              <JobListCard
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
                <CompanyMark
                  image={selectedJob.companyImage}
                  name={selectedJob.companyName}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex gap-3">
                    <div className="min-w-0 flex-1">
                      <h1 className="text-lg font-semibold sm:text-xl">
                        {selectedJob.title ?? "Chưa cập nhật tiêu đề"}
                      </h1>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {selectedJob.companyName}
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
                    {selectedJob.salaryRange ?? "Thương lượng"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-4" />
                      {selectedJob.branch?.address ??
                        selectedJob.city ??
                        "Chưa cập nhật địa điểm"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock3 className="size-4" />
                      Hạn nộp hồ sơ: {formatDeadline(selectedJob.expiredAt)}
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
                {getJobSections(selectedJob).map((section, index) => (
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
                      {section.items.length > 0 ? (
                        section.items.map((item) => (
                          <li
                            key={item}
                            className="list-disc marker:text-muted-foreground"
                          >
                            {item}
                          </li>
                        ))
                      ) : (
                        <li className="list-none text-muted-foreground">
                          Chưa cập nhật
                        </li>
                      )}
                    </ul>
                  </section>
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-lg border p-6 text-sm text-muted-foreground">
              Chọn một việc làm để xem chi tiết.
            </div>
          )}
        </main>
      </UserContainer>

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
