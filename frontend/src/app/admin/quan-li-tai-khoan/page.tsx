import { UserInfoDataTable } from "./user-table"

export default function AccountManagementPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
      <UserInfoDataTable />
    </main>
  )
}
