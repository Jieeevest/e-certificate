import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { jsonDb } from "@/lib/db/jsonDb";

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
    // Check if admin user exists
    const existingAdmin = await (await jsonDb.user()).findUnique({
      where: { username: "admin" },
    });
    
    let adminUser;
    if (!existingAdmin) {
      adminUser = await (await jsonDb.user()).create({
        data: {
          username: "admin",
          password: await hashPassword("admin123"),
          name: "Administrator",
          role: "ADMIN",
        },
      });
    } else {
      adminUser = existingAdmin;
    }

    // Check if staff user exists
    const existingStaff = await (await jsonDb.user()).findUnique({
      where: { username: "staff" },
    });
    
    let staffUser;
    if (!existingStaff) {
      staffUser = await (await jsonDb.user()).create({
        data: {
          username: "staff",
          password: await hashPassword("staff123"),
          name: "Staff User",
          role: "STAFF",
        },
      });
    } else {
      staffUser = existingStaff;
    }

    // Check if student1 exists
    const existingStudent1 = await (await jsonDb.student()).findUnique({
      where: { nim: "12345678" },
    });
    
    let student1;
    if (!existingStudent1) {
      student1 = await (await jsonDb.student()).create({
        data: {
          nim: "12345678",
          name: "Budi Santoso",
          email: "budi@example.com",
          phone: "081234567890",
          major: "Teknik Informatika",
          enrollmentDate: new Date().toISOString(),
        },
      });
    } else {
      student1 = existingStudent1;
    }

    // Check if student2 exists
    const existingStudent2 = await (await jsonDb.student()).findUnique({
      where: { nim: "87654321" },
    });
    
    let student2;
    if (!existingStudent2) {
      student2 = await (await jsonDb.student()).create({
        data: {
          nim: "87654321",
          name: "Siti Rahayu",
          email: "siti@example.com",
          phone: "089876543210",
          major: "Sistem Informasi",
          enrollmentDate: new Date().toISOString(),
        },
      });
    } else {
      student2 = existingStudent2;
    }

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
  }
}
