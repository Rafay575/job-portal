import "server-only";
import pool from "@/lib/db";

export async function getEmailTemplateBySlug2(slug: string) {
  const [rows]: any = await pool.execute(
    "SELECT subject, template FROM email_template WHERE slug = ? LIMIT 1",
    [slug]
  );

  if (!rows.length) {
    throw new Error("Email template not found");
  }

  return rows[0];
}
