import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { sendUserApprovalEmail } from "@/lib/mailer";

// Single User Approve 
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


    if (user.is_approved === "approved") {
      return NextResponse.json({
        success: false,
        message: "User already approved",
      });
    }

    await pool.execute(
      `UPDATE users SET is_approved = 'approved' WHERE id = ?`,
      [id]
    );

    // ✅ send email
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

// Bulk Users Approve 
export async function PATCH(req: NextRequest) {
  try {
    const { ids } = await req.json(); // array of user IDs

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, message: "User IDs are required" },
        { status: 400 }
      );
    }

    // ✅ fetch users
    const [users]: any = await pool.execute(
      `SELECT id, name, email, is_approved FROM users WHERE id IN (${ids.map(() => "?").join(",")})`,
      ids
    );

    if (!users.length) {
      return NextResponse.json(
        { success: false, message: "No users found" },
        { status: 404 }
      );
    }

    // ✅ update all users
    await pool.execute(
      `UPDATE users SET is_approved = 'approved' WHERE id IN (${ids.map(() => "?").join(",")})`,
      ids
    );

    // ✅ send emails (parallel)
    await Promise.all(
      users.map((user: any) =>
        sendUserApprovalEmail(user.email, user.name)
      )
    );

    return NextResponse.json({
      success: true,
      message: "Users approved successfully",
      updated: ids.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}