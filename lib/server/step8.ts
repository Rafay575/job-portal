import "server-only";
import pool from "@/lib/db";

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

export async function getStep8DB(userId: number | string | null) {
  try {
    if (!userId) {
      return {
        success: false,
        message: "userId is required",
        data: [],
      };
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
        DATE_FORMAT(start_date, '%Y-%m-%d') AS start_date,
        DATE_FORMAT(end_date, '%Y-%m-%d') AS end_date,
        completed,
        has_professional_registration,
        registration_body,
        registration_number,
        DATE_FORMAT(registration_expiry, '%Y-%m-%d') AS registration_expiry,
        certificate_file,
        additional_notes,
        DATE_FORMAT(gap_from, '%Y-%m-%d') AS gap_from,
        DATE_FORMAT(gap_to, '%Y-%m-%d') AS gap_to,
        reason
      FROM employee_educations
      WHERE user_id = ?
      ORDER BY sort_order ASC
      `,
      [userId]
    );

    const formattedData = rows.map(dbToFrontend);

    return {
      success: true,
      data: formattedData,
    };
  } catch (error) {
    console.error("getStep8DB error:", error);

    return {
      success: false,
      message: "Server error",
      data: [],
    };
  }
}
