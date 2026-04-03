import { NextResponse } from "next/server";
import { getUserPDF } from "@/lib/getUserPdf";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { buffer, filename } = await getUserPDF(params.id);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}