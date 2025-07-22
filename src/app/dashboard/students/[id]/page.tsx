"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowLeft, Edit, Trash2, PlusCircle, Eye } from "lucide-react";

interface Student {
  id: string;
  nim: string;
  name: string;
  email: string;
  major: string;
  year: string;
  enrollmentDate: string;
  createdAt: string;
  certificates: Certificate[];
}

interface Certificate {
  id: string;
  title: string;
  description: string;
  status: "PENDING" | "ISSUED" | "REVOKED";
  issueDate: string | null;
  createdAt: string;
}

export default function StudentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`/api/students/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch student");
        }
        const data = await response.json();
        setStudent(data.student);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching student:", error);
        setError("Failed to load student data");
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleDeleteStudent = async () => {
    if (confirm("Apakah Anda yakin ingin menghapus mahasiswa ini?")) {
      try {
        const response = await fetch(`/api/students/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete student");
        }

        router.push("/dashboard/students");
      } catch (error) {
        console.error("Error deleting student:", error);
        alert(
          `Gagal menghapus mahasiswa: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }
  };

  const handleAddCertificate = () => {
    router.push(`/dashboard/certificates/add?studentId=${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="px-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-500 mb-4">
                {error || "Student not found"}
              </p>
              <Button
                onClick={() => router.push("/dashboard/students")}
                className="cursor-pointer"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Students
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Detail Mahasiswa</h1>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/students")}
            className="cursor-pointer"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <Button
            variant="primary"
            onClick={() => router.push(`/dashboard/students/edit/${id}`)}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteStudent}
            className="cursor-pointer"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Hapus
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
                  <p className="font-medium">{student.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">NIM</p>
                  <p className="font-medium">{student.nim}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{student.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Jurusan</p>
                  <p className="font-medium">{student.major}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tahun Masuk</p>
                  <p className="font-medium">{student.year}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tanggal Pendaftaran</p>
                  <p className="font-medium">
                    {formatDate(student.enrollmentDate)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sertifikat</CardTitle>
              <Button onClick={handleAddCertificate} className="cursor-pointer">
                <PlusCircle className="mr-2 h-4 w-4" />
                Tambah Sertifikat
              </Button>
            </CardHeader>
            <CardContent>
              {student.certificates.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  Mahasiswa ini belum memiliki sertifikat.
                </p>
              ) : (
                <div className="space-y-4">
                  {student.certificates.map((certificate, index) => (
                    <motion.div
                      key={certificate.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <Card className="bg-gray-50">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div className="space-y-1">
                              <h3 className="font-medium">
                                {certificate.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {certificate.description}
                              </p>
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    certificate.status === "ISSUED"
                                      ? "bg-green-100 text-green-800"
                                      : certificate.status === "PENDING"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {certificate.status === "ISSUED"
                                    ? "Diterbitkan"
                                    : certificate.status === "PENDING"
                                    ? "Menunggu"
                                    : "Dicabut"}
                                </span>
                                {certificate.issueDate && (
                                  <span className="text-xs text-gray-500">
                                    Diterbitkan:{" "}
                                    {formatDate(certificate.issueDate)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="mt-3 md:mt-0 flex space-x-2">
                              <Button
                                id={certificate.title}
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  router.push(
                                    `/dashboard/certificates/${certificate.id}`
                                  )
                                }
                                className="cursor-pointer"
                              >
                                <Eye className="mr-1 h-3 w-3" />
                                Detail
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
