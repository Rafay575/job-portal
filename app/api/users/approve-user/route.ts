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
        { status: 400 },
      );
    }

    // Geting user original email for send emails
    // const [row]: any = await pool.execute(
    //   `SELECT email FROM users WHERE id = ?`,
    //   [id],
    // );
    // const userEmail = row.length > 0 ? row[0].email : null;

    // ✅ get user from DB
    const [rows]: any = await pool.execute(
      `
  SELECT 
    u.name,
    u.email,
    u.is_approved,
    b.type
  FROM users u
  LEFT JOIN employee_basic_information b ON b.user_id = u.id
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

    if (user.is_approved === "approved") {
      return NextResponse.json({
        success: false,
        message: "User already approved",
      });
    }

    await pool.execute(
      `UPDATE users SET is_approved = 'approved' WHERE id = ?`,
      [id],
    );

    // ✅ send email
    try {
      await sendUserApprovalEmail(user.email, user.name, user.type);
    } catch (error) {
      console.error("Failed to send Form approval email");
      return NextResponse.json(
        { message: "Failed to send Form approval email" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "User approved successfully & email sent",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
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

    // ✅ update all users
    await pool.execute(
      `UPDATE users SET is_approved = 'approved' WHERE id IN (${ids.map(() => "?").join(",")})`,
      ids,
    );

    // ✅ send emails (parallel)
    await Promise.all(
      users.map(async (user: any) => {
        try {
          await sendUserApprovalEmail(user.email, user.name, user.type);
        } catch (err) {
          console.error(
            `Failed to send Form approval email ${user.email}`,
            err,
          );
        }
      }),
    );

    return NextResponse.json({
      success: true,
      message: "Users approved successfully",
      updated: ids.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
