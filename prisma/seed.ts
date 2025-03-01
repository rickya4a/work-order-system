import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create Production Manager
  const manager = await prisma.user.create({
    data: {
      email: 'manager@example.com',
      name: 'Production Manager',
      password: await hash('password123', 10),
      role: 'PRODUCTION_MANAGER',
    },
  })

  // Create Operator
  const operator = await prisma.user.create({
    data: {
      email: 'operator@example.com',
      name: 'Operator 1',
      password: await hash('password123', 10),
      role: 'OPERATOR',
    },
  })

  // Create 10 work orders & status histories
  for (let i = 0; i < 10; i++) {
    const workOrder = await prisma.workOrder.create({
      data: {
        productName: `Product ${i + 1}`,
        orderNumber: `WO-${i + 1}`,
        operatorId: operator.id,
        status: 'PENDING',
        quantity: 100,
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    await prisma.statusHistory.create({
      data: {
        workOrderId: workOrder.id,
        status: 'PENDING',
        createdAt: new Date(),
        quantity: 100,
        notes: `Notes ${i + 1}`,
      },
    })
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