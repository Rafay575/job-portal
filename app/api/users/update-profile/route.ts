// /api/user/update-profile/route.ts

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { sendOTPEmail } from "@/lib/mailer";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { userId, type, value, email } = await req.json();

    if (!userId || !type) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    // ✅ UPDATE NAME DIRECTLY
    if (type === "name") {
      await pool.execute("UPDATE users SET name = ? WHERE id = ?", [
        value,
        userId,
      ]);

      return NextResponse.json({ message: "Name updated successfully" });
    }

    // ✅ EMAIL OR PASSWORD → SEND OTP FIRST
    if (type === "email" || type === "password") {
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      await pool.execute("DELETE FROM otp_verifications WHERE email = ? ", [
        email,
      ]);

      await pool.execute(
        `INSERT INTO otp_verifications (email, otp, type, expires_at, meta_value)
         VALUES (?, ?, ?, ?, ?)`,
        [email, otp, `update-${type}`, expiresAt, value],
      );

      try {
        await sendOTPEmail(email, otp);
      } catch (error) {
        console.error("Failed to send OTP");
        return NextResponse.json(
          { message: "Failed to send OTP" },
          { status: 500 },
        );
      }

      return NextResponse.json({
        message: "OTP sent for verification",
      });
    }

    return NextResponse.json({ message: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
