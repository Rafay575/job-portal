// lib/api/step2.ts
import "server-only";
import pool from "@/lib/db";

export async function getStep2DB(userId: number | string | null) {
  try {
    if (!userId) {
      return {
        success: false,
        message: "userId is required",
        data: [],
      };
    }

    const [rows]: any = await pool.execute(
      `
      SELECT 
        id,
        user_id,
        availability_issue,
        overtime,
        hours_avoid,
        notice_period,
        applied_before,
        applied_details,
        work_restrictions,
        restriction_details,
        worked_before,
        created_at,
        updated_at
      FROM employee_questions
      WHERE user_id = ?
      `,
      [userId]
    );

    return {
      success: true,
      data: rows,
    };
  } catch (error) {
    console.error("getStep2Direct error:", error);

    return {
      success: false,
      message: "Internal server error",
      data: [],
    };
  }
}
