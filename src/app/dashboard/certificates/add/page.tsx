/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Award, Save, ArrowLeft, Search, User } from "lucide-react";

interface Student {
  id: string;
  nim: string;
  name: string;
  major: string;
}

export default function AddCertificatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentId = searchParams.get("studentId");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    studentNim: studentId ? "" : "", // Changed from studentId to studentNim
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Fetch students from API
        const response = await fetch("/api/students");
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        const { students } = await response.json();
        setStudents(students);

        // If studentId is provided in URL and exists in the list, select it
        if (studentId) {
          const student = students.find((s: Student) => s.id === studentId);
          if (student) {
            setFormData((prev) => ({ ...prev, studentNim: student.nim }));
          }
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        setError("Failed to load students data");
      }
    };

    fetchStudents();
  }, [studentId]);

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

    setLoading(true);

    try {
      // Find the student ID based on the selected NIM
      const selectedStudent = students.find(student => student.nim === formData.studentNim);
      
      if (!selectedStudent) {
        throw new Error("Mahasiswa tidak ditemukan");
      }

      // Call API to create the certificate
      const response = await fetch("/api/certificates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          studentId: selectedStudent.id, // Send the ID to the API
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create certificate");
      }

      // Redirect to certificates page or student detail page if came from there
      if (studentId) {
        router.push(`/dashboard/students/${studentId}`);
      } else {
        router.push("/dashboard/certificates");
      }
      router.refresh(); // Refresh the page to show the new certificate
    } catch (error: any) {
      console.error("Error creating certificate:", error);
      setError(error.message || "Terjadi kesalahan saat membuat sertifikat");
    } finally {
      setLoading(false);
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

  return (
    <div className="px-4 max-w-2xl mx-auto">
      <div className="mb-6 flex items-center gap-2">
        <Award className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Tambah Sertifikat Baru</h1>
          <p className="text-gray-500 mt-1">
            Buat sertifikat baru untuk mahasiswa
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Sertifikat Baru</CardTitle>
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
                id="studentId"
                name="studentNim"
                value={formData.studentNim}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">-- Pilih Mahasiswa --</option>
                {filteredStudents.map((student) => (
                  <option key={student.id} value={student.nim}>
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
              className="cursor-pointer"
              onClick={() => router.back()}
              disabled={loading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Batal
            </Button>
            <Button type="submit" className="cursor-pointer" disabled={loading}>
              {loading ? (
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
