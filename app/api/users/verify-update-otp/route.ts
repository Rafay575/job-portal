// /api/user/verify-update-otp/route.ts

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, otp, type, userId } = await req.json();

    const [rows]: any = await pool.execute(
      "SELECT * FROM otp_verifications WHERE email = ? ",
      [email],
    );

    if (!rows.length) {
      return NextResponse.json({ message: "OTP not found" }, { status: 400 });
    }

    const record = rows[0];

    if (record.otp !== otp) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    if (new Date(record.expires_at) < new Date()) {
      return NextResponse.json({ message: "OTP expired" }, { status: 400 });
    }

    const value = record.meta_value;

    // ✅ UPDATE EMAIL
    if (type === "email") {
      await pool.execute("UPDATE users SET email = ? WHERE id = ?", [
        value,
        userId,
      ]);
    }

    // ✅ UPDATE PASSWORD
    if (type === "password") {
      const hashedPassword = await bcrypt.hash(value, 10);

      await pool.execute("UPDATE users SET password = ? WHERE id = ?", [
        hashedPassword,
        userId,
      ]);
    }

    // cleanup
    await pool.execute("DELETE FROM otp_verifications WHERE email = ?", [
      email,
    ]);

    return NextResponse.json({ message: "Updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
