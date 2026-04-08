import { NextResponse } from "next/server";
import pool from "@/lib/db";

// ================= GET =================
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "userId required",
      });
    }

    const [rows] = await pool.execute(
      `SELECT id,
  user_id,
  title,
  provider,
  duration,

  DATE_FORMAT(completion_date, '%Y-%m-%d') AS completion_date,
  DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at,
  DATE_FORMAT(updated_at, '%Y-%m-%d ') AS updated_at FROM employee_trainings WHERE user_id = ? ORDER BY id ASC`,
      [userId],
    );

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error("GET Step7 Error:", err);
    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}

// ================= CREATE + UPDATE (UPSERT STYLE) =================
export async function POST(req: Request) {
  const connection = await pool.getConnection();

  try {
    const body = await req.json();
    const { userId, trainings } = body;

    if (!userId || !Array.isArray(trainings)) {
      return NextResponse.json({
        success: false,
        message: "Invalid request format",
      });
    }

    await connection.beginTransaction();

    // 🔥 STEP 1: DELETE OLD RECORDS (if any exist)
    await connection.execute(
      `DELETE FROM employee_trainings WHERE user_id = ?`,
      [userId],
    );

    // 🔥 STEP 2: INSERT NEW DATA
    if (trainings.length > 0) {
      for (const item of trainings) {
        await connection.execute(
          `
          INSERT INTO employee_trainings
          (user_id, title, provider, duration, completion_date)
          VALUES (?, ?, ?, ?, ?)
          `,
          [
            userId,
            item.title,
            item.provider,
            item.duration,
            item.completionDate,
          ],
        );
      }
    }

    await connection.commit();

    return NextResponse.json({
      success: true,
      message: "Trainings submitted successfully",
    });
  } catch (err) {
    await connection.rollback();

    console.error("POST Step7 Error:", err);

    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  } finally {
    connection.release();
  }
}
