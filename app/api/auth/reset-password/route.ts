import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, otp, password } = await req.json();

    const [rows]: any = await pool.execute(
      `SELECT * FROM otp_verifications 
       WHERE email = ? AND otp = ? AND type = 'reset'`,
      [email, otp]
    );

    const record = rows[0];

    if (!record) {
      return NextResponse.json(
        { message: "Invalid OTP" },
        { status: 400 }
      );
    }

    if (new Date(record.expires_at) < new Date()) {
      return NextResponse.json(
        { message: "OTP expired" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // update password
    await pool.execute(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedPassword, email]
    );

    // delete used OTP
    await pool.execute(
      "DELETE FROM otp_verifications WHERE email = ? AND type = 'reset'",
      [email]
    );

    return NextResponse.json({
      message: "Password reset successful",
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}