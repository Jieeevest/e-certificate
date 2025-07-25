import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth/auth";
import { jsonDb } from "@/lib/db/jsonDb";

// GET /api/certificates/[id] - Get a specific certificate
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

    // Get certificate
    const certificate = await (
      await jsonDb.certificate()
    ).findUnique({
      where: { id },
    });

    // Get student data if certificate exists
    let student = null;
    if (certificate) {
      student = await (
        await jsonDb.student()
      ).findUnique({
        where: { id: certificate.studentId },
      });
    }

    if (!certificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      certificate: {
        ...certificate,
        student,
      },
    });
  } catch (error) {
    console.error("Error getting certificate:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/certificates/[id] - Update a certificate
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
    const { title, description, studentId, issueDate, status } =
      await request.json();

    // Validate request body
    if (!title || !studentId) {
      return NextResponse.json(
        { error: "Title and studentId are required" },
        { status: 400 }
      );
    }

    // Check if certificate exists
    const existingCertificate = await (
      await jsonDb.certificate()
    ).findUnique({
      where: { id },
    });

    if (!existingCertificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    // Check if student exists
    if (studentId) {
      const student = await (
        await jsonDb.student()
      ).findUnique({
        where: { id: studentId },
      });

      if (!student) {
        return NextResponse.json(
          { error: "Student not found" },
          { status: 404 }
        );
      }
    }

    // Update certificate
    const updatedCertificate = await (
      await jsonDb.certificate()
    ).update({
      where: { id },
      data: {
        title,
        description: description || "",
        studentId,
        issueDate: issueDate
          ? new Date(issueDate).toISOString()
          : existingCertificate.issueDate,
        status: status || existingCertificate.status,
      },
    });

    // Get student data
    const student = await (
      await jsonDb.student()
    ).findUnique({
      where: { id: updatedCertificate?.studentId },
    });

    return NextResponse.json({
      certificate: {
        ...updatedCertificate,
        student,
      },
    });
  } catch (error) {
    console.error("Error updating certificate:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/certificates/[id] - Delete a certificate
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

    // Check if certificate exists
    const existingCertificate = await (
      await jsonDb.certificate()
    ).findUnique({
      where: { id },
    });

    if (!existingCertificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    // Delete certificate
    await (
      await jsonDb.certificate()
    ).delete({
      where: { id },
    });

    return NextResponse.json({ message: "Certificate deleted successfully" });
  } catch (error) {
    console.error("Error deleting certificate:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
