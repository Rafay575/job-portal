// lib/api/step3.ts

import "server-only";
import pool from "@/lib/db";

export async function getStep3DB(userId: number | string | null) {
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
        has_convictions,
        conviction_details,
        has_unspent_convictions,
        unspent_details,
        fitness_investigation,
        removed_from_register,
        crb,
        certificate_number,  -- ← NEW COLUMN
        full_name,           -- ← NEW COLUMN
        surname,
        DATE_FORMAT(dob, '%Y-%m-%d') AS dob,
        crb_file_path,
        created_at,
        updated_at
      FROM employee_background
      WHERE user_id = ?
      `,
      [userId],
    );

    return {
      success: true,
      data: rows,
    };
  } catch (error) {
    console.error("getStep3DB error:", error);

    return {
      success: false,
      message: "Internal server error",
      data: [],
    };
  }
}
