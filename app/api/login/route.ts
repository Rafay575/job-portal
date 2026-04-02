import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
import { convertServerPatchToFullTree } from "next/dist/client/components/segment-cache/navigation";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  console.log(email, password);

  try {
    // 1. Find user in MySQL
    const [rows]: any = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );

    const user = rows[0];

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 2. CHECK IF VERIFIED (🔥 ADD THIS)
    if (!user.is_verified) {
      return NextResponse.json(
        { message: "Email not verified" },
        { status: 403 }
      );
    }

    // 2. Direct password check (NO bcrypt)
    if (user.password !== password) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 },
      );
    }

    // 3. Create JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // 4. Set cookie
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        role:user.role,
        email: user.email,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
