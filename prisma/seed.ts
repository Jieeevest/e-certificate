import { PrismaClient, Role } from '../src/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Hash password using bcrypt to match the login function
async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

async function main() {
  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: await hashPassword('admin123'),
      name: 'Administrator',
      role: Role.ADMIN,
    },
  })

  // Create staff user
  const staffUser = await prisma.user.upsert({
    where: { username: 'staff' },
    update: {},
    create: {
      username: 'staff',
      password: await hashPassword('staff123'),
      name: 'Staff User',
      role: Role.STAFF,
    },
  })

  // Create sample students
  const student1 = await prisma.student.upsert({
    where: { nim: '12345678' },
    update: {},
    create: {
      nim: '12345678',
      name: 'Budi Santoso',
      email: 'budi@example.com',
      phone: '081234567890',
      major: 'Teknik Informatika',
    },
  })

  const student2 = await prisma.student.upsert({
    where: { nim: '87654321' },
    update: {},
    create: {
      nim: '87654321',
      name: 'Siti Rahayu',
      email: 'siti@example.com',
      phone: '089876543210',
      major: 'Sistem Informasi',
    },
  })

  console.log({ adminUser, staffUser, student1, student2 })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })