import "server-only";
import pool from "@/lib/db";

export async function getStep5DB(userId: number | string | null) {
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
        is_nurse,
        professional_body,
        registration_type,
        registration_number,
        DATE_FORMAT(registration_expiry, '%Y-%m-%d') AS registration_expiry,
        created_at,
        updated_at
      FROM employee_registration
      WHERE user_id = ?
      `,
      [userId]
    );

    return {
      success: true,
      data: rows,
    };
  } catch (error) {
    console.error("getStep5DB error:", error);

    return {
      success: false,
      message: "Internal server error",
      data: [],
    };
  }
}
