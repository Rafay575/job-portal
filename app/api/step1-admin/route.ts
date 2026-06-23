import { NextRequest, NextResponse } from "next/server";
import path from "path";
import pool from "@/lib/db";
import {
  sendApprovalPendingEmail,
  sendFormSubmissionEmail,
} from "@/lib/mailer";
import { writeFile, unlink } from "fs/promises";

// Get name and email of user 
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "userId is required",
        },
        { status: 400 }
      );
    }

    const [rows]: any = await pool.execute(
      `
      SELECT
        id,
        name,
        email
      FROM users
      WHERE id = ?
      `,
      [userId]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: rows[0].id,
        name: rows[0].name,
        email: rows[0].email,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

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
    e.id,
    e.user_id,
    e.type,
    e.full_name,
    e.email,
    e.phone,
    e.address,
    e.postcode,
    e.nationality,
    e.immigration_status,
    DATE_FORMAT(e.immigration_expiry, '%Y-%m-%d') AS immigration_expiry,
    e.work_permit,
    e.name_changed,
    e.previous_name,
    e.changed_to,
    e.cv_file_path,
    e.created_at,
    e.updated_at,
    u.name AS main_name,
    u.email AS main_email
  FROM employee_basic_information e
  INNER JOIN users u ON u.id = e.user_id
  WHERE e.user_id = ?
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

    const userId = Number(formData.get("userId"));
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User Id is missing" },
        { status: 400 },
      );
    }

    // Geting user original email for send emails
    const [rows]: any = await pool.execute(
      `SELECT email FROM users WHERE id = ?`,
      [userId],
    );
    // const userEmail = rows.length > 0 ? rows[0].email : null;

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

    let filePath: string | null = null;
    if (file && file.size > 0) {
      const MAX_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          {
            success: false,
            message: "File size must be maximum 5MB",
          },
          { status: 400 },
        );
      }
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir =
        process.env.IS_LOCAL === "true"
          ? path.join(process.cwd(), "public/uploads")
          : "/var/www/uploads";

      console.log("uploadDir: ", uploadDir);

      const safeName = file.name.replace(/\s+/g, "_").toLowerCase();
      const fileName = `${Date.now()}-${safeName}`;
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

      // 🗑️ If a new CV is uploaded, delete the old one first
      if (filePath) {
        const [cvRow]: any = await pool.execute(
          `SELECT cv_file_path FROM employee_basic_information WHERE id = ?`,
          [id],
        );

        const oldCvPath = cvRow?.[0]?.cv_file_path;

        if (oldCvPath) {
          const oldFullPath =
            process.env.IS_LOCAL === "true"
              ? path.join(process.cwd(), "public", oldCvPath)
              : `/var/www${oldCvPath}`;

          // const oldFullPath = `/var/www${oldCvPath}`;
          try {
            await unlink(oldFullPath);
          } catch (err) {
            console.error("Failed to delete old CV file:", err);
          }
        }
      }

      // 🔍 Get current type before update
      const [currentRows]: any = await pool.execute(
        `SELECT type FROM employee_basic_information WHERE id = ?`,
        [id],
      );

    //   const currentType = currentRows?.[0]?.type;
    //   const typeChanged = currentType !== type;
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

    //   if (typeChanged) {
    //     await pool.execute(
    //       `UPDATE users SET is_approved = 'pending' WHERE id = ?`,
    //       [userId],
    //     );
    //   }

    //   if (
    //     typeChanged &&
    //     (type === "agency-work" || type === "both") &&
    //     email &&
    //     fullName
    //   ) {
    //     try {
    //       console.log("sending email of pending");
    //       await sendApprovalPendingEmail(fullName, userEmail, type);
    //     } catch (error) {
    //       console.error("Failed to send Form approval pending email");
    //       return NextResponse.json(
    //         { message: "Failed to send Form approval pending email" },
    //         { status: 500 },
    //       );
    //     }
    //   }

    //   if (typeChanged && type === "permanent" && email && fullName && userId) {
    //     try {
    //       await sendFormSubmissionEmail(userId, userEmail, fullName, type);
    //     } catch (error) {
    //       console.error("Failed to send Form submission email");
    //       return NextResponse.json(
    //         { message: "Failed to send Form submission email" },
    //         { status: 500 },
    //       );
    //     }
    //   }
      if (type === "permanent") {
        return NextResponse.json({
          success: true,
          message: "Application updated successfully",
          mode: "create",
        });
      } else {
        return NextResponse.json({
          success: true,
          message: "Basic information updated successfully",
          mode: "create",
        });
      }
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

    // if (!email || !fullName) {
    //   console.log("no email or name found in email block");
    // } else {
    //   if (type === "permanent") {
    //     try {
    //       await sendFormSubmissionEmail(userId, userEmail, fullName, type);
    //     } catch (error) {
    //       console.error("Failed to send Form submission email");
    //       return NextResponse.json(
    //         { message: "Failed to send Form submission email" },
    //         { status: 500 },
    //       );
    //     }
    //   } else {
    //     try {
    //       await sendApprovalPendingEmail(fullName, userEmail, type);
    //     } catch (error) {
    //       console.error("Failed to send Form approval pending email");
    //       return NextResponse.json(
    //         { message: "Failed to send Form approval pending email" },
    //         { status: 500 },
    //       );
    //     }
    //   }
    // }
    if (type === "permanent") {
      return NextResponse.json({
        success: true,
        message: "Application submitted successfully",
        mode: "create",
      });
    } else {
      return NextResponse.json({
        success: true,
        message: "Basic information submitted successfully",
        mode: "create",
      });
    }
  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }
}
