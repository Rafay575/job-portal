import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// GET STEP 5
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
        is_nurse,
        professional_body,
        registration_type,
        registration_number,
        DATE_FORMAT(registration_expiry, '%d-%m-%Y') AS registration_expiry,
        created_at,
        updated_at
      FROM employee_registration
      WHERE user_id = ?
      `,
      [userId]
    );

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Step5 GET Error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}


// CREATE / UPDATE STEP 5
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      userId,
      isNurse,
      professionalBody,
      registrationType,
      registrationNumber,
      registrationExpiry,
    } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId is required" },
        { status: 400 }
      );
    }

    // =========================
    // 🔍 CHECK EXISTING RECORD
    // =========================
    const [existing]: any = await pool.execute(
      `SELECT id FROM employee_registration WHERE user_id = ?`,
      [userId]
    );

    // =========================
    // 🟢 UPDATE
    // =========================
    if (existing.length > 0) {
      const id = existing[0].id;

      await pool.execute(
        `
        UPDATE employee_registration SET
          is_nurse = ?,
          professional_body = ?,
          registration_type = ?,
          registration_number = ?,
          registration_expiry = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
        [
          isNurse,
          professionalBody || null,
          registrationType || null,
          registrationNumber || null,
          registrationExpiry || null,
          id,
        ]
      );

      return NextResponse.json({
        success: true,
        message: "Step 5 updated successfully",
        mode: "update",
      });
    }

    // =========================
    // 🟡 INSERT
    // =========================
    await pool.execute(
      `
      INSERT INTO employee_registration (
        user_id,
        is_nurse,
        professional_body,
        registration_type,
        registration_number,
        registration_expiry
      ) VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        isNurse,
        professionalBody || null,
        registrationType || null,
        registrationNumber || null,
        registrationExpiry || null,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Step 5 submitted successfully",
      mode: "create",
    });
  } catch (error) {
    console.error("Step5 API Error:", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}