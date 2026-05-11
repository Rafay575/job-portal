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
      return NextResponse.json({ message: "Email required" }, { status: 400 });
    }
    // ✅ Check if user exists
    const [users]: any = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );

    if (!users || users.length === 0) {
      return NextResponse.json(
        { message: "No user with this email is stored" },
        { status: 404 },
      );
    }
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // remove old reset OTP only
    await pool.execute(
      "DELETE FROM otp_verifications WHERE email = ? AND type = 'reset'",
      [email],
    );

    // insert new reset OTP
    await pool.execute(
      "INSERT INTO otp_verifications (email, otp, type, expires_at) VALUES (?, ?, 'reset', ?)",
      [email, otp, expiresAt],
    );

   
    try {
      await sendOTPEmail(email, otp);
    } catch (error) {
      console.error("Failed to send OTP");
      return NextResponse.json({ message: "Failed to send OTP" }, { status: 500 })
    }

    return NextResponse.json({
      message: "OTP sent successfully",
    });
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
