import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "❌ Forbidden in production" },
      { status: 403 }
    );
  }

  try {
    const adminUser = await prisma.user.upsert({
      where: { username: "admin" },
      update: {},
      create: {
        username: "admin",
        password: await hashPassword("admin123"),
        name: "Administrator",
        role: "ADMIN",
      },
    });

    const staffUser = await prisma.user.upsert({
      where: { username: "staff" },
      update: {},
      create: {
        username: "staff",
        password: await hashPassword("staff123"),
        name: "Staff User",
        role: "STAFF",
      },
    });

    const student1 = await prisma.student.upsert({
      where: { nim: "12345678" },
      update: {},
      create: {
        nim: "12345678",
        name: "Budi Santoso",
        email: "budi@example.com",
        phone: "081234567890",
        major: "Teknik Informatika",
      },
    });

    const student2 = await prisma.student.upsert({
      where: { nim: "87654321" },
      update: {},
      create: {
        nim: "87654321",
        name: "Siti Rahayu",
        email: "siti@example.com",
        phone: "089876543210",
        major: "Sistem Informasi",
      },
    });

    return NextResponse.json({
      message: "✅ Seed complete",
      users: [adminUser.username, staffUser.username],
      students: [student1.nim, student2.nim],
    });
  } catch (error) {
    console.error("❌ Seed error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
