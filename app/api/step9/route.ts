import { NextRequest, NextResponse } from "next/server";
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

    const conn = await pool.getConnection();

    try {
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
        [parseInt(userId)]
      );

      const timeline = rows.map(dbToFrontend);

      // =========================
      // ALSO GET AREAS
      // =========================
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

      return NextResponse.json({
        success: true,
        data: {
          areas,
          timeline,
        },
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("STEP 9 GET ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const userId = parseInt(formData.get("userId") as string);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId required" },
        { status: 400 }
      );
    }

    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      // =========================
      // 🧹 DELETE OLD TIMELINE ONLY
      // =========================
      await conn.execute(
        `DELETE FROM employee_experience WHERE user_id = ?`,
        [userId]
      );

      // =========================
      // 🟢 UPDATE AREA (SINGLE ROW)
      // =========================
      const areasRaw = formData.get("areas");

      if (areasRaw) {
        const areas = JSON.parse(areasRaw as string);

        const areaFlags = {
          mental_health: areas.includes("Mental Health") ? 1 : 0,
          learning_disabilities: areas.includes("Learning Disabilities") ? 1 : 0,
          drug_and_alcohol: areas.includes("Drug & Alcohol") ? 1 : 0,
          housing: areas.includes("Housing") ? 1 : 0,
          elderly: areas.includes("Elderly") ? 1 : 0,
          children_young_people: areas.includes("Children/Young People") ? 1 : 0,
        };

        // Check if row exists
        const [existing]: any = await conn.execute(
          `SELECT id FROM employee_experience_areas WHERE user_id = ?`,
          [userId]
        );

        if (existing.length > 0) {
          // UPDATE
          await conn.execute(
            `UPDATE employee_experience_areas SET
              mental_health = ?,
              learning_disabilities = ?,
              drug_and_alcohol = ?,
              housing = ?,
              elderly = ?,
              children_young_people = ?,
              updated_at = CURRENT_TIMESTAMP
             WHERE user_id = ?`,
            [
              areaFlags.mental_health,
              areaFlags.learning_disabilities,
              areaFlags.drug_and_alcohol,
              areaFlags.housing,
              areaFlags.elderly,
              areaFlags.children_young_people,
              userId,
            ]
          );
        } else {
          // INSERT
          await conn.execute(
            `INSERT INTO employee_experience_areas (
              user_id,
              mental_health,
              learning_disabilities,
              drug_and_alcohol,
              housing,
              elderly,
              children_young_people
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              userId,
              areaFlags.mental_health,
              areaFlags.learning_disabilities,
              areaFlags.drug_and_alcohol,
              areaFlags.housing,
              areaFlags.elderly,
              areaFlags.children_young_people,
            ]
          );
        }
      }

      // =========================
      // 🟢 SAVE TIMELINE
      // =========================
      let i = 0;

      while (formData.get(`timeline[${i}][kind]`)) {
        const kind = formData.get(`timeline[${i}][kind]`) as string;

        if (kind === "experience") {
          await conn.execute(
            `INSERT INTO employee_experience (
              user_id,
              kind,
              sort_order,
              employer_name,
              job_title,
              duties,
              date_from,
              date_to
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              userId,
              "experience",
              i + 1,
              formData.get(`timeline[${i}][employerName]`) || null,
              formData.get(`timeline[${i}][jobTitle]`) || null,
              formData.get(`timeline[${i}][duties]`) || null,
              formData.get(`timeline[${i}][dateFrom]`) || null,
              formData.get(`timeline[${i}][dateTo]`) || null,
            ]
          );
        }

        if (kind === "gap") {
          await conn.execute(
            `INSERT INTO employee_experience (
              user_id,
              kind,
              sort_order,
              gap_from,
              gap_to,
              reason
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [
              userId,
              "gap",
              i + 1,
              formData.get(`timeline[${i}][gapFrom]`) || null,
              formData.get(`timeline[${i}][gapTo]`) || null,
              formData.get(`timeline[${i}][reason]`) || null,
            ]
          );
        }

        i++;
      }

      await conn.commit();

      return NextResponse.json({
        success: true,
        message: "Step 9 saved successfully",
      });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("STEP 9 ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}