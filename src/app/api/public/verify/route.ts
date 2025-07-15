import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { certificateId } = body;

    if (!certificateId) {
      return NextResponse.json(
        { success: false, message: 'ID sertifikat diperlukan' },
        { status: 400 }
      );
    }

    // Find certificate with student information
    const certificate = await prisma.certificate.findUnique({
      where: { id: certificateId },
      include: {
        student: {
          select: {
            id: true,
            nim: true,
            name: true,
            major: true,
            enrollmentDate: true,
          },
        },
      },
    });

    if (!certificate) {
      return NextResponse.json(
        { success: false, message: 'Sertifikat tidak ditemukan' },
        { status: 404 }
      );
    }

    // Return certificate data
    return NextResponse.json({
      success: true,
      certificate: {
        id: certificate.id,
        title: certificate.title,
        description: certificate.description,
        issueDate: certificate.issueDate,
        expiryDate: certificate.expiryDate,
        status: certificate.status,
        student: certificate.student,
      },
    });
  } catch (error) {
    console.error('Error verifying certificate:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}