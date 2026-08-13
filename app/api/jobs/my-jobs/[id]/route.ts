import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getJobById } from "@/lib/getJobs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }  // ← Note: params is a Promise
) {
  try {
    // Await the params promise first
    const { id } = await params;  // ← This is the key fix
    
    // Now convert to number
    const userId = parseInt(id, 10);

    if (isNaN(userId) || userId <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user ID.",
        },
        { status: 400 }
      );
    }

    // ============================================
    // CHECK IF USER EXISTS
    // ============================================
    const [userRows] = await pool.query<any[]>(
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
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    // ============================================
    // GET ALL APPLICATIONS FOR USER
    // ============================================

    const [rows] = await pool.query<any[]>(
      `
        SELECT
          id,
          job_id,
          user_id,
          applied_at
        FROM applied_jobs
        WHERE user_id = ?
        ORDER BY applied_at DESC
      `,
      [userId]
    );

    // No applications
    if (rows.length === 0) {
      return NextResponse.json({
        success: true,
        total: 0,
        data: [],
      });
    }

    // ============================================
    // FETCH JOB DETAILS
    // ============================================

    const applications = await Promise.all(
      rows.map(async (application) => {
        try {
          const jobResponse = await getJobById(
            application.job_id
          );

          if (
            !jobResponse?.success ||
            !jobResponse?.data
          ) {
            return {
              applicationId: application.id,
              jobId: application.job_id,
              appliedAt: application.applied_at,
              job: null,
            };
          }

          const job = jobResponse.data;

          return {
            applicationId: application.id,
            jobId: application.job_id,
            appliedAt: application.applied_at,
            job: {
              sale_id: job.sale_id,
              title: job.title,
              category: job.category,
              position_type: job.position_type,
              salary: job.salary,
              office: job.office,
              unit: job.unit,
              region: job.region,
              status: job.status,
            },
          };
        } catch (error) {
          console.error(
            `Failed to fetch job ${application.job_id}:`,
            error
          );

          return {
            applicationId: application.id,
            jobId: application.job_id,
            appliedAt: application.applied_at,
            job: null,
          };
        }
      })
    );

    // Remove jobs that no longer exist / cannot be fetched
    const validApplications = applications.filter(
      (application) => application.job !== null
    );

    return NextResponse.json({
      success: true,
      total: validApplications.length,
      data: validApplications,
    });
  } catch (error) {
    console.error(
      "My applications API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch applied jobs.",
      },
      { status: 500 }
    );
  }
}