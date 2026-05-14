import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import fs from "fs";
import path from "path";
import { writeFile,unlink } from "fs/promises";
// 📁 Upload folder
const uploadDir = path.join(process.cwd(), "public/uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 🟢 GET STEP6
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId is required" },
        { status: 400 }
      );
    }

    const [rows] = await pool.execute(
      `SELECT * FROM employee_documents WHERE user_id = ?`,
      [userId]
    );

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// 🟡 POST (UPLOAD FILES)
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const userId = Number(formData.get("userId"));

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId required" },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public/uploads");

    // =========================
    // 📁 SAVE FILE HELPER
    // =========================
    const saveFile = async (file: File | null) => {
      if (!file || file.size === 0) {
        return null;
      }

      // 🔹 Max file size 5MB
      const MAX_SIZE = 5 * 1024 * 1024;

      if (file.size > MAX_SIZE) {
        throw new Error("File size must be maximum 5MB");
      }

      const bytes = await file.arrayBuffer();

      const buffer = Buffer.from(bytes);

      // 🔹 Safe filename
      const safeName = file.name
        .replace(/\s+/g, "_")
        .toLowerCase();

      const fileName = `${Date.now()}-${safeName}`;

      const fullPath = path.join(uploadDir, fileName);

      await writeFile(fullPath, buffer);

      return `/uploads/${fileName}`;
    };

    // =========================
    // 📁 NEW FILES
    // =========================
    const passport = await saveFile(
      formData.get("passport") as File
    );

    const drivingLicence = await saveFile(
      formData.get("drivingLicence") as File
    );

    const proofId1 = await saveFile(
      formData.get("proofId1") as File
    );

    const proofId2 = await saveFile(
      formData.get("proofId2") as File
    );

    // =========================
    // 🔍 CHECK EXISTING
    // =========================
    const [existing]: any = await pool.execute(
      `SELECT * FROM employee_documents WHERE user_id = ?`,
      [userId]
    );

    // =========================
    // 🟢 UPDATE
    // =========================
    if (existing.length > 0) {
      const row = existing[0];

      const id = row.id;

      // =========================
      // 🗑️ DELETE OLD FILES
      // =========================

      const deleteOldFile = async (
        newFilePath: string | null,
        oldFilePath: string | null
      ) => {
        if (newFilePath && oldFilePath) {
          const oldFullPath = path.join(
            process.cwd(),
            "public",
            oldFilePath
          );

          try {
            await unlink(oldFullPath);
          } catch (err) {
            console.error(
              "Failed to delete old file:",
              err
            );
          }
        }
      };

      await deleteOldFile(passport, row.passport);

      await deleteOldFile(
        drivingLicence,
        row.driving_licence
      );

      await deleteOldFile(proofId1, row.proof_id1);

      await deleteOldFile(proofId2, row.proof_id2);

      // =========================
      // 🟢 UPDATE DB
      // =========================
      await pool.execute(
        `
        UPDATE employee_documents SET
          passport = COALESCE(?, passport),
          driving_licence = COALESCE(?, driving_licence),
          proof_id1 = COALESCE(?, proof_id1),
          proof_id2 = COALESCE(?, proof_id2),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
        [
          passport,
          drivingLicence,
          proofId1,
          proofId2,
          id,
        ]
      );

      return NextResponse.json({
        success: true,
        message: "Step 6 updated successfully",
        mode: "update",
      });
    }

    // =========================
    // 🟡 INSERT
    // =========================
    await pool.execute(
      `
      INSERT INTO employee_documents (
        user_id,
        passport,
        driving_licence,
        proof_id1,
        proof_id2
      ) VALUES (?, ?, ?, ?, ?)
      `,
      [
        userId,
        passport,
        drivingLicence,
        proofId1,
        proofId2,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Step 6 submitted successfully",
      mode: "create",
    });
  } catch (error: any) {
    console.error(error);

    // 🔹 File size custom error
    if (error.message === "File size must be maximum 5MB") {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 }
    );
  }
}