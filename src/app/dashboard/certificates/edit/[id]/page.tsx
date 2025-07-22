/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
import { Save, ArrowLeft, Search, User, Edit } from "lucide-react";

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
  studentId: string;
  issueDate: string | null;
}

export default function EditCertificatePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    studentNim: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from APIs
        const [certificateResponse, studentsResponse] = await Promise.all([
          fetch(`/api/certificates/${id}`),
          fetch('/api/students')
        ]);
        
        if (!certificateResponse.ok) {
          throw new Error('Failed to fetch certificate');
        }
        if (!studentsResponse.ok) {
          throw new Error('Failed to fetch students');
        }
        
        const certificateData = await certificateResponse.json();
        const studentsData = await studentsResponse.json();
        
        // Find student by ID to get NIM
        const student = studentsData.students.find(
          (s: Student) => s.id === certificateData.certificate.studentId
        );
        
        setFormData({
          title: certificateData.certificate.title,
          description: certificateData.certificate.description || '',
          studentNim: student ? student.nim : '',
        });
        setStudents(studentsData.students);

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
    if (!formData.title || !formData.studentNim) {
      setError("Judul dan mahasiswa harus dipilih");
      return;
    }

    setSaving(true);

    try {
      // Find student ID from NIM
      const student = students.find(s => s.nim === formData.studentNim);
      
      if (!student) {
        throw new Error("Mahasiswa tidak ditemukan");
      }
      
      // Call API to update the certificate
      const response = await fetch(`/api/certificates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          studentId: student.id, // Send ID to API
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update certificate');
      }

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
      <div className="mb-6 flex items-center gap-2">
        <Edit className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Edit Sertifikat</h1>
          <p className="text-gray-500 mt-1">Perbarui informasi sertifikat</p>
        </div>
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
              <label htmlFor="studentSearch" className="text-sm font-medium">
                Cari Mahasiswa
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="studentSearch"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari berdasarkan nama, NIM, atau jurusan"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="studentId"
                className="text-sm font-medium flex items-center gap-1"
              >
                <User className="h-4 w-4" />
                Pilih Mahasiswa
              </label>
              <select
                id="studentNim"
                name="studentNim"
                value={formData.studentNim}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">-- Pilih Mahasiswa --</option>
                {filteredStudents.map((student) => (
                  <option key={student.id} value={student.nim}>
                    {student.name} - {student.major}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => router.back()}
              disabled={saving}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Batal
            </Button>
            <Button type="submit" className="cursor-pointer" disabled={saving}>
              {saving ? (
                "Menyimpan..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Simpan
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
