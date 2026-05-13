// lib/server/step11.ts
import "server-only";
import pool from "@/lib/db";

export async function getStep11DB(userId: number | string | null) {
  try {
    if (!userId) {
      return {
        success: false,
        data: [],
      };
    }

    const [rows]: any = await pool.execute(
      `
      SELECT 
        id,
        user_id,
        declaration_confirmed,
        DATE_FORMAT(declaration_date, '%Y-%m-%d') AS declaration_date,
        signature_file
      FROM employee_declaration
      WHERE user_id = ?
      `,
      [parseInt(userId as string)]
    );

    return {
      success: true,
      data: rows ?? [],
    };
  } catch (error) {
    console.error("getStep11DB error:", error);

    return {
      success: false,
      data: [],
    };
  }
}
