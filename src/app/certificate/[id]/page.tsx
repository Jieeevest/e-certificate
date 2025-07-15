/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import QRCodeGenerator from "@/components/ui/qr-code";
import Image from "next/image";

interface Certificate {
  id: string;
  title: string;
  description: string;
  status: "PENDING" | "ISSUED" | "REVOKED";
  issueDate: string | null;
  student: {
    id: string;
    nim: string;
    name: string;
    major: string;
    yearOfEntry: number;
  };
}

export default function PublicCertificatePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [certificate, setCertificate] = useState<Certificate | null>(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        // In a real application, you would fetch this data from an API
        // const response = await fetch(`/api/public/certificates/${id}`);
        // if (!response.ok) {
        //   if (response.status === 404) {
        //     throw new Error('Sertifikat tidak ditemukan');
        //   }
        //   throw new Error('Gagal memuat data sertifikat');
        // }
        // const data = await response.json();
        // setCertificate(data.certificate);

        // Mock data for now
        const mockCertificate: Certificate = {
          id,
          title: "Web Development Certificate",
          description:
            "Telah menyelesaikan kursus pengembangan web dengan nilai sangat memuaskan",
          status: "ISSUED",
          issueDate: "2023-05-15T00:00:00.000Z",
          student: {
            id: "student1",
            nim: "S12345",
            name: "John Doe",
            major: "Computer Science",
            yearOfEntry: 2020,
          },
        };

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setCertificate(mockCertificate);
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching certificate:", error);
        setError(
          error.message || "Terjadi kesalahan saat memuat data sertifikat"
        );
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">
              {error || "Sertifikat tidak ditemukan"}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push("/")} variant="outline">
              Kembali ke Beranda
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Format the issue date
  const formattedDate = certificate.issueDate
    ? new Date(certificate.issueDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Belum diterbitkan";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-2 border-blue-200 shadow-lg">
            <CardHeader className="text-center border-b pb-6">
              <div className="mx-auto mb-4">
                <Image
                  src="/logo.png"
                  alt="University Logo"
                  className="h-20 mx-auto"
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    e.currentTarget.src =
                      "https://via.placeholder.com/200x100?text=University+Logo";
                  }}
                />
              </div>
              <CardTitle className="text-3xl font-bold text-blue-800">
                SERTIFIKAT
              </CardTitle>
              <p className="text-xl font-semibold mt-2">{certificate.title}</p>
            </CardHeader>

            <CardContent className="pt-8 pb-10 px-8">
              <div className="text-center mb-8">
                <p className="text-lg mb-1">Diberikan kepada:</p>
                <h2 className="text-2xl font-bold mb-1">
                  {certificate.student.name}
                </h2>
                <p className="text-gray-600 mb-1">
                  NIM: {certificate.student.nim}
                </p>
                <p className="text-gray-600">
                  Jurusan {certificate.student.major}
                </p>
              </div>

              <div className="my-8 text-center">
                <p className="text-gray-700">{certificate.description}</p>
              </div>

              <div className="mt-12 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Tanggal Penerbitan:</p>
                  <p className="font-medium">{formattedDate}</p>

                  <div className="text-sm text-gray-500 mt-8">
                    Scan untuk verifikasi
                  </div>
                  <div className="mt-2 flex justify-center">
                    <QRCodeGenerator
                      value={`${
                        typeof window !== "undefined"
                          ? window.location.origin
                          : ""
                      }/certificate/${certificate.id}`}
                      size={128}
                      level="H"
                      includeMargin={true}
                      className="border border-gray-200 p-2 rounded"
                    />
                  </div>
                </div>

                <div className="text-center">
                  <div className="mb-2">
                    <Image
                      src="/signature.png"
                      alt="Digital Signature"
                      className="h-16 mx-auto"
                      onError={(e) => {
                        // Fallback if image doesn't exist
                        e.currentTarget.src =
                          "https://via.placeholder.com/150x80?text=Digital+Signature";
                      }}
                    />
                  </div>
                  <p className="font-medium">Dr. Jane Smith</p>
                  <p className="text-sm text-gray-500">Dekan Fakultas</p>
                </div>
              </div>

              {certificate.status === "REVOKED" && (
                <div className="mt-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-center">
                  <p className="font-bold">SERTIFIKAT INI TELAH DICABUT</p>
                  <p className="text-sm">
                    Sertifikat ini tidak lagi valid dan telah dicabut oleh
                    institusi.
                  </p>
                </div>
              )}

              {certificate.status === "PENDING" && (
                <div className="mt-8 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded text-center">
                  <p className="font-bold">SERTIFIKAT INI BELUM DITERBITKAN</p>
                  <p className="text-sm">
                    Sertifikat ini masih dalam proses penerbitan.
                  </p>
                </div>
              )}
            </CardContent>

            <CardFooter className="border-t pt-6 pb-4 px-8 text-center text-sm text-gray-500">
              <div className="w-full">
                <p>Sertifikat ini dapat diverifikasi dengan mengunjungi:</p>
                <p className="font-medium mt-1">
                  {typeof window !== "undefined" ? window.location.origin : ""}
                  /certificate/{certificate.id}
                </p>
                <div className="mt-4">
                  <Button
                    onClick={() => window.print()}
                    variant="outline"
                    size="sm"
                    className="print:hidden"
                  >
                    Cetak Sertifikat
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
