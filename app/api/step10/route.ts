import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// =======================
// 🟢 GET STEP10
// =======================
export async function GET(req: NextRequest) {
  try {
    const userId = new URL(req.url).searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId required" },
        { status: 400 }
      );
    }

    const [rows] = await pool.execute(
      `SELECT * FROM employee_statement WHERE user_id = ?`,
      [userId]
    );

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// =======================
// 🟡 CREATE / UPDATE
// =======================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { userId, supportingStatement } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId required" },
        { status: 400 }
      );
    }

    const [existing]: any = await pool.execute(
      `SELECT id FROM employee_statement WHERE user_id = ?`,
      [userId]
    );

    // 🟢 UPDATE
    if (existing.length) {
      await pool.execute(
        `
        UPDATE employee_statement SET
          supporting_statement = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
        `,
        [supportingStatement, userId]
      );

      return NextResponse.json({
        success: true,
        message: "Statement updated successfully",
      });
    }

    // 🟡 INSERT
    await pool.execute(
      `
      INSERT INTO employee_statement (user_id, supporting_statement)
      VALUES (?, ?)
      `,
      [userId, supportingStatement]
    );

    return NextResponse.json({
      success: true,
      message: "Statement submitted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}