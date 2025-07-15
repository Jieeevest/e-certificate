/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

// GET /api/certificates - Get all certificates
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

    // Get search query and status filter from URL
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || undefined;

    // Build where clause
    const whereClause: any = {};

    // Add search condition if provided
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { student: { name: { contains: search, mode: "insensitive" } } },
        { student: { nim: { contains: search, mode: "insensitive" } } },
      ];
    }

    // Add status filter if provided
    if (status) {
      whereClause.status = status;
    }

    // Get all certificates with optional search and filter
    const certificates = await prisma.certificate.findMany({
      where: whereClause,
      include: {
        student: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ certificates });
  } catch (error) {
    console.error("Error getting certificates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/certificates - Create a new certificate
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
    const { title, description, studentId, issueDate } = await request.json();

    // Validate request body
    if (!title || !studentId) {
      return NextResponse.json(
        { error: "Title and studentId are required" },
        { status: 400 }
      );
    }

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Create certificate
    const newCertificate = await prisma.certificate.create({
      data: {
        title,
        description: description || "",
        studentId,
        issueDate: issueDate ? new Date(issueDate) : undefined,
        status: "PENDING", // Default status
      },
      include: {
        student: true,
      },
    });

    return NextResponse.json({ certificate: newCertificate }, { status: 201 });
  } catch (error) {
    console.error("Error creating certificate:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
