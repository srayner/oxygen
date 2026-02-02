import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🗑️  Deleting existing data...')

  await prisma.user.deleteMany()
  await prisma.role.deleteMany()

  console.log('🌱 Creating roles...')

  const userRole = await prisma.role.create({
    data: { name: 'user' },
  })

  const adminRole = await prisma.role.create({
    data: { name: 'admin' },
  })

  console.log('👤 Creating users...')

  const userPassword = await hash('password123', 12)
  const adminPassword = await hash('admin123', 12)

  await prisma.user.create({
    data: {
      email: 'user@example.com',
      username: 'user',
      hashedPassword: userPassword,
      name: 'Test User',
      verified: true,
      roleId: userRole.id,
    },
  })

  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      username: 'admin',
      hashedPassword: adminPassword,
      name: 'Admin User',
      verified: true,
      roleId: adminRole.id,
    },
  })

  console.log('✅ Fixtures loaded successfully!')
  console.log('')
  console.log('Default users:')
  console.log('  - user@example.com / password123 (user role)')
  console.log('  - admin@example.com / admin123 (admin role)')
}

main()
  .catch((e) => {
    console.error('❌ Error loading fixtures:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
