import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import pool from "@/lib/db";

// ✅ GET Step 3
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId is required" },
        { status: 400 },
      );
    }

    const [rows] = await pool.execute(
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
        surname,
        
        -- ✅ format date
        DATE_FORMAT(dob, '%Y-%m-%d') AS dob,

        crb_file_path,
        created_at,
        updated_at

      FROM employee_background
      WHERE user_id = ?
      `,
      [userId],
    );

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

// ✅ CREATE / UPDATE Step 3
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const userId = Number(formData.get("userId"));

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User Id is missing" },
        { status: 400 },
      );
    }

    // 🔹 Boolean fields
    const hasConvictions = formData.get("hasConvictions") === "true" ? 1 : 0;

    const hasUnspentConvictions =
      formData.get("hasUnspentConvictions") === "true" ? 1 : 0;

    const fitnessInvestigation =
      formData.get("fitnessInvestigation") === "true" ? 1 : 0;

    const removedFromRegister =
      formData.get("removedFromRegister") === "true" ? 1 : 0;

    const crb = formData.get("crb") === "true" ? 1 : 0;

    // 🔹 Text fields
    const convictionDetails = formData.get("convictionDetails") as string;

    const unspentDetails = formData.get("unspentDetails") as string;

    const surname = formData.get("surname") as string;

    const dob = formData.get("dob") as string;

    const file = formData.get("crbFile") as File | null;

    // =========================
    // 📁 FILE UPLOAD
    // =========================
    let filePath: string | null = null;

    if (file && file.size > 0) {
      // 🔹 File size validation
      const MAX_SIZE = 5 * 1024 * 1024;

      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          {
            success: false,
            message: "File size must be maximum 5MB",
          },
          { status: 400 },
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir =
        process.env.IS_LOCAL === "true"
          ? path.join(process.cwd(), "public/uploads")
          : "/var/www/uploads";

      // 🔹 Safe filename
      const safeName = file.name.replace(/\s+/g, "_").toLowerCase();

      const fileName = `${Date.now()}-${safeName}`;

      const fullPath = path.join(uploadDir, fileName);

      await writeFile(fullPath, buffer);

      filePath = `/uploads/${fileName}`;
    }

    // =========================
    // 🔍 CHECK EXISTING
    // =========================
    const [existing]: any = await pool.execute(
      `SELECT id FROM employee_background WHERE user_id = ?`,
      [userId],
    );

    // =========================
    // 🟢 UPDATE
    // =========================
    if (existing.length > 0) {
      const id = existing[0].id;

      // 🗑️ Delete old file if new one uploaded
      if (filePath) {
        const [fileRow]: any = await pool.execute(
          `SELECT crb_file_path FROM employee_background WHERE id = ?`,
          [id],
        );

        const oldFilePath = fileRow?.[0]?.crb_file_path;

        if (oldFilePath) {
           const oldFullPath =
                      process.env.IS_LOCAL === "true"
                        ? path.join(process.cwd(), "public", oldFilePath)
                        : `/var/www${oldFilePath}`;
          // const oldFullPath = `/var/www${oldFilePath}`;

          try {
            await unlink(oldFullPath);
          } catch (err) {
            console.error("Failed to delete old CRB file:", err);
          }
        }
      }

      await pool.execute(
        `
        UPDATE employee_background SET
          has_convictions = ?,
          conviction_details = ?,
          has_unspent_convictions = ?,
          unspent_details = ?,
          fitness_investigation = ?,
          removed_from_register = ?,
          crb = ?,
          surname = ?,
          dob = ?,
          crb_file_path = COALESCE(?, crb_file_path),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
        [
          hasConvictions,
          convictionDetails || null,
          hasUnspentConvictions,
          unspentDetails || null,
          fitnessInvestigation,
          removedFromRegister,
          crb,
          surname || null,
          dob || null,
          filePath,
          id,
        ],
      );

      return NextResponse.json({
        success: true,
        message: "Background form updated successfully",
        mode: "update",
      });
    }

    // =========================
    // 🟡 INSERT
    // =========================
    await pool.execute(
      `
      INSERT INTO employee_background (
        user_id,
        has_convictions,
        conviction_details,
        has_unspent_convictions,
        unspent_details,
        fitness_investigation,
        removed_from_register,
        crb,
        surname,
        dob,
        crb_file_path
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        hasConvictions,
        convictionDetails || null,
        hasUnspentConvictions,
        unspentDetails || null,
        fitnessInvestigation,
        removedFromRegister,
        crb,
        surname || null,
        dob || null,
        filePath,
      ],
    );

    return NextResponse.json({
      success: true,
      message: "Background form submitted successfully",
      mode: "create",
    });
  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }
}
