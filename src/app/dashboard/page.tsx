"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Users,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

interface DashboardStats {
  totalStudents: number;
  totalCertificates: number;
  pendingCertificates: number;
  issuedCertificates: number;
  revokedCertificates: number;
  expiredCertificates: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalCertificates: 0,
    pendingCertificates: 0,
    issuedCertificates: 0,
    revokedCertificates: 0,
    expiredCertificates: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats");

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard stats");
        }

        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);

        // Fallback to mock data if API fails
        setStats({
          totalStudents: 0,
          totalCertificates: 0,
          pendingCertificates: 0,
          issuedCertificates: 0,
          revokedCertificates: 0,
          expiredCertificates: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="px-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base font-medium text-gray-500">
                Total Mahasiswa
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {stats.totalStudents}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base font-medium text-gray-500">
                Total Sertifikat
              </CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {stats.totalCertificates}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base font-medium text-gray-500">
                Pending
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {stats.pendingCertificates}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base font-medium text-gray-500">
                Diterbitkan
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {stats.issuedCertificates}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base font-medium text-gray-500">
                Dicabut
              </CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {stats.revokedCertificates}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Selamat Datang di E-Certificate
          </h2>
          <p className="text-gray-600">
            Sistem ini memungkinkan Anda untuk mengelola data mahasiswa dan
            sertifikat digital mereka. Gunakan menu navigasi untuk mengakses
            fitur-fitur yang tersedia.
          </p>
          <motion.div
            className="mt-4 p-4 bg-blue-50 rounded-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h3 className="text-md font-medium text-blue-800">
              Petunjuk Penggunaan:
            </h3>
            <ul className="mt-2 list-disc list-inside text-blue-700">
              <li>
                Gunakan menu <strong>Mahasiswa</strong> untuk mengelola data
                mahasiswa
              </li>
              <li>
                Gunakan menu <strong>Sertifikat</strong> untuk mengelola
                sertifikat digital
              </li>
              {stats.pendingCertificates > 0 && (
                <li>
                  Anda memiliki {stats.pendingCertificates} sertifikat yang
                  menunggu untuk diproses
                </li>
              )}
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="bg-white p-4 rounded-lg shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold mb-3">Aktivitas Terbaru</h3>
          <div className="space-y-3">
            {stats.pendingCertificates > 0 ? (
              <div className="p-3 border-l-4 border-yellow-400 bg-yellow-50 rounded-md">
                <p className="text-base text-yellow-800">Perlu Perhatian</p>
                <p className="font-medium text-yellow-900">
                  {stats.pendingCertificates} sertifikat menunggu untuk diproses
                </p>
              </div>
            ) : null}

            {stats.issuedCertificates > 0 ? (
              <div className="p-3 border-l-4 border-green-400 bg-green-50 rounded-md">
                <p className="text-base text-green-800">Terbaru</p>
                <p className="font-medium text-green-900">
                  {stats.issuedCertificates} sertifikat telah diterbitkan
                </p>
              </div>
            ) : null}

            {stats.totalStudents > 0 ? (
              <div className="p-3 border-l-4 border-blue-400 bg-blue-50 rounded-md">
                <p className="text-base text-blue-800">Informasi</p>
                <p className="font-medium text-blue-900">
                  Total {stats.totalStudents} mahasiswa terdaftar dalam sistem
                </p>
              </div>
            ) : null}

            {stats.revokedCertificates > 0 ? (
              <div className="p-3 border-l-4 border-red-400 bg-red-50 rounded-md">
                <p className="text-base text-red-800">Perhatian</p>
                <p className="font-medium text-red-900">
                  {stats.revokedCertificates} sertifikat telah dicabut
                </p>
              </div>
            ) : null}

            {stats.totalStudents === 0 && stats.totalCertificates === 0 && (
              <div className="p-3 border border-gray-200 rounded-md">
                <p className="text-gray-600 text-center">
                  Belum ada aktivitas terbaru
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
