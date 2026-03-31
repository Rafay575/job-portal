import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// GET STEP 2
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
        availability_issue,
        overtime,
        hours_avoid,
        notice_period,
        applied_before,
        applied_details,
        work_restrictions,
        restriction_details,
        worked_before,
        created_at,
        updated_at
      FROM employee_questions
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


// CREATE / UPDATE STEP 2
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      userId,
      availabilityIssue,
      overtime,
      hoursAvoid,
      noticePeriod,
      appliedBefore,
      appliedDetails,
      workRestrictions,
      restrictionDetails,
      workedBefore,
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
      `SELECT id FROM employee_questions WHERE user_id = ?`,
      [userId]
    );

    // =========================
    // 🟢 UPDATE
    // =========================
    if (existing.length > 0) {
      const id = existing[0].id;

      await pool.execute(
        `
        UPDATE employee_questions SET
          availability_issue = ?,
          overtime = ?,
          hours_avoid = ?,
          notice_period = ?,
          applied_before = ?,
          applied_details = ?,
          work_restrictions = ?,
          restriction_details = ?,
          worked_before = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
        [
          availabilityIssue,
          overtime,
          hoursAvoid,
          noticePeriod,
          appliedBefore,
          appliedDetails || null,
          workRestrictions,
          restrictionDetails || null,
          workedBefore,
          id,
        ]
      );

      return NextResponse.json({
        success: true,
        message: "Step 2 updated successfully",
        mode: "update",
      });
    }

    // =========================
    // 🟡 INSERT
    // =========================
    await pool.execute(
      `
      INSERT INTO employee_questions (
        user_id,
        availability_issue,
        overtime,
        hours_avoid,
        notice_period,
        applied_before,
        applied_details,
        work_restrictions,
        restriction_details,
        worked_before
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        availabilityIssue,
        overtime,
        hoursAvoid,
        noticePeriod,
        appliedBefore,
        appliedDetails || null,
        workRestrictions,
        restrictionDetails || null,
        workedBefore,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Step 2 submitted successfully",
      mode: "create",
    });
  } catch (error) {
    console.error("Step2 API Error:", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}