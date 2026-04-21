import { NextRequest, NextResponse } from "next/server";
import { getUserPDF } from "@/lib/getUserPdf";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // 👈 IMPORTANT: await params

    const { buffer, filename } = await getUserPDF(id);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}