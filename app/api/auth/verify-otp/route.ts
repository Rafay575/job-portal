import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendAccountCreatedEmail } from "@/lib/mailer";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function POST(req: Request) {
  try {
    const { email, otp, name, password } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP required" },
        { status: 400 },
      );
    }

    // 1. Get OTP record
    const [rows]: any = await pool.execute(
      "SELECT * FROM otp_verifications WHERE email = ? AND otp = ?",
      [email, otp],
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    const record = rows[0];

    // 2. Check expiry
    if (new Date(record.expires_at) < new Date()) {
      return NextResponse.json({ message: "OTP expired" }, { status: 400 });
    }

    // 3. Hash password (IMPORTANT)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user
    const [result]: any = await pool.execute(
      "INSERT INTO users (name, email, password, is_verified) VALUES (?, ?, ?, ?)",
      [name || "User", email, hashedPassword, true],
    );

    if (email && name) {
      try {
        await sendAccountCreatedEmail(email, name);
      } catch (error) {
        console.error("Failed to send account creation email");
        return NextResponse.json(
          { message: "Failed to send account creation email" },
          { status: 500 },
        );
      }
    } else {
      console.log("no email or name found in email block");
    }

    // 5. Delete OTP
    await pool.execute("DELETE FROM otp_verifications WHERE email = ?", [
      email,
    ]);

    // 6. JWT
    const token = jwt.sign({ id: result.insertId, email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const response = NextResponse.json({
      message: "Account verified successfully",
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
