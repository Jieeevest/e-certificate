/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth/auth";
import { jsonDb } from "@/lib/db/jsonDb";

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

    // Get all certificates
    const allCertificates = await (await jsonDb.certificate()).findMany({});

    // Get all students for joining
    const allStudents = await (await jsonDb.student()).findMany();

    // Create a map of students by ID for quick lookup
    const studentsMap = allStudents.reduce((map, student) => {
      map[student.id] = student;
      return map;
    }, {} as Record<string, any>);

    // Filter certificates based on search and status
    let certificates = allCertificates
      .map((cert) => ({
        ...cert,
        student: studentsMap[cert.studentId] || null,
        studentName: studentsMap[cert.studentId]?.name || "",
        studentNim: studentsMap[cert.studentId]?.nim || "",
      }))
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    // Apply status filter if provided
    if (status) {
      certificates = certificates.filter((cert) => cert.status === status);
    }

    // Apply search filter if provided
    if (search && search.trim() !== "") {
      const searchLower = search.toLowerCase();
      certificates = certificates.filter(
        (cert) =>
          cert.title.toLowerCase().includes(searchLower) ||
          (cert.description &&
            cert.description.toLowerCase().includes(searchLower)) ||
          (cert.student &&
            cert.student.name.toLowerCase().includes(searchLower)) ||
          (cert.student && cert.student.nim.toLowerCase().includes(searchLower))
      );
    }

    return NextResponse.json({ certificates });
  } catch (error) {
    console.error("Error getting certificates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
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
    const student = await (
      await jsonDb.student()
    ).findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Create certificate
    const newCertificate = await (
      await jsonDb.certificate()
    ).create({
      data: {
        title,
        description: description || "",
        studentId,
        issueDate: issueDate
          ? new Date(issueDate).toISOString()
          : new Date().toISOString(),
        status: "PENDING", // Default status
      },
    });

    // Include student data in response
    const certificateWithStudent = {
      ...newCertificate,
      student,
    };

    return NextResponse.json(
      { certificate: certificateWithStudent },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating certificate:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
