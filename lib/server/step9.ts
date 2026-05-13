// lib/server/step9.ts
import "server-only";
import pool from "@/lib/db";

function dbToFrontend(row: any) {
  if (row.kind === "experience") {
    return {
      id: row.id,
      kind: "experience",
      employerName: row.employer_name || "",
      jobTitle: row.job_title || "",
      duties: row.duties || "",
      dateFrom: row.date_from || "",
      dateTo: row.date_to || "",
    };
  }

  return {
    id: row.id,
    kind: "gap",
    gapFrom: row.gap_from || "",
    gapTo: row.gap_to || "",
    reason: row.reason || "",
  };
}

export async function getStep9DB(userId: number | string | null) {
  const conn = await pool.getConnection();

  try {
    if (!userId) {
      return {
        success: false,
        data: {
          areas: [],
          timeline: [],
        },
      };
    }

    const [rows]: any = await conn.execute(
      `
      SELECT 
        id,
        user_id,
        kind,
        sort_order,

        employer_name,
        job_title,
        duties,

        DATE_FORMAT(date_from, '%Y-%m-%d') AS date_from,
        DATE_FORMAT(date_to, '%Y-%m-%d') AS date_to,

        DATE_FORMAT(gap_from, '%Y-%m-%d') AS gap_from,
        DATE_FORMAT(gap_to, '%Y-%m-%d') AS gap_to,

        reason
      FROM employee_experience
      WHERE user_id = ?
      ORDER BY sort_order ASC
      `,
      [parseInt(userId as string)]
    );

    const timeline = rows.map(dbToFrontend);

    const [areaRows]: any = await conn.execute(
      `SELECT * FROM employee_experience_areas WHERE user_id = ?`,
      [userId]
    );

    let areas: string[] = [];

    if (areaRows.length > 0) {
      const row = areaRows[0];

      const mapping: Record<string, string> = {
        mental_health: "Mental Health",
        learning_disabilities: "Learning Disabilities",
        drug_and_alcohol: "Drug & Alcohol",
        housing: "Housing",
        elderly: "Elderly",
        children_young_people: "Children/Young People",
      };

      for (const key in mapping) {
        if (row[key] === 1) {
          areas.push(mapping[key]);
        }
      }
    }

    return {
      success: true,
      data: {
        areas,
        timeline,
      },
    };
    
  } catch (error) {
    console.error("getStep9DB error:", error);

    return {
      success: false,
      data: {
        areas: [],
        timeline: [],
      },
    };
  } finally {
    conn.release();
  }
}
