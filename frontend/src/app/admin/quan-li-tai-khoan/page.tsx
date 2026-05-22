import { UserInfoDataTable } from "@/components/dashboard/data-table"
import type { Userinfo } from "@/types/user"

const users: Userinfo[] = [
  {
    id: "USR-001",
    name: "Nguyen Van An",
    phone: "0901234567",
    email: "an.nguyen@example.com",
    avatar: null,
    role: "Admin",
  },
  {
    id: "USR-002",
    name: "Tran Thi Binh",
    phone: "0912345678",
    email: "binh.tran@example.com",
    avatar: null,
    role: "HR",
  },
  {
    id: "USR-003",
    name: "Le Minh Chau",
    phone: "0923456789",
    email: "chau.le@example.com",
    avatar: null,
    role: "Candidate",
  },
  {
    id: "USR-004",
    name: "Pham Quoc Duy",
    phone: null,
    email: "duy.pham@example.com",
    avatar: null,
    role: "HR",
  },
  {
    id: "USR-005",
    name: "Hoang Mai Anh",
    phone: "0934567890",
    email: "anh.hoang@example.com",
    avatar: null,
    role: "Candidate",
  },
  {
    id: "USR-006",
    name: "Do Gia Bao",
    phone: "0945678901",
    email: "bao.do@example.com",
    avatar: null,
    role: "Candidate",
  },
  {
    id: "USR-007",
    name: "Vu Thanh Lam",
    phone: "0956789012",
    email: "lam.vu@example.com",
    avatar: null,
    role: "HR",
  },
  {
    id: "USR-008",
    name: "Dang Ngoc Linh",
    phone: "0967890123",
    email: "linh.dang@example.com",
    avatar: null,
    role: "Candidate",
  },
  {
    id: "USR-009",
    name: "Bui Tuan Kiet",
    phone: null,
    email: "kiet.bui@example.com",
    avatar: null,
    role: "Admin",
  },
  {
    id: "USR-010",
    name: "Vo Ha My",
    phone: "0978901234",
    email: "my.vo@example.com",
    avatar: null,
    role: "Candidate",
  },
  {
    id: "USR-011",
    name: "Mai Duc Huy",
    phone: "0989012345",
    email: "huy.mai@example.com",
    avatar: null,
    role: "HR",
  },
  {
    id: "USR-012",
    name: "Phan Thao Nhi",
    phone: "0890123456",
    email: "nhi.phan@example.com",
    avatar: null,
    role: "Candidate",
  },
]

export default function AccountManagementPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
      <UserInfoDataTable data={users} />
    </main>
  )
}
