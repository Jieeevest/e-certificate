/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Save, X } from "lucide-react";

interface Student {
  id: string;
  nim: string;
  name: string;
  major: string;
  year: string;
}

export default function EditStudentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    nim: "",
    name: "",
    major: "",
    year: new Date().getFullYear().toString(),
  });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`/api/students/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch student');
        }
        const data = await response.json();
        setFormData({
          nim: data.student.nim,
          name: data.student.name,
          major: data.student.major,
          year: data.student.year,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching student:", error);
        setError("Failed to load student data");
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
    if (!formData.nim || !formData.name || !formData.major) {
      setError("Semua field harus diisi");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update student');
      }

      // Redirect to student detail page
      router.push(`/dashboard/students/${id}`);
    } catch (error: any) {
      console.error("Error updating student:", error);
      setError(
        error.message || "Terjadi kesalahan saat memperbarui data mahasiswa"
      );
    } finally {
      setSaving(false);
    }
  };

  // Generate year options for the last 10 years
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => (currentYear - i).toString());

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
        <h1 className="text-2xl font-bold">Edit Data Mahasiswa</h1>
        <p className="text-gray-500 mt-1">Perbarui informasi mahasiswa</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Edit Mahasiswa</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="nim" className="text-sm font-medium">
                NIM
              </label>
              <Input
                id="nim"
                name="nim"
                value={formData.nim}
                onChange={handleChange}
                placeholder="Nomor Induk Mahasiswa"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nama Lengkap
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nama lengkap mahasiswa"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="major" className="text-sm font-medium">
                Jurusan
              </label>
              <Input
                id="major"
                name="major"
                value={formData.major}
                onChange={handleChange}
                placeholder="Jurusan atau program studi"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="year" className="text-sm font-medium">
                Tahun Masuk
              </label>
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
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
              className="cursor-pointer"
            >
              <X className="mr-2 h-4 w-4" />
              Batal
            </Button>
            <Button type="submit" disabled={saving} className="cursor-pointer">
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Menyimpan...
                </>
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
