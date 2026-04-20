import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const search = searchParams.get("search")?.trim() ?? "";
    const status = searchParams.get("status") ?? "";
    const type = searchParams.get("type") ?? "";
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const pageSize = Math.max(1, Number(searchParams.get("pageSize") ?? 10));
    const offset = (page - 1) * pageSize;

    const conditions: string[] = [];
    const params: (string | number)[] = [];

    conditions.push("u.role = 'employee'");

    if (search) {
      conditions.push("(u.name LIKE ? OR u.email LIKE ?)");
      const like = `%${search}%`;
      params.push(like, like);
    }

    if (status === "approved") conditions.push("u.is_approved = 'approved'");
    if (status === "pending") conditions.push("u.is_approved = 'pending'");
    if (status === "rejected") conditions.push("u.is_approved = 'rejected'");

    if (type === "agency-work") conditions.push("e.type = 'agency-work'");
    if (type === "permanent") conditions.push("e.type = 'permanent'");
    if (type === "both") conditions.push("e.type = 'both'");
    if (type === "not_submitted") conditions.push("e.type IS NULL");

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const [[{ total }]]: any = await db.execute(
      `
  SELECT COUNT(*) AS total 
  FROM users u
  LEFT JOIN employee_basic_information e 
    ON u.id = e.user_id
  ${whereClause}
  `,
      params,
    );

    const [rows]: any = await db.execute(
      `
  SELECT 
    u.id, 
    u.name, 
    u.email, 
    u.is_approved, 
    u.created_at,
    COALESCE(e.type, 'Not Submitted') AS type
  FROM users u
  LEFT JOIN employee_basic_information e 
    ON u.id = e.user_id
  ${whereClause}
  ORDER BY u.created_at DESC
  LIMIT ? OFFSET ?
  `,
      [...params, pageSize, offset],
    );

    return NextResponse.json({ success: true, data: rows, total });
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
