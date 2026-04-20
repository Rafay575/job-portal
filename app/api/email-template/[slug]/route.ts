import { NextResponse } from "next/server";
import db from "@/lib/db";

// GET ONE
export async function GET(
  req: Request,
  context: { params: Promise<{ slug?: string }> }
) {
  try {
    const { slug } = await context.params;

    if (!slug) {
      return Response.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }

    const [rows]: any = await db.execute(
      `SELECT  
        id,
        slug,
        subject,
        template,
        variables,
        DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at,
        DATE_FORMAT(updated_at, '%Y-%m-%d') AS updated_at 
       FROM email_template 
       WHERE slug = ?`,
      [slug]
    );

    if (rows.length === 0) {
      return Response.json(
        { message: "Not found" },
        { status: 404 }
      );
    }

    const row = rows[0];

    let parsedVariables = null;
    try {
      parsedVariables = row.variables
        ? JSON.parse(row.variables)
        : null;
    } catch {
      parsedVariables = row.variables;
    }

    return Response.json({
      id: row.id,
      slug: row.slug,
      subject: row.subject,
      template: row.template,
      variables: parsedVariables,
      created_at: row.created_at,
      updated_at: row.updated_at,
    });
  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(
  req: Request,
  context: { params: Promise<{ slug?: string }> }
) {
  try {
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }

    const [check]: any = await db.execute(
      "SELECT id FROM email_template WHERE slug = ?",
      [slug]
    );

    if (check.length === 0) {
      return NextResponse.json(
        { message: "Not found" },
        { status: 404 }
      );
    }

    await db.execute(
      "DELETE FROM email_template WHERE slug = ?",
      [slug]
    );

    return NextResponse.json({
      message: "Deleted successfully",
      slug,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}