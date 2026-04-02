import { NextResponse } from "next/server";
import db from "@/lib/db"; // your DB connection

export async function GET() {
  try {
    const [rows]: any = await db.execute(`
      SELECT 
        u.id,
        u.role,
        e.full_name,
        e.type,
        e.email,
        e.phone,
        e.postcode,
        e.nationality,
        e.created_at,
        e.updated_at
      FROM users u
      LEFT JOIN employee_basic_information e
        ON u.id = e.user_id
      WHERE u.role = 'employee'
        AND e.type IS NOT NULL
        AND e.type != ''
    `);

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
      },
      { status: 500 },
    );
  }
}
