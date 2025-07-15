import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

// GET /api/dashboard/stats - Get dashboard statistics
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

    // Get total students count
    const totalStudents = await prisma.student.count();

    // Get total certificates count
    const totalCertificates = await prisma.certificate.count();

    // Get pending certificates count
    const pendingCertificates = await prisma.certificate.count({
      where: { status: "PENDING" },
    });

    // Get issued certificates count
    const issuedCertificates = await prisma.certificate.count({
      where: { status: "ISSUED" },
    });

    // Get revoked certificates count
    const revokedCertificates = await prisma.certificate.count({
      where: { status: "REVOKED" },
    });

    // Get expired certificates count
    const expiredCertificates = await prisma.certificate.count({
      where: { status: "EXPIRED" },
    });

    // Return statistics
    return NextResponse.json({
      totalStudents,
      totalCertificates,
      pendingCertificates,
      issuedCertificates,
      revokedCertificates,
      expiredCertificates,
    });
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
