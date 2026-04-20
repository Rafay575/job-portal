import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows]: any = await pool.execute(`
  SELECT 
    u.id,
    u.name,
    u.email,
    u.created_at,
    COALESCE(e.type, 'Not Submitted') AS type
  FROM users u
  LEFT JOIN employee_basic_information e
    ON u.id = e.user_id
  WHERE u.role = 'employee'
  ORDER BY u.id DESC
`);

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error: any) {
    console.error("Dashboard API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch dashboard data",
      },
      { status: 500 },
    );
  }
}
export async function POST() {
  try {
    const [rows]: any = await pool.execute(`
  SELECT 
    u.id,
    u.name,
    u.email,
    u.created_at,
    u.is_approved,
    COALESCE(e.type, 'Not Submitted') AS type,
    e.phone AS phone
  FROM users u
  LEFT JOIN employee_basic_information e
    ON u.id = e.user_id
  WHERE u.role = 'employee'
  ORDER BY u.created_at DESC
  LIMIT 5
`);

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error: any) {
    console.error("Latest Users API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch latest users",
      },
      { status: 500 },
    );
  }
}
