import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { sendOTPEmail } from "@/lib/mailer";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    // 1. Check if user already exists
    const [existing]: any = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 },
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 },
      );
    }

    // 2. Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await pool.execute(
      "DELETE FROM otp_verifications WHERE email = ? AND type = 'register'",
      [email],
    );

    await pool.execute(
      "INSERT INTO otp_verifications (email, otp, type, expires_at) VALUES (?, ?, 'register', ?)",
      [email, otp, expiresAt],
    );

    // AFTER saving OTP in DB
    try {
  await sendOTPEmail(email, otp);
} catch (error) {
  return NextResponse.json(
    { message: "Email error" },
    { status: 500 }
  );
}

    return NextResponse.json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
