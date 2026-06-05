import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { writeFile, unlink } from "fs/promises";
import path from "path";

// ================= GET =================
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, message: "userId required" });
    }

    const [rows] = await pool.execute(
      `SELECT id,
        user_id,
        title,
        provider,
        duration,
        certificate_file_path,
        DATE_FORMAT(completion_date, '%Y-%m-%d') AS completion_date,
        DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at,
        DATE_FORMAT(updated_at, '%Y-%m-%d') AS updated_at
       FROM employee_trainings WHERE user_id = ? ORDER BY id ASC`,
      [userId],
    );

    return NextResponse.json({ success: true, data: rows });
  } catch (err) {
    console.error("GET Step7 Error:", err);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}

// ================= POST (UPSERT) =================
export async function POST(req: Request) {
  const connection = await pool.getConnection();

  try {
    // ✅ Parse FormData (not JSON anymore, because we have files)
    const formData = await req.formData();
    const userId = formData.get("userId") as string;
    const trainingsJson = formData.get("trainings") as string;

    if (!userId || !trainingsJson) {
      return NextResponse.json({
        success: false,
        message: "Invalid request format",
      });
    }

    const trainings = JSON.parse(trainingsJson);

    await connection.beginTransaction();

    // ✅ CHECK EXISTING RECORDS
    const [existingRows]: any = await connection.execute(
      `SELECT id FROM employee_trainings WHERE user_id = ? LIMIT 1`,
      [userId],
    );
    const isUpdate = existingRows.length > 0;

    // ✅ FETCH OLD FILE PATHS BEFORE DELETING (to clean up files)
    const [oldRows]: any = await connection.execute(
      `SELECT certificate_file_path FROM employee_trainings WHERE user_id = ?`,
      [userId],
    );

    // ✅ DELETE OLD DB RECORDS
    await connection.execute(
      `DELETE FROM employee_trainings WHERE user_id = ?`,
      [userId],
    );

    // ✅ DELETE OLD FILES FROM DISK
    // ✅ Only delete files that are NOT being reused in the new submission
    const reusedPaths = trainings
      .map((t: any) => t.certificateFilePath)
      .filter(Boolean);

    for (const oldRow of oldRows) {
      if (
        oldRow.certificate_file_path &&
        !reusedPaths.includes(oldRow.certificate_file_path) // ✅ skip reused files
      ) {
        const oldFullPath =
          process.env.IS_LOCAL === "true"
            ? path.join(process.cwd(), "public", oldRow.certificate_file_path)
            : `/var/www${oldRow.certificate_file_path}`;
        try {
          await unlink(oldFullPath);
        } catch (err) {
          console.error("Failed to delete old certificate file:", err);
        }
      }
    }

    // ✅ INSERT NEW RECORDS
    for (let i = 0; i < trainings.length; i++) {
      const item = trainings[i];

      // Handle file upload for each training
      let filePath: string | null = null;
      const file = formData.get(`certificate_${i}`) as File | null;

      if (file && file.size > 0) {
        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
          await connection.rollback();
          return NextResponse.json({
            success: false,
            message: `Certificate file for training ${i + 1} must be max 5MB`,
          });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir =
          process.env.IS_LOCAL === "true"
            ? path.join(process.cwd(), "public/uploads")
            : "/var/www/uploads";

        const safeName = file.name.replace(/\s+/g, "_").toLowerCase();
        const fileName = `${Date.now()}-cert-${i}-${safeName}`;
        const fullPath = path.join(uploadDir, fileName);
        await writeFile(fullPath, buffer);
        filePath = `/uploads/${fileName}`;
      } else {
        // ✅ No new file uploaded — reuse the existing path sent from frontend
        filePath = item.certificateFilePath || null;
      }

      await connection.execute(
        `INSERT INTO employee_trainings
    (user_id, title, provider, duration, completion_date, certificate_file_path)
   VALUES (?, ?, ?, ?, ?, ?)`,
        [
          userId,
          item.title,
          item.provider,
          item.duration,
          item.completionDate,
          filePath,
        ],
      );
    }

    await connection.commit();

    return NextResponse.json({
      success: true,
      message: isUpdate
        ? "Trainings updated successfully"
        : "Trainings submitted successfully",
    });
  } catch (err) {
    await connection.rollback();
    console.error("POST Step7 Error:", err);
    return NextResponse.json({ success: false, message: "Server error" });
  } finally {
    connection.release();
  }
}
