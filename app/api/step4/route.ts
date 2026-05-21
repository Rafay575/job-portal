import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";


// GET STEP 4
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
        absent_days,
        absence_periods,
        on_medication,
        medication_details,
        health_treatment,
        treatment_details,
        medical_condition,
        condition_details,
        disabled,
        impairment_type,
        night_shift_fit,
        created_at,
        updated_at
      FROM employee_health
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


// CREATE / UPDATE STEP 4
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      userId,
      absentDays,
      absencePeriods,
      onMedication,
      medicationDetails,
      healthTreatment,
      treatmentDetails,
      medicalCondition,
      conditionDetails,
      disabled,
      impairmentType,
      nightShiftFit,
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
      `SELECT id FROM employee_health WHERE user_id = ?`,
      [userId]
    );

    // =========================
    // 🟢 UPDATE
    // =========================
    if (existing.length > 0) {
      const id = existing[0].id;

      await pool.execute(
        `
        UPDATE employee_health SET
          absent_days = ?,
          absence_periods = ?,
          on_medication = ?,
          medication_details = ?,
          health_treatment = ?,
          treatment_details = ?,
          medical_condition = ?,
          condition_details = ?,
          disabled = ?,
          impairment_type = ?,
          night_shift_fit = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
        [
          absentDays,
          absencePeriods,
          onMedication,
          medicationDetails || null,
          healthTreatment,
          treatmentDetails || null,
          medicalCondition,
          conditionDetails || null,
          disabled,
          impairmentType || null,
          nightShiftFit,
          id,
        ]
      );

      return NextResponse.json({
        success: true,
        message: "Health form updated successfully",
        mode: "update",
      });
    }

    // =========================
    // 🟡 INSERT
    // =========================
    await pool.execute(
      `
      INSERT INTO employee_health (
        user_id,
        absent_days,
        absence_periods,
        on_medication,
        medication_details,
        health_treatment,
        treatment_details,
        medical_condition,
        condition_details,
        disabled,
        impairment_type,
        night_shift_fit
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        absentDays,
        absencePeriods,
        onMedication,
        medicationDetails || null,
        healthTreatment,
        treatmentDetails || null,
        medicalCondition,
        conditionDetails || null,
        disabled,
        impairmentType || null,
        nightShiftFit,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Health form submitted successfully",
      mode: "create",
    });
  } catch (error) {
    console.error("Step4 API Error:", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}