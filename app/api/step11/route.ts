import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { sendFormSubmissionEmail } from "@/lib/mailer";
import path from "path";
import { writeFile,unlink } from "fs/promises";
// 🟢 GET STEP 11
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
      SELECT id, user_id, declaration_confirmed,  DATE_FORMAT(declaration_date, '%Y-%m-%d') AS declaration_date, signature_file
      FROM employee_declaration
      WHERE user_id = ?
      `,
      [userId],
    );

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

// 🟡 CREATE / UPDATE
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const userId = Number(formData.get("userId"));

    const declarationConfirmed =
      formData.get("declarationConfirmed") === "true";

    const declarationDate = formData.get("declarationDate");

    const file = formData.get("signatureFile") as File | null;

    const email = formData.get("email") as string;

    const name = formData.get("name") as string;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "userId is required",
        },
        { status: 400 }
      );
    }

    const uploadDir = path.join(
      process.cwd(),
      "public/uploads"
    );

    let filePath: string | null = null;

    // =========================
    // 📁 FILE UPLOAD
    // =========================
    if (file && file.size > 0) {
      // 🔹 Max file size
      const MAX_SIZE = 5 * 1024 * 1024;

      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          {
            success: false,
            message: "File size must be maximum 5MB",
          },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();

      const buffer = Buffer.from(bytes);

      // 🔹 Safe filename
      const safeName = file.name
        .replace(/\s+/g, "_")
        .toLowerCase();

      const fileName = `${Date.now()}-${safeName}`;

      const fullPath = path.join(
        uploadDir,
        fileName
      );

      await writeFile(fullPath, buffer);

      filePath = `/uploads/${fileName}`;
    }

    // =========================
    // 🔍 CHECK EXISTING
    // =========================
    const [existing]: any = await pool.execute(
      `SELECT * FROM employee_declaration WHERE user_id = ?`,
      [userId]
    );

    // =========================
    // 🟢 UPDATE
    // =========================
    if (existing.length > 0) {
      const row = existing[0];

      // 🗑️ Delete old signature if new uploaded
      if (filePath && row.signature_file) {
        const oldFullPath = path.join(
          process.cwd(),
          "public",
          row.signature_file
        );

        try {
          await unlink(oldFullPath);
        } catch (err) {
          console.error(
            "Failed to delete old signature file:",
            err
          );
        }
      }

      await pool.execute(
        `
        UPDATE employee_declaration SET
          declaration_confirmed = ?,
          declaration_date = ?,
          signature_file = COALESCE(?, signature_file),
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
        `,
        [
          declarationConfirmed,
          declarationDate,
          filePath,
          userId,
        ]
      );

      return NextResponse.json({
        success: true,
        message: "Step 11 updated successfully",
        mode: "update",
      });
    }

    // =========================
    // 🟡 INSERT
    // =========================
    await pool.execute(
      `
      INSERT INTO employee_declaration (
        user_id,
        declaration_confirmed,
        declaration_date,
        signature_file
      ) VALUES (?, ?, ?, ?)
      `,
      [
        userId,
        declarationConfirmed,
        declarationDate,
        filePath,
      ]
    );

    // =========================
    // 📧 SEND EMAIL
    // =========================
    if (email && name) {
      try {
        await sendFormSubmissionEmail(
          userId,
          email,
          name
        );
      } catch (error) {
        console.error(
          "Failed to send Form submission email"
        );

        return NextResponse.json(
          {
            message:
              "Failed to send Form submission email",
          },
          { status: 500 }
        );
      }
    } else {
      console.log(
        "no email or name found in email block"
      );
    }

    return NextResponse.json({
      success: true,
      message: "Step 11 submitted successfully",
      mode: "create",
    });
  } catch (error) {
    console.error("Step11 Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
