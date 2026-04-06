import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { sendUserRejectionEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Id is required" },
        { status: 400 }
      );
    }

    // ✅ fetch user from DB
    const [rows]: any = await pool.execute(
      `SELECT name, email FROM users WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const user = rows[0];

    // optional: still allow update (or remove if you want strict)
    await pool.execute(
      `UPDATE users SET is_approved = FALSE WHERE id = ?`,
      [id]
    );

    // ✅ send rejection email using DB data
    await sendUserRejectionEmail(user.email, user.name);

    return NextResponse.json({
      success: true,
      message: "User rejected successfully & email sent",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}