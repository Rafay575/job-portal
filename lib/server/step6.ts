import "server-only";
import pool from "@/lib/db";

export async function getStep6DB(userId: number | string | null) {
  try {
    if (!userId) {
      return {
        success: false,
        message: "userId is required",
        data: [],
      };
    }

    const [rows]: any = await pool.execute(
      `SELECT * FROM employee_documents WHERE user_id = ?`,
      [userId]
    );

    return {
      success: true,
      data: rows,
    };
  } catch (error) {
    console.error("getStep6DB error:", error);

    return {
      success: false,
      message: "Server error",
      data: [],
    };
  }
}
