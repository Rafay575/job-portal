// app/api/check-user/route.ts

import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    const [rows]: any = await pool.execute(
      "SELECT id FROM users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return NextResponse.json({
        exists: false,
      });
    }

    return NextResponse.json({
      exists: true,
    });
  } catch (error) {
    return NextResponse.json(
      { exists: false },
      { status: 500 }
    );
  }
}