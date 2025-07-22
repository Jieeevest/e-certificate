"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { UserPlus, Search, Eye } from "lucide-react";

interface Student {
  id: string;
  nim: string;
  name: string;
  email: string;
  major: string;
  enrollmentDate: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Fetch data from the API
        const response = await fetch('/api/students');
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        const { students } = await response.json();
        setStudents(students);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.name.toLowerCase().includes(searchLower) ||
      student.nim.toLowerCase().includes(searchLower) ||
      student.email.toLowerCase().includes(searchLower) ||
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
    <div className="px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Daftar Mahasiswa</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari mahasiswa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs pl-10"
            />
          </div>
          <Link href="/dashboard/students/add">
            <Button
                variant="primary"
                className="text-sm w-[120px] cursor-pointer"
              >
              <UserPlus className="mr-2 h-4 w-4" />
              Tambah Data
            </Button>
          </Link>
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">
              {searchTerm
                ? "Tidak ada mahasiswa yang sesuai dengan pencarian."
                : "Belum ada data mahasiswa."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredStudents.map((student) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <div>
                      <div className="text-xl font-bold">{student.name}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        NIM: {student.nim}
                      </div>
                    </div>
                    <Link href={`/dashboard/students/${student.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-sm w-[80px] cursor-pointer"
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        Detail
                      </Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Email:</span>
                      <div>{student.email}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Jurusan:</span>
                      <div>{student.major}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">
                        Tanggal Masuk:
                      </span>
                      <div>{formatDate(student.enrollmentDate)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
