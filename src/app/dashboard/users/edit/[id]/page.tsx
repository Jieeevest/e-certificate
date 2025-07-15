/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
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

interface User {
  id: string;
  username: string;
  name: string;
  role: "ADMIN" | "STAFF";
}

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    confirmPassword: "",
    role: "STAFF" as "ADMIN" | "STAFF",
  });

  useEffect(() => {
    // Check if user is admin and fetch user data
    const initialize = async () => {
      try {
        // Check if current user is admin
        const authResponse = await fetch("/api/auth/me");
        if (!authResponse.ok) {
          throw new Error("Not authenticated");
        }
        const authData = await authResponse.json();
        if (authData.user.role !== "ADMIN") {
          router.push("/dashboard");
          return;
        }

        // In a real application, you would fetch the user data from an API
        // const response = await fetch(`/api/users/${id}`);
        // if (!response.ok) {
        //   throw new Error('Failed to fetch user');
        // }
        // const userData = await response.json();

        // For now, we'll use mock data based on our seed
        let userData: User;
        if (id === "d2dd60db-0237-4442-a0b0-81770165a461") {
          userData = {
            id: "d2dd60db-0237-4442-a0b0-81770165a461",
            username: "admin",
            name: "Administrator",
            role: "ADMIN",
          };
        } else if (id === "2b7db354-a193-4880-ab8d-87e35b2bf029") {
          userData = {
            id: "2b7db354-a193-4880-ab8d-87e35b2bf029",
            username: "staff",
            name: "Staff User",
            role: "STAFF",
          };
        } else {
          throw new Error("User not found");
        }

        setFormData({
          username: userData.username,
          name: userData.name,
          password: "",
          confirmPassword: "",
          role: userData.role,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error initializing:", error);
        router.push("/dashboard/users");
      }
    };

    initialize();
  }, [id, router]);

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
    if (!formData.username || !formData.name) {
      setError("Username dan nama harus diisi");
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok");
      return;
    }

    setSaving(true);

    try {
      // In a real application, you would call an API to update the user
      // const response = await fetch(`/api/users/${id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     username: formData.username,
      //     name: formData.name,
      //     ...(formData.password ? { password: formData.password } : {}),
      //     role: formData.role,
      //   }),
      // });
      //
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Failed to update user');
      // }

      // For now, we'll just simulate a successful update
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to users page
      router.push("/dashboard/users");
      router.refresh(); // Refresh the page to show the updated user
    } catch (error: any) {
      console.error("Error updating user:", error);
      setError(error.message || "Terjadi kesalahan saat memperbarui pengguna");
    } finally {
      setSaving(false);
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
    <div className="px-4 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Pengguna</h1>
        <p className="text-gray-500 mt-1">Perbarui informasi pengguna</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Edit Pengguna</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="username"
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
                placeholder="Nama lengkap"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password Baru (kosongkan jika tidak ingin mengubah)
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password baru"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Konfirmasi Password Baru
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Konfirmasi password baru"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="STAFF">Staff</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={saving}
            >
              Batal
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
