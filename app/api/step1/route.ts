import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import pool from "@/lib/db";
import {
  sendApprovalPendingEmail,
  sendFormSubmissionEmail,
} from "@/lib/mailer";

// Get Step1
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
        type,
        full_name,
        email,
        phone,
        address,
        postcode,
        nationality,
        immigration_status,
        DATE_FORMAT(immigration_expiry, '%Y-%m-%d') AS immigration_expiry,
        work_permit,
        name_changed,
        previous_name,
        changed_to,
        cv_file_path,
        created_at,
        updated_at
      FROM employee_basic_information 
      WHERE user_id = ?
      `,
      [userId],
    );

    // 🔴 CHECK IF USER EXISTS
    if (!rows || rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
          data: null,
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
// Create or Edit Step1
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    // 🔹 Extract fields
    const userId = Number(formData.get("userId"));

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User Id is missing" },
        { status: 400 },
      );
    }

    const type = formData.get("type") as string;
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const postcode = formData.get("postcode") as string;
    const nationality = formData.get("nationality") as string;
    const immigrationStatus = formData.get("immigrationStatus") as string;
    const immigrationExpiry = formData.get("immigrationExpiry") as string;

    const workPermit = formData.get("workPermit") === "true" ? 1 : 0;
    const nameChanged = formData.get("nameChanged") === "true" ? 1 : 0;

    const previousName = formData.get("previousName") as string;
    const changedTo = formData.get("changedTo") as string;

    const file = formData.get("cvFile") as File | null;

    // 📁 FILE UPLOAD
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

    // 🔍 CHECK IF USER ALREADY EXISTS
    const [existing]: any = await pool.execute(
      `SELECT id FROM employee_basic_information WHERE user_id = ?`,
      [userId],
    );

    // 🟢 IF EXISTS → UPDATE
    if (existing.length > 0) {
      const id = existing[0].id;

      // 🔍 Get current type before update
      const [currentRows]: any = await pool.execute(
        `SELECT type FROM employee_basic_information WHERE id = ?`,
        [id],
      );

      const currentType = currentRows?.[0]?.type;
      const typeChanged = currentType !== type;
      await pool.execute(
        `
    UPDATE employee_basic_information SET
      type=?,
      full_name = ?,
      email = ?,
      phone = ?,
      address = ?,
      postcode = ?,
      nationality = ?,
      immigration_status = ?,
      immigration_expiry = ?,
      work_permit = ?,
      name_changed = ?,
      previous_name = ?,
      changed_to = ?,
      cv_file_path = COALESCE(?, cv_file_path),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
    `,
        [
          type,
          fullName,
          email,
          phone,
          address,
          postcode,
          nationality,
          immigrationStatus,
          immigrationExpiry,
          workPermit,
          nameChanged,
          previousName || null,
          changedTo || null,
          filePath,
          id,
        ],
      );

      await pool.execute(
        `UPDATE users SET is_approved = 'pending' WHERE id = ?`,
        [userId],
      );

      if (
        typeChanged &&
        (type === "agency-work" || type === "both") &&
        email &&
        fullName
      ) {
        try {
          await sendApprovalPendingEmail(fullName, email);
        } catch (error) {
          console.error("Failed to send Form approval pending email");
          return NextResponse.json(
            { message: "Failed to send Form approval pending email" },
            { status: 500 },
          );
        }
      }

      if (typeChanged && type === "permanent" && email && fullName && userId) {
        try {
          await sendFormSubmissionEmail(userId, email, fullName);
        } catch (error) {
          console.error("Failed to send Form submission email");
          return NextResponse.json(
            { message: "Failed to send Form submission email" },
            { status: 500 },
          );
        }
      }
      return NextResponse.json({
        success: true,
        message: "Step 1 updated successfully",
        mode: "update",
      });
    }

    // =========================
    // 🟡 IF NOT EXISTS → INSERT
    // =========================
    await pool.execute(
      `
      INSERT INTO employee_basic_information (
        user_id,
        type,
        full_name,
        email,
        phone,
        address,
        postcode,
        nationality,
        immigration_status,
        immigration_expiry,
        work_permit,
        name_changed,
        previous_name,
        changed_to,
        cv_file_path
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
      `,
      [
        userId,
        type,
        fullName,
        email,
        phone,
        address,
        postcode,
        nationality,
        immigrationStatus,
        immigrationExpiry,
        workPermit,
        nameChanged,
        previousName || null,
        changedTo || null,
        filePath,
      ],
    );

    if (!email || !fullName) {
      console.log("no email or name found in email block");
    } else {
      if (type === "permanent") {
        try {
          await sendFormSubmissionEmail(userId, email, fullName);
        } catch (error) {
          console.error("Failed to send Form submission email");
          return NextResponse.json(
            { message: "Failed to send Form submission email" },
            { status: 500 },
          );
        }
      } else {
        try {
          await sendApprovalPendingEmail(fullName, email);
        } catch (error) {
          console.error("Failed to send Form approval pending email");
          return NextResponse.json(
            { message: "Failed to send Form approval pending email" },
            { status: 500 },
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Step 1 submitted successfully",
      mode: "create",
    });
  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }
}
