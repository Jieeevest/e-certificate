/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Student {
  id: string;
  nim: string;
  name: string;
  major: string;
}

interface Certificate {
  id: string;
  title: string;
  description: string;
  status: "PENDING" | "ISSUED" | "REVOKED";
  studentId: string;
  issueDate: string | null;
}

export default function EditCertificatePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    studentId: "",
    status: "PENDING" as "PENDING" | "ISSUED" | "REVOKED",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real application, you would fetch this data from APIs
        // const [certificateResponse, studentsResponse] = await Promise.all([
        //   fetch(`/api/certificates/${id}`),
        //   fetch('/api/students')
        // ]);
        //
        // if (!certificateResponse.ok) {
        //   throw new Error('Failed to fetch certificate');
        // }
        // if (!studentsResponse.ok) {
        //   throw new Error('Failed to fetch students');
        // }
        //
        // const certificateData = await certificateResponse.json();
        // const studentsData = await studentsResponse.json();
        //
        // setFormData({
        //   title: certificateData.certificate.title,
        //   description: certificateData.certificate.description || '',
        //   studentId: certificateData.certificate.studentId,
        //   status: certificateData.certificate.status,
        // });
        // setStudents(studentsData.students);

        // Mock data for now
        const mockCertificate: Certificate = {
          id,
          title: "Web Development Certificate",
          description: "Completed the web development course with excellence",
          status: "PENDING",
          studentId: "student1",
          issueDate: null,
        };

        const mockStudents: Student[] = [
          {
            id: "student1",
            nim: "S12345",
            name: "John Doe",
            major: "Computer Science",
          },
          {
            id: "student2",
            nim: "S67890",
            name: "Jane Smith",
            major: "Information Systems",
          },
        ];

        setFormData({
          title: mockCertificate.title,
          description: mockCertificate.description || "",
          studentId: mockCertificate.studentId,
          status: mockCertificate.status,
        });
        setStudents(mockStudents);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate form
    if (!formData.title || !formData.studentId) {
      setError("Judul dan mahasiswa harus dipilih");
      return;
    }

    setSaving(true);

    try {
      // In a real application, you would call an API to update the certificate
      // const response = await fetch(`/api/certificates/${id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });
      //
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Failed to update certificate');
      // }

      // For now, we'll just simulate a successful update
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to certificate detail page
      router.push(`/dashboard/certificates/${id}`);
      router.refresh(); // Refresh the page to show the updated certificate
    } catch (error: any) {
      console.error("Error updating certificate:", error);
      setError(
        error.message || "Terjadi kesalahan saat memperbarui sertifikat"
      );
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.name.toLowerCase().includes(searchLower) ||
      student.nim.toLowerCase().includes(searchLower) ||
      student.major.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="px-4 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Sertifikat</h1>
        <p className="text-gray-500 mt-1">Perbarui informasi sertifikat</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Edit Sertifikat</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Judul Sertifikat
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Judul sertifikat"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Deskripsi (opsional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Deskripsi sertifikat"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="PENDING">Menunggu</option>
                <option value="ISSUED">Diterbitkan</option>
                <option value="REVOKED">Dicabut</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="studentSearch" className="text-sm font-medium">
                Cari Mahasiswa
              </label>
              <Input
                id="studentSearch"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari berdasarkan nama, NIM, atau jurusan"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="studentId" className="text-sm font-medium">
                Pilih Mahasiswa
              </label>
              <select
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">-- Pilih Mahasiswa --</option>
                {filteredStudents.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.nim}) - {student.major}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={saving}
            >
              Batal
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
