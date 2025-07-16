import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth/auth";
import { jsonDb } from "@/lib/db/jsonDb";

// GET /api/students/[id] - Get a specific student
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Get student
    const student = await (await jsonDb.student()).findUnique({
      where: { id },
    });
    
    // Get certificates for this student
    const certificates = student ? await (await jsonDb.certificate()).findMany({
      where: { studentId: id },
    }) : [];

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      student: {
        ...student,
        certificates
      }
    });
  } catch (error) {
    console.error("Error getting student:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/students/[id] - Update a student
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Check if student exists
    const existingStudent = await (await jsonDb.student()).findUnique({
      where: { id },
    });

    if (!existingStudent) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Check if NIM already exists (for another student)
    if (nim !== existingStudent.nim) {
      const nimExists = await (await jsonDb.student()).findUnique({
        where: { nim },
      });

      if (nimExists) {
        return NextResponse.json(
          { error: "Student with this NIM already exists" },
          { status: 400 }
        );
      }
    }

    // Update student
    const updatedStudent = await (await jsonDb.student()).update({
      where: { id },
      data: {
        nim,
        name,
        major,
        year,
      },
    });

    return NextResponse.json({ student: updatedStudent });
  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/students/[id] - Delete a student
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Check if student exists
    const existingStudent = await (await jsonDb.student()).findUnique({
      where: { id },
    });
    
    // Get certificates for this student
    const certificates = existingStudent ? await (await jsonDb.certificate()).findMany({
      where: { studentId: id },
    }) : [];

    if (!existingStudent) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Check if student has certificates
    if (certificates.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete student with certificates" },
        { status: 400 }
      );
    }

    // Delete student
    await (await jsonDb.student()).delete({
      where: { id },
    });

    return NextResponse.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
