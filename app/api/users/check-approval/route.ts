import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Id is required" },
        { status: 400 }
      );
    }

    const [rows]: any = await pool.execute(
      `SELECT is_approved FROM users WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const status = rows[0].is_approved;

    return NextResponse.json({
      success: true,
      status: status, // 'pending' | 'approved' | 'rejected'
      isApproved: status === "approved", // boolean (optional)
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}