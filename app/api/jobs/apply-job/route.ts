import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const jobId = Number(body.jobId);
    const userId = Number(body.userId);

    if (!Number.isInteger(jobId) || jobId <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid job ID",
        },
        {
          status: 400,
        }
      );
    }

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user ID",
        },
        {
          status: 400,
        }
      );
    }

    // Check if user exists
    const [userRows]: any = await pool.query(
      `
        SELECT id
        FROM users
        WHERE id = ?
        LIMIT 1
      `,
      [userId]
    );

    if (userRows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found for apply in job.",
        },
        {
          status: 404,
        }
      );
    }

    // Check if user already applied
    const [existingRows]: any = await pool.query(
      `
        SELECT id, applied_at
        FROM applied_jobs
        WHERE job_id = ? AND user_id = ?
        LIMIT 1
      `,
      [jobId, userId]
    );

    if (existingRows.length > 0) {
      return NextResponse.json(
        {
          success: false,
          alreadyApplied: true,
          message: "You have already applied for this job.",
          application: {
            id: existingRows[0].id,
            jobId,
            userId,
            appliedAt: existingRows[0].applied_at,
          },
        },
        {
          status: 409,
        }
      );
    }

    // Insert application
    const [result]: any = await pool.query(
      `
        INSERT INTO applied_jobs (job_id, user_id)
        VALUES (?, ?)
      `,
      [jobId, userId]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully.",
        application: {
          id: result.insertId,
          jobId,
          userId,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    console.error("Apply job error:", error);

    // Handles duplicate insert caused by UNIQUE constraint
    if (error?.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        {
          success: false,
          alreadyApplied: true,
          message: "You have already applied for this job.",
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit application.",
      },
      {
        status: 500,
      }
    );
  }
}