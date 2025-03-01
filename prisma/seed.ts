import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create Production Manager
  const manager = await prisma.user.createManyAndReturn({
    select: { id: true },
    data: [
      {
        email: 'manager@example.com',
        name: 'Production Manager',
        password: await hash('password123', 10),
        role: 'PRODUCTION_MANAGER',
      },
    ],
    skipDuplicates: true,
  })

  // Create Operator
  const operator = await prisma.user.createManyAndReturn({
    select: { id: true },
    data: [
      {
        email: 'operator@example.com',
        name: 'Operator 1',
        password: await hash('password123', 10),
        role: 'OPERATOR',
      },
    ],
    skipDuplicates: true,
  })

  // Create 10 work orders & status histories
  if (operator.length > 0) {
    for (let i = 0; i < 10; i++) {
      const workOrder = await prisma.workOrder.createManyAndReturn({
        select: { id: true },
        data: [
          {
            productName: `Product ${i + 1}`,
            orderNumber: `WO-${i + 1}`,
            operatorId: operator[0].id,
            status: 'PENDING',
            quantity: 100,
            deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        skipDuplicates: true,
      })

      await prisma.statusHistory.createManyAndReturn({
        select: { id: true },
        data: [
          {
            workOrderId: workOrder[0].id,
            status: 'PENDING',
            createdAt: new Date(),
            quantity: 100,
            notes: `Notes ${i + 1}`,
          },
        ],
        skipDuplicates: true,
      })
    }
  }

  console.log({ manager, operator })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })