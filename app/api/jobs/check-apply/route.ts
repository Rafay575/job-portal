import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const jobId = Number(searchParams.get("jobId"));
    const userId = Number(searchParams.get("userId"));

    if (!Number.isInteger(jobId) || jobId <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid job ID",
        },
        { status: 400 }
      );
    }

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user ID",
        },
        { status: 400 }
      );
    }

    const [rows]: any = await pool.query(
      `
        SELECT id, applied_at
        FROM applied_jobs
        WHERE job_id = ?
          AND user_id = ?
        LIMIT 1
      `,
      [jobId, userId]
    );

    const applied = rows.length > 0;

    return NextResponse.json({
      success: true,
      applied,
      application: applied
        ? {
            id: rows[0].id,
            jobId,
            userId,
            appliedAt: rows[0].applied_at,
          }
        : null,
    });
  } catch (error) {
    console.error(
      "Check application error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to check application status",
      },
      { status: 500 }
    );
  }
}