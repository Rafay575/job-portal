import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, isApproved } = await req.json();

    if (!name || !email || !password || !isApproved) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, email, password and approval status are required",
        },
        { status: 400 },
      );
    }

    // Check existing user
    const [existingUsers]: any = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists with this email",
        },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result]: any = await pool.execute(
      `
  INSERT INTO users (
    name,
    email,
    password,
    is_verified,
    is_approved
  )
  VALUES (?, ?, ?, ?, ?)
  `,
      [name, email, hashedPassword, 1, isApproved],
    );

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        userId: result.insertId,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create User Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
