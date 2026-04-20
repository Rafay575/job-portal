import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const search   = searchParams.get("search")?.trim()  ?? "";
    const status   = searchParams.get("status")          ?? "";
    const type     = searchParams.get("type")            ?? "";
    const page     = Math.max(1, Number(searchParams.get("page")     ?? 1));
    const pageSize = Math.max(1, Number(searchParams.get("pageSize") ?? 10));
    const offset   = (page - 1) * pageSize;

    const conditions: string[] = [
      "u.role = 'employee'",
      "e.type IS NOT NULL",
      "e.type != ''",
    ];
    const params: (string | number)[] = [];

    if (search) {
      conditions.push(
        "(u.name LIKE ? OR u.email LIKE ? OR e.phone LIKE ? OR e.nationality LIKE ?)"
      );
      const like = `%${search}%`;
      params.push(like, like, like, like);
    }

    // 🔥 CHANGE: boolean → ENUM values
    
    if (status === "approved")   conditions.push("u.is_approved = 'approved'");
    if (status === "pending")    conditions.push("u.is_approved = 'pending'");   // 🔥 NEW
    if (status === "rejected")   conditions.push("u.is_approved = 'rejected'");  // 🔥 NEW

    // ❌ REMOVE THIS OLD LINE
    if (type === "permanent")    conditions.push("e.type = 'permanent'");
    if (type === "agency-work")  conditions.push("e.type = 'agency-work'");
    if (type === "both")         conditions.push("e.type = 'both'");

    const whereClause = conditions.join(" AND ");

    // Total count for pagination
    const [[{ total }]]: any = await db.execute(
      `SELECT COUNT(*) AS total
       FROM users u
       LEFT JOIN employee_basic_information e ON u.id = e.user_id
       WHERE ${whereClause}`,
      params
    );

    // Paginated data
    const [rows]: any = await db.execute(
      `SELECT
         u.id, u.name, u.role, u.is_approved,
         e.type, u.email, e.phone, e.postcode,
         e.nationality, e.created_at, e.updated_at
       FROM users u
       LEFT JOIN employee_basic_information e ON u.id = e.user_id
       WHERE ${whereClause}
       ORDER BY e.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );

    return NextResponse.json({ success: true, data: rows, total });
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}


import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    // ✅ Validate
    if (!id) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // ✅ Fetch user
    const [rows]: any = await pool.execute(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    // ✅ Check if user exists
    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found", data: null },
        { status: 404 }
      );
    }

    // ✅ Return user
    return NextResponse.json({
      success: true,
      data: rows[0], 
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}