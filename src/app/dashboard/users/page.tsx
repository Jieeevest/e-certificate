"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

interface User {
  id: string;
  username: string;
  name: string;
  role: "ADMIN" | "STAFF";
  createdAt: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (!response.ok) {
          throw new Error("Not authenticated");
        }
        const data = await response.json();
        setCurrentUser(data.user);

        // Check if user is admin
        if (data.user.role !== "ADMIN") {
          router.push("/dashboard");
          return;
        }

        // Fetch users
        await fetchUsers();
      } catch (error) {
        console.error("Error fetching current user:", error);
        router.push("/auth/login");
      }
    };

    const fetchUsers = async () => {
      try {
        // In a real application, you would fetch this data from an API
        // For now, we'll use mock data based on our seed
        // const response = await fetch('/api/users');
        // const data = await response.json();

        // Mock data based on our seed
        const data = [
          {
            id: "d2dd60db-0237-4442-a0b0-81770165a461",
            username: "admin",
            name: "Administrator",
            role: "ADMIN",
            createdAt: "2025-07-15T12:20:53.260Z",
          },
          {
            id: "2b7db354-a193-4880-ab8d-87e35b2bf029",
            username: "staff",
            name: "Staff User",
            role: "STAFF",
            createdAt: "2025-07-15T12:20:53.266Z",
          },
        ] as User[];

        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [router]);

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.username.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower)
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
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Manajemen Pengguna</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Cari pengguna..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Button
            variant="primary"
            className="text-sm w-[180px] cursor-pointer"
            onClick={() => router.push("/dashboard/users/add")}
          >
            Tambah Data
          </Button>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">
              {searchTerm
                ? "Tidak ada pengguna yang sesuai dengan pencarian."
                : "Belum ada data pengguna."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredUsers.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <div>
                      <div className="text-xl font-bold">{user.name}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        @{user.username}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "ADMIN"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">
                        Tanggal Dibuat:
                      </span>
                      <div>{formatDate(user.createdAt)}</div>
                    </div>
                    <div className="pt-4 flex justify-end space-x-2">
                      {/* Don't allow editing or deleting the current user */}
                      {currentUser?.id !== user.id && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-sm w-[100px] cursor-pointer"
                            onClick={() =>
                              router.push(`/dashboard/users/edit/${user.id}`)
                            }
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            className="text-sm w-[100px] cursor-pointer"
                            onClick={() => {
                              if (
                                confirm(
                                  "Apakah Anda yakin ingin menghapus pengguna ini?"
                                )
                              ) {
                                // In a real app, you would call an API to delete the user
                                // For now, we'll just show an alert
                                alert(
                                  "Fitur hapus pengguna belum diimplementasikan"
                                );
                              }
                            }}
                          >
                            Hapus
                          </Button>
                        </>
                      )}
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
