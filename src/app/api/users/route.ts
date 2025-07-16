import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth/auth";
import bcrypt from "bcryptjs";
import { jsonDb } from "@/lib/db/jsonDb";

// GET /api/users - Get all users (admin only)
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token and get user
    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get all users
    const allUsers = await (await jsonDb.user()).findMany();

    // Remove password from response
    const users = allUsers.map((user) => ({
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error getting users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user (admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token and get user
    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get request body
    const { username, name, password, role } = await request.json();

    // Validate request body
    if (!username || !name || !password) {
      return NextResponse.json(
        { error: "Username, name, and password are required" },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await (
      await jsonDb.user()
    ).findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const createdUser = await (
      await jsonDb.user()
    ).create({
      data: {
        username,
        name,
        password: hashedPassword,
        role: role || "STAFF",
      },
    });

    // Remove password from response
    const newUser = {
      id: createdUser.id,
      username: createdUser.username,
      name: createdUser.name,
      role: createdUser.role,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
    };

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
