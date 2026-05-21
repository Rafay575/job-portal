import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";



//🗑️ SINGLE DELETE USER (DELETE)
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Id is required" },
        { status: 400 }
      );
    }

    const [rows]: any = await pool.execute(
      `SELECT id FROM users WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    await pool.execute(`DELETE FROM users WHERE id = ?`, [id]);

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}


// 🗑️ BULK DELETE USERS (PATCH - /delete route usage)
export async function PATCH(req: NextRequest) {
  try {
    const { ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, message: "User IDs are required" },
        { status: 400 }
      );
    }

    const placeholders = ids.map(() => "?").join(",");

    const [users]: any = await pool.execute(
      `SELECT id FROM users WHERE id IN (${placeholders})`,
      ids
    );

    if (!users.length) {
      return NextResponse.json(
        { success: false, message: "No users found" },
        { status: 404 }
      );
    }

    await pool.execute(
      `DELETE FROM users WHERE id IN (${placeholders})`,
      ids
    );

    return NextResponse.json({
      success: true,
      message: "Users deleted successfully",
      deleted: ids.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}