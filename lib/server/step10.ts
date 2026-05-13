// lib/server/step10.ts
import "server-only";
import pool from "@/lib/db";

export async function getStep10DB(userId: number | string | null) {
  try {
    if (!userId) {
      return {
        success: false,
        data: [],
      };
    }

    const [rows]: any = await pool.execute(
      `
      SELECT *
      FROM employee_statement
      WHERE user_id = ?
      `,
      [parseInt(userId as string)]
    );

    return {
      success: true,
      data: rows ?? [],
    };
  } catch (error) {
    console.error("getStep10DB error:", error);

    return {
      success: false,
      data: [],
    };
  }
}
