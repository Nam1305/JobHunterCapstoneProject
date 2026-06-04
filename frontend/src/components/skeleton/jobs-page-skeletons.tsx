import { UserContainer } from "@/components/user/user-container"

const PAGE_SIZE = 5

export function JobsSearchSkeleton() {
  return (
    <section className="border-b bg-background">
      <UserContainer className="flex flex-col gap-3 py-4">
        <div className="grid gap-3 lg:grid-cols-[12rem_1fr_10rem]">
          <div className="h-9 animate-pulse rounded-4xl bg-muted" />
          <div className="grid gap-3 md:grid-cols-[1fr_13rem]">
            <div className="h-9 animate-pulse rounded-md bg-muted" />
            <div className="h-9 animate-pulse rounded-4xl bg-muted" />
          </div>
          <div className="h-9 animate-pulse rounded-4xl bg-muted" />
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="h-9 w-28 animate-pulse rounded-4xl bg-muted" />
          <div className="h-9 w-40 animate-pulse rounded-4xl bg-muted" />
          <div className="h-9 w-32 animate-pulse rounded-4xl bg-muted" />
        </div>
      </UserContainer>
    </section>
  )
}

function JobCardSkeleton() {
  return (
    <div className="rounded-lg border bg-background p-3.5">
      <div className="flex gap-3">
        <div className="size-11 shrink-0 animate-pulse rounded-md bg-muted" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
          <div className="h-3 w-3/5 animate-pulse rounded bg-muted" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
          <div className="flex gap-2">
            <div className="h-5 w-16 animate-pulse rounded-4xl bg-muted" />
            <div className="h-5 w-20 animate-pulse rounded-4xl bg-muted" />
          </div>
        </div>
      </div>
      <div className="mt-3 h-3 w-20 animate-pulse rounded bg-muted" />
    </div>
  )
}

export function JobCardListSkeleton() {
  return (
    <aside className="border-r">
      <div className="flex flex-col gap-2.5 py-3 pr-3">
        {Array.from({ length: PAGE_SIZE }, (_, index) => (
          <JobCardSkeleton key={index} />
        ))}
      </div>
      <div className="flex items-center justify-between border-t px-4 py-3">
        <div className="h-4 w-16 animate-pulse rounded bg-muted" />
        <div className="flex gap-1.5">
          <div className="size-8 animate-pulse rounded-full bg-muted" />
          <div className="size-8 animate-pulse rounded-full bg-muted" />
          <div className="size-8 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
    </aside>
  )
}

export function SelectedJobDetailSkeleton() {
  return (
    <main className="min-w-0 py-5 lg:sticky lg:top-16 lg:pl-7">
      <div className="flex gap-3">
        <div className="size-11 shrink-0 animate-pulse rounded-md bg-muted" />
        <div className="min-w-0 flex-1 space-y-3">
          <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
          <div className="flex gap-2">
            <div className="h-6 w-20 animate-pulse rounded-4xl bg-muted" />
            <div className="h-6 w-24 animate-pulse rounded-4xl bg-muted" />
          </div>
        </div>
      </div>
      <div className="my-4 h-px bg-border" />
      <div className="space-y-6">
        {Array.from({ length: 3 }, (_, index) => (
          <section key={index} className="space-y-3">
            <div className="h-5 w-40 animate-pulse rounded bg-muted" />
            <div className="space-y-2 pl-7">
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
