import { PrismaClient } from "../../../src/generated/prisma";
import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";

const prisma = new PrismaClient();

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_secret_please_change_in_production"
);

export async function login(username: string, password: string) {
  try {
    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return { success: false, message: "User tidak ditemukan" };
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return { success: false, message: "Password salah" };
    }

    // Create JWT token
    const token = await new SignJWT({
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(JWT_SECRET);

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
      token,
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Terjadi kesalahan saat login" };
  }
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { success: true, payload };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Token tidak valid" };
  }
}

export async function getUserFromToken(token: string) {
  const { success, payload } = await verifyToken(token);

  if (!success || !payload?.id) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.id as string },
    });

    if (!user) return null;

    return {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    };
  } catch (error) {
    console.error("Error getting user from token:", error);
    return null;
  }
}
