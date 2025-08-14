// src/routes/index.tsx
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { Button } from '@/components/ui/button'
import { PrismaClient } from '@prisma-app/client'

const prisma = new PrismaClient()

const getCount = createServerFn({
  method: 'GET',
}).handler(async () => {
  const countRecord = await prisma.count.findUnique({
    where: { id: 1 }
  })
  return countRecord?.count ?? 0
})

const updateCount = createServerFn({ method: 'POST' })
  .validator((d: number) => d)
  .handler(async ({ data }) => {
    await prisma.count.upsert({
      where: { id: 1 },
      update: { count: { increment: data } },
      create: { id: 1, count: data }
    })
  })

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => await getCount(),
})

function Home() {
  const router = useRouter()
  const state = Route.useLoaderData()

  return (
    <Button
      onClick={() => {
        updateCount({ data: 1 }).then(() => {
          router.invalidate()
        })
      }}
    >
      Add 1 to {state}?
    </Button>
  )
}