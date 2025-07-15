import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getUserFromToken } from "@/lib/auth/auth";

const prisma = new PrismaClient();

// GET /api/students - Get all students
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token and get user
    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get search query from URL
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";

    // Get all students with optional search
    const students = await prisma.student.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { nim: { contains: search, mode: "insensitive" } },
          { major: { contains: search, mode: "insensitive" } },
        ],
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ students });
  } catch (error) {
    console.error("Error getting students:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/students - Create a new student
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token and get user
    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get request body
    const { nim, name, major, year } = await request.json();

    // Validate request body
    if (!nim || !name || !major || !year) {
      return NextResponse.json(
        { error: "NIM, name, major, and year are required" },
        { status: 400 }
      );
    }

    // Check if NIM already exists
    const existingStudent = await prisma.student.findUnique({
      where: { nim },
    });

    if (existingStudent) {
      return NextResponse.json(
        { error: "Student with this NIM already exists" },
        { status: 400 }
      );
    }

    // Create student
    const newStudent = await prisma.student.create({
      data: {
        nim,
        name,
        major,
        year,
      },
    });

    return NextResponse.json({ student: newStudent }, { status: 201 });
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
