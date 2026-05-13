// lib/api/step7.ts
import "server-only";
import pool from "@/lib/db";

export async function getStep7DB(userId: number | string | null) {
  try {
    if (!userId) {
      return {
        success: false,
        message: "userId required",
        data: [],
      };
    }

    const [rows]: any = await pool.execute(
      `
      SELECT 
        id,
        user_id,
        title,
        provider,
        duration,
        DATE_FORMAT(completion_date, '%Y-%m-%d') AS completion_date,
        DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at,
        DATE_FORMAT(updated_at, '%Y-%m-%d') AS updated_at
      FROM employee_trainings
      WHERE user_id = ?
      ORDER BY id ASC
      `,
      [userId]
    );

    return {
      success: true,
      data: rows,
    };
  } catch (err) {
    console.error("getStep7DB error:", err);

    return {
      success: false,
      message: "Server error",
      data: [],
    };
  }
}
