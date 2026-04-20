import { NextResponse } from "next/server";
import db from "@/lib/db"; // your db connection

// CREATE
export async function POST(req: Request) {
  try {
    const body = await req.json();

    let { slug, subject, template, variables } = body;

    // Validate slug exists
    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { error: "Slug is required and must be a string" },
        { status: 400 },
      );
    }

    // Convert slug to lowercase and replace spaces with underscores
    slug = slug
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .replace(/[^a-z0-9_-]/g, "") // Remove any special characters (keep letters, numbers, underscores, hyphens)
      .replace(/_-+/g, "_") // Clean up multiple underscores
      .replace(/^_+|_+$/g, ""); // Remove leading/trailing underscores

    // Check if slug already exists (optional but recommended)
    const [existing]: any = await db.execute(
      `SELECT id FROM email_template WHERE slug = ?`,
      [slug],
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: `Slug '${slug}' already exists. Please use a unique slug.` },
        { status: 409 },
      );
    }

    const [result]: any = await db.execute(
      `INSERT INTO email_template 
      (slug, subject, template, variables) 
      VALUES (?, ?, ?, ?)`,
      [slug,subject, template, JSON.stringify(variables || null)],
    );

    return NextResponse.json({
      message: "Created successfully",
      id: result.insertId,
      slug: slug, // Return the formatted slug
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET ALL
export async function GET() {
  try {
    const [rows]: any = await db.execute(`
      SELECT 
        id,
        slug,
        subject,
        template,
        variables,
        DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at,
        DATE_FORMAT(updated_at, '%Y-%m-%d') AS updated_at
      FROM email_template
      ORDER BY created_at DESC
    `);

    // ✅ parse JSON safely for all rows
    const parsedRows = rows.map((row: any) => {
      let parsedVariables = null;

      try {
        parsedVariables = row.variables
          ? JSON.parse(row.variables)
          : null;
      } catch {
        parsedVariables = row.variables;
      }

      return {
        ...row,
        variables: parsedVariables,
      };
    });

    return NextResponse.json(parsedRows);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// UPDATE with query
export async function PUT(req: Request) {
  try {
    // ✅ get query params
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID is required in query params" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const { slug, subject, template, variables } = body;

    if (!slug || !subject || !template) {
      return NextResponse.json(
        {
          error: "slug, subject, template are required",
        },
        { status: 400 },
      );
    }
    // Convert slug to lowercase and replace spaces with underscores
    let formattedSlug = slug
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_-]/g, "")
      .replace(/_-+/g, "_")
      .replace(/^_+|_+$/g, "");

    // ✅ check if exists
    const [existing]: any = await db.execute(
      "SELECT id FROM email_template WHERE id = ?",
      [id],
    );

    if (existing.length === 0) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    // ✅ update
    await db.execute(
      `UPDATE email_template 
       SET slug=?, subject=?, template=?, variables=? 
       WHERE id=?`,
      [
        formattedSlug,
        subject,
        template,
        JSON.stringify(variables || null),
        id,
      ],
    );

    return NextResponse.json({
      message: "Updated successfully",
      id,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
