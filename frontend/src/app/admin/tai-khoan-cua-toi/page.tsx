import { AccountInformationForm } from "./account-information-form"
import { ProfilePictureUpload } from "./profile-picture-upload"

export default function AdminAccountPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Tài khoản của tôi
        </h1>
        <p className="text-sm text-muted-foreground">
          Quản lý ảnh đại diện, thông tin cá nhân và bảo mật tài khoản.
        </p>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[320px_1fr]">
        <ProfilePictureUpload />
        <AccountInformationForm />
      </div>
    </main>
  )
}
