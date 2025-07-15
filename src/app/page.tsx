/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import QRCodeGenerator from "@/components/ui/qr-code";

export default function Home() {
  const router = useRouter();
  const [certificateId, setCertificateId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certificateId.trim()) {
      setError("Masukkan ID sertifikat untuk verifikasi");
      return;
    }

    setLoading(true);
    setError("");
    setVerificationResult(null);

    try {
      // In a real application, you would call the API
      // const response = await fetch('/api/public/verify', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ certificateId }),
      // });
      //
      // if (!response.ok) {
      //   throw new Error('Gagal memverifikasi sertifikat');
      // }
      //
      // const data = await response.json();
      // if (!data.success) {
      //   throw new Error(data.message || 'Sertifikat tidak ditemukan');
      // }
      //
      // setVerificationResult(data.certificate);

      // Mock verification for now
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (certificateId === "CERT123") {
        setVerificationResult({
          id: "CERT123",
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
          },
        });
      } else {
        throw new Error("Sertifikat tidak ditemukan");
      }
    } catch (err: any) {
      setError(
        err.message || "Terjadi kesalahan saat memverifikasi sertifikat"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-8 w-8 mr-2 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold">E</span>
            </div>
            <span className="font-bold text-xl text-blue-800">
              E-Certificate
            </span>
          </div>
          <nav>
            <Link href="/auth/login">
              <Button variant="outline">Login</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <motion.div
              className="lg:w-1/2 mb-10 lg:mb-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                Sertifikat Digital{" "}
                <span className="text-blue-600">Terverifikasi</span>
              </h1>
              <p className="mt-5 text-xl text-gray-500">
                Platform sertifikasi digital yang aman dan terverifikasi untuk
                institusi pendidikan. Buat, kelola, dan verifikasi sertifikat
                dengan mudah.
              </p>
              <div className="mt-8">
                <form onSubmit={handleVerify} className="sm:flex">
                  <div className="w-full sm:max-w-xs">
                    <label htmlFor="certificateId" className="sr-only">
                      ID Sertifikat
                    </label>
                    <Input
                      type="text"
                      id="certificateId"
                      placeholder="Masukkan ID sertifikat"
                      value={certificateId}
                      onChange={(e) => {
                        setCertificateId(e.target.value);
                        setError("");
                        setVerificationResult(null);
                      }}
                      className="w-full"
                      disabled={loading}
                    />
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Memverifikasi..." : "Verifikasi Sertifikat"}
                    </Button>
                  </div>
                </form>
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                {verificationResult && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-700 font-medium">
                      Sertifikat valid!
                    </p>
                    <p className="text-sm mt-1">
                      <Link
                        href={`/certificate/${verificationResult.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Lihat detail sertifikat
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200">
                <div className="border-2 border-blue-200 rounded-md p-8 text-center">
                  <div className="mb-4 text-blue-800 font-bold text-2xl">
                    SERTIFIKAT
                  </div>
                  <div className="mb-6 text-xl">Web Development</div>
                  <div className="mb-2">Diberikan kepada:</div>
                  <div className="text-xl font-bold mb-1">John Doe</div>
                  <div className="text-gray-600 mb-6">NIM: S12345</div>
                  <div className="text-sm text-gray-500 mt-8">
                    Scan untuk verifikasi
                  </div>
                  <div className="mt-2 flex justify-center">
                    <QRCodeGenerator
                      value={`${
                        typeof window !== "undefined"
                          ? window.location.origin
                          : ""
                      }/certificate/CERT123`}
                      size={96}
                      level="M"
                      includeMargin={true}
                      className="border border-gray-200 p-1 rounded"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Fitur Utama
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Solusi lengkap untuk pengelolaan sertifikat digital
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <motion.div
              className="bg-blue-50 rounded-lg p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="text-blue-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Verifikasi Instan
              </h3>
              <p className="mt-2 text-gray-600">
                Verifikasi sertifikat secara instan dengan ID unik atau QR code
                yang aman.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              className="bg-blue-50 rounded-lg p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="text-blue-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Keamanan Tinggi
              </h3>
              <p className="mt-2 text-gray-600">
                Dilengkapi dengan teknologi keamanan untuk mencegah pemalsuan
                sertifikat.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              className="bg-blue-50 rounded-lg p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="text-blue-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Manajemen Terpusat
              </h3>
              <p className="mt-2 text-gray-600">
                Kelola semua sertifikat dan penerima dari satu dashboard yang
                mudah digunakan.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">
              Mulai Gunakan E-Certificate Sekarang
            </h2>
            <p className="mt-4 text-xl text-blue-100">
              Hubungi kami untuk informasi lebih lanjut tentang implementasi di
              institusi Anda.
            </p>
            <div className="mt-8">
              <Button
                className="bg-white text-blue-700 hover:bg-blue-50"
                onClick={() => router.push("/auth/login")}
              >
                Login ke Dashboard
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center">
                <div className="h-8 w-8 mr-2 bg-white rounded-md flex items-center justify-center">
                  <span className="text-blue-800 font-bold">E</span>
                </div>
                <span className="font-bold text-xl">E-Certificate</span>
              </div>
              <p className="mt-2 text-gray-400">
                Platform sertifikasi digital yang aman dan terverifikasi.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 md:gap-16">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider">
                  Navigasi
                </h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link href="/" className="text-gray-400 hover:text-white">
                      Beranda
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/auth/login"
                      className="text-gray-400 hover:text-white"
                    >
                      Login
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider">
                  Kontak
                </h3>
                <ul className="mt-4 space-y-2">
                  <li className="text-gray-400">
                    Email: info@e-certificate.com
                  </li>
                  <li className="text-gray-400">Telepon: (021) 123-4567</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} E-Certificate. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
