import { CompanyBrandingForm } from "@/components/hr/company-branding-form"
import { CompanyBranch } from "@/components/hr/company-branch"
import { CompanyGeneralInformationForm } from "@/components/hr/company-general-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function CompanyInformationForm() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-6 p-4 md:p-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-normal">
              Thông tin công ty
            </h1>
            <p className="text-base text-muted-foreground">
              Quản lý hồ sơ và thông tin công ty của bạn.
            </p>
          </div>

          <Tabs defaultValue="general" className="w-full">
            <TabsList
              variant="default"
              className="w-full max-w-max rounded-full bg-muted p-1"
            >
              <TabsTrigger value="general">Thông tin chung</TabsTrigger>
              <TabsTrigger value="branding">Branding</TabsTrigger>
              <TabsTrigger value="branches">Quản lý chi nhánh</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-6">
              <CompanyGeneralInformationForm />
            </TabsContent>

            <TabsContent value="branding" className="mt-6">
              <CompanyBrandingForm />
            </TabsContent>

            <TabsContent value="branches" className="mt-6">
              <CompanyBranch />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
