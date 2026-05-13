
import "server-only";
import pool from "@/lib/db";

export async function getStep1DB(
  userId: number | string | null
) {
  try {
    const [rows]: any = await pool.execute(
      `
      SELECT 
        id,
        user_id,
        type,
        full_name,
        email,
        phone,
        address,
        postcode,
        nationality,
        immigration_status,
        DATE_FORMAT(immigration_expiry, '%Y-%m-%d') AS immigration_expiry,
        work_permit,
        name_changed,
        previous_name,
        changed_to,
        cv_file_path,
        created_at,
        updated_at
      FROM employee_basic_information 
      WHERE user_id = ?
      `,
      
      [userId]
    );
    

    return {
      success: true,
      data: rows,
    };
  } catch (error: any) {
    console.error("getStep1DB error:", error);

    return {
      success: false,
      message: error.message || "Failed to fetch data",
      data: [],
    };
  }
}
