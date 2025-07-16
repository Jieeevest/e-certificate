import { NextRequest, NextResponse } from 'next/server';
import { jsonDb } from '@/lib/db/jsonDb';

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

    // Find certificate
    const certificate = await (await jsonDb.certificate()).findUnique({
      where: { id: certificateId },
    });
    
    if (!certificate) {
      return NextResponse.json(
        { success: false, message: 'Sertifikat tidak ditemukan' },
        { status: 404 }
      );
    }
    
    // Find student information
    const student = await (await jsonDb.student()).findUnique({
      where: { id: certificate.studentId },
    });
    
    if (!student) {
      return NextResponse.json(
        { success: false, message: 'Data siswa tidak ditemukan' },
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
        student: {
          id: student.id,
          nim: student.nim,
          name: student.name,
          major: student.major,
          enrollmentDate: student.enrollmentDate,
        },
      },
    });
  } catch (error) {
    console.error('Error verifying certificate:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}