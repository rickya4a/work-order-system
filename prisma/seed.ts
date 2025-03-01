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