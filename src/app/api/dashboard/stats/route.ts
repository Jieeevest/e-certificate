import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth/auth";
import { jsonDb } from "@/lib/db/jsonDb";

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
    const totalStudents = await jsonDb.count('student');

    // Get total certificates count
    const totalCertificates = await jsonDb.count('certificate');
    
    // Get certificates by status
    const statusCounts = await jsonDb.countCertificatesByStatus();
    
    // Extract counts by status
    const pendingCertificates = statusCounts.PENDING || 0;
    const issuedCertificates = statusCounts.ISSUED || 0;
    const revokedCertificates = statusCounts.REVOKED || 0;
    const expiredCertificates = statusCounts.EXPIRED || 0;

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
  }
}
