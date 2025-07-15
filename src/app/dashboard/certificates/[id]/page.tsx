'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Certificate {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'ISSUED' | 'REVOKED';
  issueDate: string | null;
  createdAt: string;
  student: {
    id: string;
    nim: string;
    name: string;
    major: string;
    year: number;
  };
}

export default function CertificateDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        // In a real application, you would fetch this data from an API
        // const response = await fetch(`/api/certificates/${id}`);
        // if (!response.ok) {
        //   throw new Error('Failed to fetch certificate');
        // }
        // const data = await response.json();
        // setCertificate(data.certificate);

        // Mock data for now
        const mockCertificate: Certificate = {
          id,
          title: 'Web Development Certificate',
          description: 'Completed the web development course with excellence',
          status: 'PENDING',
          issueDate: null,
          createdAt: new Date().toISOString(),
          student: {
            id: 'student1',
            nim: 'S12345',
            name: 'John Doe',
            major: 'Computer Science',
            year: 2023,
          },
        };

        setCertificate(mockCertificate);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching certificate:', error);
        setError('Failed to load certificate data');
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [id]);

  const handleStatusChange = async (newStatus: 'PENDING' | 'ISSUED' | 'REVOKED') => {
    try {
      // In a real application, you would call an API to update the certificate status
      // const response = await fetch(`/api/certificates/${id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     ...certificate,
      //     status: newStatus,
      //     issueDate: newStatus === 'ISSUED' ? new Date().toISOString() : certificate?.issueDate,
      //   }),
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to update certificate status');
      // }
      // 
      // const data = await response.json();
      // setCertificate(data.certificate);

      // For now, we'll just update the local state
      if (certificate) {
        setCertificate({
          ...certificate,
          status: newStatus,
          issueDate: newStatus === 'ISSUED' ? new Date().toISOString() : certificate.issueDate,
        });
      }
    } catch (error) {
      console.error('Error updating certificate status:', error);
      alert('Failed to update certificate status');
    }
  };

  const handleDeleteCertificate = async () => {
    if (confirm('Are you sure you want to delete this certificate?')) {
      try {
        // In a real application, you would call an API to delete the certificate
        // const response = await fetch(`/api/certificates/${id}`, {
        //   method: 'DELETE',
        // });
        // 
        // if (!response.ok) {
        //   throw new Error('Failed to delete certificate');
        // }

        // For now, we'll just simulate a successful deletion
        await new Promise((resolve) => setTimeout(resolve, 1000));

        router.push('/dashboard/certificates');
      } catch (error) {
        console.error('Error deleting certificate:', error);
        alert('Failed to delete certificate');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="px-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error || 'Certificate not found'}</p>
              <Button onClick={() => router.push('/dashboard/certificates')}>Back to Certificates</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Detail Sertifikat</h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => router.push('/dashboard/certificates')}>
            Kembali
          </Button>
          <Button variant="primary" onClick={() => router.push(`/dashboard/certificates/edit/${id}`)}>
            Edit
          </Button>
          <Button variant="danger" onClick={handleDeleteCertificate}>
            Hapus
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Informasi Sertifikat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Judul</p>
                  <p className="font-medium text-xl">{certificate.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Deskripsi</p>
                  <p>{certificate.description || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="flex items-center mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      certificate.status === 'ISSUED' ? 'bg-green-100 text-green-800' : 
                      certificate.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {certificate.status === 'ISSUED' ? 'Diterbitkan' : 
                       certificate.status === 'PENDING' ? 'Menunggu' : 
                       'Dicabut'}
                    </span>
                  </div>
                </div>
                {certificate.issueDate && (
                  <div>
                    <p className="text-sm text-gray-500">Tanggal Penerbitan</p>
                    <p>{formatDate(certificate.issueDate)}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Tanggal Dibuat</p>
                  <p>{formatDate(certificate.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card>
            <CardHeader>
              <CardTitle>Informasi Mahasiswa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Nama</p>
                  <p className="font-medium">{certificate.student.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">NIM</p>
                  <p className="font-medium">{certificate.student.nim}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Jurusan</p>
                  <p className="font-medium">{certificate.student.major}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tahun Masuk</p>
                  <p className="font-medium">{certificate.student.year}</p>
                </div>
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.push(`/dashboard/students/${certificate.student.id}`)}
                  >
                    Lihat Detail Mahasiswa
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Aksi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {certificate.status === 'PENDING' && (
                  <Button 
                    className="w-full" 
                    onClick={() => handleStatusChange('ISSUED')}
                  >
                    Terbitkan Sertifikat
                  </Button>
                )}
                {certificate.status === 'ISSUED' && (
                  <Button 
                    variant="danger" 
                    className="w-full"
                    onClick={() => handleStatusChange('REVOKED')}
                  >
                    Cabut Sertifikat
                  </Button>
                )}
                {certificate.status === 'REVOKED' && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleStatusChange('PENDING')}
                  >
                    Kembalikan ke Status Menunggu
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}