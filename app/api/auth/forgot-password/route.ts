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

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // remove old reset OTP only
    await pool.execute(
      "DELETE FROM otp_verifications WHERE email = ? AND type = 'reset'",
      [email]
    );

    // insert new reset OTP
    await pool.execute(
      "INSERT INTO otp_verifications (email, otp, type, expires_at) VALUES (?, ?, 'reset', ?)",
      [email, otp, expiresAt]
    );

     sendOTPEmail(email, otp);

    return NextResponse.json({
      message: "OTP sent successfully",
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}