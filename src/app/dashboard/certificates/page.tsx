"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

interface Certificate {
  id: string;
  title: string;
  description?: string;
  issueDate: string;
  expiryDate?: string;
  studentId: string;
  studentName: string;
  studentNim: string;
  status: "PENDING" | "ISSUED" | "EXPIRED" | "REVOKED";
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        // Build query parameters for filtering
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (statusFilter !== 'ALL') params.append('status', statusFilter);
        
        // Fetch certificates from API
        const response = await fetch(`/api/certificates?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch certificates');
        }
        
        const data = await response.json();
        setCertificates(data.certificates);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [searchTerm, statusFilter]);

  const filteredCertificates = certificates.filter((certificate) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      certificate.title.toLowerCase().includes(searchLower) ||
      certificate.studentName.toLowerCase().includes(searchLower) ||
      certificate.studentNim.toLowerCase().includes(searchLower);

    const matchesStatus =
      statusFilter === "ALL" || certificate.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "ISSUED":
        return "bg-green-100 text-green-800";
      case "EXPIRED":
        return "bg-gray-100 text-gray-800";
      case "REVOKED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Menunggu";
      case "ISSUED":
        return "Terbit";
      case "EXPIRED":
        return "Kadaluarsa";
      case "REVOKED":
        return "Dicabut";
      default:
        return status;
    }
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Daftar Sertifikat</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Cari sertifikat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">Semua Status</option>
            <option value="PENDING">Menunggu</option>
            <option value="ISSUED">Terbit</option>
            <option value="EXPIRED">Kadaluarsa</option>
            <option value="REVOKED">Dicabut</option>
          </select>
          <Link href="/dashboard/certificates/add">
            <Button
              variant="primary"
              className="text-sm w-[120px] cursor-pointer"
            >
              Tambah Data
            </Button>
          </Link>
        </div>
      </div>

      {filteredCertificates.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "ALL"
                ? "Tidak ada sertifikat yang sesuai dengan filter."
                : "Belum ada data sertifikat."}
            </p>
            <div className="mt-4">
              <Link href="/dashboard/certificates/add">
                <Button variant="outline">Tambah Sertifikat Baru</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCertificates.map((certificate) => (
            <motion.div
              key={certificate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <div>
                      <div className="text-xl font-bold">
                        {certificate.title}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                            certificate.status
                          )}`}
                        >
                          {getStatusLabel(certificate.status)}
                        </span>
                      </div>
                    </div>
                    <Link href={`/dashboard/certificates/${certificate.id}`}>
                      <Button variant="outline" size="sm">
                        Detail
                      </Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Mahasiswa:</span>
                      <div>
                        {certificate.studentName} ({certificate.studentNim})
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">
                        Tanggal Terbit:
                      </span>
                      <div>{formatDate(certificate.issueDate)}</div>
                    </div>
                    {certificate.expiryDate && (
                      <div>
                        <span className="text-sm text-gray-500">
                          Tanggal Kadaluarsa:
                        </span>
                        <div>{formatDate(certificate.expiryDate)}</div>
                      </div>
                    )}
                    {certificate.description && (
                      <div>
                        <span className="text-sm text-gray-500">
                          Deskripsi:
                        </span>
                        <div className="text-sm">{certificate.description}</div>
                      </div>
                    )}
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
