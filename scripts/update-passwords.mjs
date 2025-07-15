import { PrismaClient } from '../src/generated/prisma/index.js'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

async function main() {
  // Update admin user password
  await prisma.user.update({
    where: { username: 'admin' },
    data: {
      password: await hashPassword('admin123'),
    },
  })

  // Update staff user password
  await prisma.user.update({
    where: { username: 'staff' },
    data: {
      password: await hashPassword('staff123'),
    },
  })

  console.log('Passwords updated successfully!')
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