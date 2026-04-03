import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "public/uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

async function saveFile(file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadDir, fileName);

  fs.writeFileSync(filePath, buffer);

  return `/uploads/${fileName}`; // store THIS in DB
}

// Helper function to convert DB record to frontend format
function dbToFrontend(dbRecord: any) {
  if (dbRecord.entry_type === "education") {
    return {
      id: dbRecord.id,
      kind: "education",
      qualificationType: dbRecord.qualification_type,
      qualificationTitle: dbRecord.qualification_title,
      institutionName: dbRecord.institution_name,
      institutionCountry: dbRecord.institution_country,
      awardingBody: dbRecord.awarding_body,
      gradeOrResult: dbRecord.grade_or_result,
      startDate: dbRecord.start_date || "",
      endDate: dbRecord.end_date || "",
      registrationExpiry: dbRecord.registration_expiry || "",
      completed: dbRecord.completed === 1 ? "yes" : "no",
      hasProfessionalRegistration:
      dbRecord.has_professional_registration === 1 ? "yes" : "no",
      registrationBody: dbRecord.registration_body,
      registrationNumber: dbRecord.registration_number,
      certificateFile: dbRecord.certificate_file,
      additionalNotes: dbRecord.additional_notes,
    };
  } else {
    return {
      id: dbRecord.id,
      kind: "gap",
      gapFrom: dbRecord.gap_from || "",
      gapTo: dbRecord.gap_to || "",
      reason: dbRecord.reason,
    };
  }
}

// 🟢 GET TIMELINE (ALL DATA)
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

    const [rows]: any = await pool.execute(
      `
  SELECT
    id,
    user_id,
    entry_type,
    sort_order,
    qualification_type,
    qualification_title,
    institution_name,
    institution_country,
    awarding_body,
    grade_or_result,
    DATE_FORMAT(start_date, '%d-%m-%Y') AS start_date,
    DATE_FORMAT(end_date, '%d-%m-%Y') AS end_date,
    completed,
    has_professional_registration,
    registration_body,
    registration_number,
    DATE_FORMAT(registration_expiry, '%d-%m-%Y') AS registration_expiry,
    certificate_file,
    additional_notes,
    DATE_FORMAT(gap_from, '%d-%m-%Y') AS gap_from,
    DATE_FORMAT(gap_to, '%d-%m-%Y') AS gap_to,
    reason

  FROM employee_educations
  WHERE user_id = ?
  ORDER BY sort_order ASC
  `,
      [parseInt(userId)],
    );

    // Convert DB records to frontend format
    const formattedData = rows.map(dbToFrontend);

    return NextResponse.json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}

// 🟢 POST API
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const userId = formData.get("userId") as string;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId required" },
        { status: 400 },
      );
    }
 
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      // 🧹 DELETE OLD DATA
      await conn.execute(`DELETE FROM employee_educations WHERE user_id = ?`, [
        parseInt(userId),
      ]);

      let i = 0;

      // 🔁 LOOP THROUGH FORM DATA
      while (formData.get(`timeline[${i}][kind]`)) {
        const kind = formData.get(`timeline[${i}][kind]`) as string;

        // =========================
        // 🎓 EDUCATION
        // =========================
        if (kind === "education") {
          const file = formData.get(`certificate_${i}`) as File | null;
          const existingFile = formData.get(`existing_certificate_${i}`) as
            | string
            | null;

          let filePath = existingFile || null;

          // ✅ If new file uploaded → replace
          if (file && file.size > 0) {
            filePath = await saveFile(file);
          }

          await conn.execute(
            `
            INSERT INTO employee_educations (
              user_id,
              entry_type,
              sort_order,
              qualification_type,
              qualification_title,
              institution_name,
              institution_country,
              awarding_body,
              grade_or_result,
              start_date,
              end_date,
              completed,
              has_professional_registration,
              registration_body,
              registration_number,
              registration_expiry,
              certificate_file,
              additional_notes
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            `,
            [
              parseInt(userId),
              "education",
              i + 1,

              formData.get(`timeline[${i}][qualificationType]`) || null,
              formData.get(`timeline[${i}][qualificationTitle]`) || null,
              formData.get(`timeline[${i}][institutionName]`) || null,
              formData.get(`timeline[${i}][institutionCountry]`) || null,
              formData.get(`timeline[${i}][awardingBody]`) || null,
              formData.get(`timeline[${i}][gradeOrResult]`) || null,
              formData.get(`timeline[${i}][startDate]`) || null,
              formData.get(`timeline[${i}][endDate]`) || null,

              formData.get(`timeline[${i}][completed]`) === "yes" ? 1 : 0,
              formData.get(`timeline[${i}][hasProfessionalRegistration]`) ===
              "yes"
                ? 1
                : 0,

              formData.get(`timeline[${i}][registrationBody]`) || null,
              formData.get(`timeline[${i}][registrationNumber]`) || null,
              formData.get(`timeline[${i}][registrationExpiry]`) || null,

              filePath,
              formData.get(`timeline[${i}][additionalNotes]`) || null,
            ],
          );
        }

        // =========================
        // ⛔ GAP
        // =========================
        if (kind === "gap") {
          await conn.execute(
            `
            INSERT INTO employee_educations (
              user_id,
              entry_type,
              sort_order,
              gap_from,
              gap_to,
              reason
            ) VALUES (?,?,?,?,?,?)
            `,
            [
              parseInt(userId),
              "gap",
              i + 1,

              formData.get(`timeline[${i}][gapFrom]`) || null,
              formData.get(`timeline[${i}][gapTo]`) || null,
              formData.get(`timeline[${i}][reason]`) || null,
            ],
          );
        }

        i++;
      }

      await conn.commit();

      return NextResponse.json({
        success: true,
        message: "Educations Data saved successfully",
      });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("POST ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
