import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
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
        { status: 400 }
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
        DATE_FORMAT(dob, '%d-%m-%Y') AS dob,

        crb_file_path,
        created_at,
        updated_at

      FROM employee_background
      WHERE user_id = ?
      `,
      [userId]
    );

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
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
        { status: 400 }
      );
    }

    // 🔹 Boolean fields
    const hasConvictions = formData.get("hasConvictions") === "true" ? 1 : 0;
    const hasUnspentConvictions = formData.get("hasUnspentConvictions") === "true" ? 1 : 0;
    const fitnessInvestigation = formData.get("fitnessInvestigation") === "true" ? 1 : 0;
    const removedFromRegister = formData.get("removedFromRegister") === "true" ? 1 : 0;
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
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public/uploads");
      const fileName = `${Date.now()}-${file.name}`;
      const fullPath = path.join(uploadDir, fileName);

      await writeFile(fullPath, buffer);

      filePath = `/uploads/${fileName}`;
    }

    // =========================
    // 🔍 CHECK EXISTING
    // =========================
    const [existing]: any = await pool.execute(
      `SELECT id FROM employee_background WHERE user_id = ?`,
      [userId]
    );

    // =========================
    // 🟢 UPDATE
    // =========================
    if (existing.length > 0) {
      const id = existing[0].id;

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
        ]
      );

      return NextResponse.json({
        success: true,
        message: "Step 3 updated successfully",
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
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Step 3 submitted successfully",
      mode: "create",
    });

  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}