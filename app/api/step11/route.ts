import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { sendFormSubmissionEmail } from "@/lib/mailer";
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

    const userId = formData.get("userId");
    const id = userId;
    const declarationConfirmed =
      formData.get("declarationConfirmed") === "true";
    const declarationDate = formData.get("declarationDate");
    const file = formData.get("signatureFile") as File;
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId is required" },
        { status: 400 },
      );
    }

    let filePath = null;

    // 🟢 Save file (simple local storage)
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${file.name}`;
      const path = `./public/uploads/${fileName}`;

      const fs = require("fs");
      fs.writeFileSync(path, buffer);

      filePath = `/uploads/${fileName}`;
    }

    // 🔍 check existing
    const [existing]: any = await pool.execute(
      `SELECT id FROM employee_declaration WHERE user_id = ?`,
      [userId],
    );

    // ================= UPDATE
    if (existing.length > 0) {
      await pool.execute(
        `
        UPDATE employee_declaration SET
        declaration_confirmed = ?,
        declaration_date = ?,
        signature_file = COALESCE(?, signature_file),
        updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
        `,
        [declarationConfirmed, declarationDate, filePath, userId],
      );
      

      return NextResponse.json({
        success: true,
        message: "Step 11 updated successfully",
      });
    }

    // ================= INSERT
    await pool.execute(
      `
      INSERT INTO employee_declaration (
        user_id,
        declaration_confirmed,
        declaration_date,
        signature_file
      ) VALUES (?, ?, ?, ?)
      `,
      [userId, declarationConfirmed, declarationDate, filePath],
    );

    // ✅ send email from backend
    if (email && name) {
      try {
          await sendFormSubmissionEmail(id, email, name);
        } catch (error) {
          console.error("Email sending failed:", error);

          return NextResponse.json(
            { message: "Failed to send email on form submission." },
            { status: 500 },
          );
        }
    } else {
      console.log("no email or name found in email block");
    }

    return NextResponse.json({
      success: true,
      message: "Step 11 submitted successfully",
    });
  } catch (error) {
    console.error("Step11 Error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }
}
