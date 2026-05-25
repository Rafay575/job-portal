// lib/api/step4.ts

import "server-only";
import pool from "@/lib/db";

export async function getStep4DB(userId: number | string | null) {
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
        absent_days,
        on_medication,
        medication_details,
        health_treatment,
        treatment_details,
        medical_condition,
        condition_details,
        disabled,
        impairment_type,
        night_shift_fit,
        created_at,
        updated_at
      FROM employee_health
      WHERE user_id = ?
      `,
      [userId]
    );

    return {
      success: true,
      data: rows,
    };
  } catch (error) {
    console.error("getStep4DB error:", error);

    return {
      success: false,
      message: "Internal server error",
      data: [],
    };
  }
}
