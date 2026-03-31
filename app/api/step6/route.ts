import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import fs from "fs";
import path from "path";

// 📁 Upload folder
const uploadDir = path.join(process.cwd(), "public/uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 🟢 GET STEP6
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
      `SELECT * FROM employee_documents WHERE user_id = ?`,
      [userId]
    );

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// 🟡 POST (UPLOAD FILES)
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const userId = formData.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId required" },
        { status: 400 }
      );
    }

    const saveFile = async (file: File | null) => {
      if (!file) return null;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, buffer);

      return `/uploads/${fileName}`;
    };

    const passport = await saveFile(formData.get("passport") as File);
    const drivingLicence = await saveFile(formData.get("drivingLicence") as File);
    const proofId1 = await saveFile(formData.get("proofId1") as File);
    const proofId2 = await saveFile(formData.get("proofId2") as File);

    // check existing
    const [existing]: any = await pool.execute(
      `SELECT id FROM employee_documents WHERE user_id = ?`,
      [userId]
    );

    if (existing.length > 0) {
      const id = existing[0].id;

      await pool.execute(
        `
        UPDATE employee_documents SET
          passport = COALESCE(?, passport),
          driving_licence = COALESCE(?, driving_licence),
          proof_id1 = COALESCE(?, proof_id1),
          proof_id2 = COALESCE(?, proof_id2),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
        [passport, drivingLicence, proofId1, proofId2, id]
      );

      return NextResponse.json({
        success: true,
        message: "Step 6 updated successfully",
      });
    }

    await pool.execute(
      `
      INSERT INTO employee_documents (
        user_id,
        passport,
        driving_licence,
        proof_id1,
        proof_id2
      ) VALUES (?, ?, ?, ?, ?)
      `,
      [userId, passport, drivingLicence, proofId1, proofId2]
    );

    return NextResponse.json({
      success: true,
      message: "Step 6 submitted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 }
    );
  }
}