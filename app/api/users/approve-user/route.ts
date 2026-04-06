import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { sendUserApprovalEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Id is required" },
        { status: 400 }
      );
    }

    // ✅ get user from DB
    const [rows]: any = await pool.execute(
      `SELECT name, email, is_approved FROM users WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const user = rows[0];

    if (user.is_approved) {
      return NextResponse.json({
        success: false,
        message: "User already approved",
      });
    }

    // ✅ update user
    await pool.execute(
      `UPDATE users SET is_approved = TRUE WHERE id = ?`,
      [id]
    );

    // ✅ send email using DB data
    await sendUserApprovalEmail(user.email, user.name);

    return NextResponse.json({
      success: true,
      message: "User approved successfully & email sent",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}