/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth/auth";
import bcrypt from "bcryptjs";
import { jsonDb } from "@/lib/db/jsonDb";

// GET /api/users/[id] - Get a specific user (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify authentication
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token and get user
    const currentUser = await getUserFromToken(token);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin or the user is requesting their own data
    if (currentUser.role !== "ADMIN" && currentUser.id !== id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get user
    const fullUser = await (
      await jsonDb.user()
    ).findUnique({
      where: { id },
    });

    // Remove password from response
    const user = fullUser
      ? {
          id: fullUser.id,
          username: fullUser.username,
          name: fullUser.name,
          role: fullUser.role,
          createdAt: fullUser.createdAt,
          updatedAt: fullUser.updatedAt,
        }
      : null;

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error getting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update a user (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify authentication
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token and get user
    const currentUser = await getUserFromToken(token);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get request body
    const { username, name, password, role } = await request.json();

    // Validate request body
    if (!username || !name) {
      return NextResponse.json(
        { error: "Username and name are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await (
      await jsonDb.user()
    ).findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if username already exists (for another user)
    if (username !== existingUser.username) {
      const usernameExists = await (
        await jsonDb.user()
      ).findUnique({
        where: { username },
      });

      if (usernameExists) {
        return NextResponse.json(
          { error: "Username already exists" },
          { status: 400 }
        );
      }
    }

    // Update user
    const updateData: any = {
      username,
      name,
      role: role || existingUser.role,
    };

    // If password is provided, hash it
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const fullUpdatedUser = await (
      await jsonDb.user()
    ).update({
      where: { id },
      data: updateData,
    });

    // Remove password from response
    const updatedUser = {
      id: fullUpdatedUser?.id,
      username: fullUpdatedUser?.username,
      name: fullUpdatedUser?.name,
      role: fullUpdatedUser?.role,
      createdAt: fullUpdatedUser?.createdAt,
      updatedAt: fullUpdatedUser?.updatedAt,
    };

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete a user (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify authentication
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token and get user
    const currentUser = await getUserFromToken(token);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if user exists
    const existingUser = await (
      await jsonDb.user()
    ).findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent deleting yourself
    if (id === currentUser.id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Delete user
    await (
      await jsonDb.user()
    ).delete({
      where: { id },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
