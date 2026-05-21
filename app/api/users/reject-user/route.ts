import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { sendUserRejectionEmail } from "@/lib/mailer";

// Single User Reject
export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Id is required" },
        { status: 400 },
      );
    }

    // ✅ fetch user from DB
    const [rows]: any = await pool.execute(
      `
  SELECT 
    u.name,
    u.email,
    u.is_approved,
    e.type
  FROM users u
  LEFT JOIN employee_basic_information e
    ON e.user_id = u.id
  WHERE u.id = ?
  `,
      [id],
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const user = rows[0];

    // ✅ optional: prevent rejecting already rejected user
    if (user.is_approved === "rejected") {
      return NextResponse.json({
        success: false,
        message: "User already rejected",
      });
    }

    // ✅ update user (ENUM value)
    await pool.execute(
      `UPDATE users SET is_approved = 'rejected' WHERE id = ?`,
      [id],
    );

    // ✅ send rejection email
    console.log("user.email: ", user.email);

    try {
      await sendUserRejectionEmail(user.email, user.name, user.type);
    } catch (error) {
      console.error("Failed to send Form approval rejected email");
      return NextResponse.json(
        { message: "Failed to send Form approval rejected email" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "User rejected successfully & email sent",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

// Bulk Users Reject
export async function PATCH(req: NextRequest) {
  try {
    const { ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, message: "User IDs are required" },
        { status: 400 },
      );
    }

    // ✅ fetch users

    const [users]: any = await pool.execute(
      `
  SELECT 
    u.id,
    u.name,
    u.email,
    u.is_approved,
    e.type
  FROM users u
  LEFT JOIN employee_basic_information e
    ON e.user_id = u.id
  WHERE u.id IN (${ids.map(() => "?").join(",")})
  `,
      ids,
    );

    if (!users.length) {
      return NextResponse.json(
        { success: false, message: "No users found" },
        { status: 404 },
      );
    }

    // ❌ update all users
    await pool.execute(
      `UPDATE users SET is_approved = 'rejected' WHERE id IN (${ids.map(() => "?").join(",")})`,
      ids,
    );

    // ❌ send emails

    await Promise.all(
      users.map(async (user: any) => {
        try {
          sendUserRejectionEmail(user.email, user.name, user.type);
        } catch (err) {
          console.error(
            `Failed to send Form approval rejected email ${user.email}`,
            err,
          );
        }
      }),
    );

    return NextResponse.json({
      success: true,
      message: "Users rejected successfully",
      updated: ids.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
