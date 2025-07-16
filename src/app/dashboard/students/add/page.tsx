/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
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

export default function AddStudentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    nim: "",
    name: "",
    email: "",
    major: "",
    year: new Date().getFullYear(),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "year" ? parseInt(value) || new Date().getFullYear() : value,
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

    setLoading(true);

    try {
      // Call the API to create the student
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create student');
      }

      // Redirect to students page
      router.push("/dashboard/students");
      router.refresh(); // Refresh the page to show the new student
    } catch (error: any) {
      console.error("Error creating student:", error);
      setError(error.message || "Terjadi kesalahan saat membuat mahasiswa");
    } finally {
      setLoading(false);
    }
  };

  // Generate year options for the last 10 years
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div className="px-4 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tambah Mahasiswa Baru</h1>
        <p className="text-gray-500 mt-1">
          Tambahkan data mahasiswa baru ke sistem
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Mahasiswa Baru</CardTitle>
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
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email mahasiswa"
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
              disabled={loading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
