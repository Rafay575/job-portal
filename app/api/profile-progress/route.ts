import { NextResponse } from "next/server";
import pool from "@/lib/db";

const tables = [
  "employee_basic_information",
  "employee_questions",
  "employee_background",
  "employee_health",
  "employee_registration",
  "employee_documents",
  "employee_trainings",
  "employee_educations",
  "employee_experience_areas",
  "employee_statement",
  "employee_declaration",
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User id is required",
        },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      tables.map(async (table, index) => {
        const [rows]: any = await pool.query(
          `SELECT 1
           FROM \`${table}\`
           WHERE user_id = ?
           LIMIT 1`,
          [userId]
        );

        return {
          step: index + 1,
          table,
          completed: rows.length > 0,
        };
      })
    );

    const completedSteps = results.filter(
      (step) => step.completed
    ).length;

    const totalSteps = tables.length;

    const percentage = Math.round(
      (completedSteps / totalSteps) * 100
    );

    return NextResponse.json({
      success: true,
      userId,
      completedSteps,
      totalSteps,
      percentage,
      steps: results,
    });
  } catch (error) {
    console.error("Profile progress error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to calculate profile progress",
      },
      { status: 500 }
    );
  }
}