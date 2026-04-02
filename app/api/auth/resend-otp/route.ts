import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { sendOTPEmail } from "@/lib/mailer";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email required" },
        { status: 400 }
      );
    }

    // 1. Generate new OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // 2. Update existing OTP or insert new
    await pool.execute(
      "DELETE FROM otp_verifications WHERE email = ?",
      [email]
    );

    await pool.execute(
      "INSERT INTO otp_verifications (email, otp, expires_at) VALUES (?, ?, ?)",
      [email, otp, expiresAt]
    );

    // 3. Send email (replace with real email service)
    sendOTPEmail(email, otp);

    return NextResponse.json({
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}