import { NextRequest, NextResponse } from "next/server";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  LevelFormat,
} from "docx";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fullName = searchParams.get("name") || "Full Name";
  const email = searchParams.get("email") || "email@example.com";
  const capitalizeName = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            size: 24, // 12pt for all body text
            font: "Times New Roman",
          },
        },
      },
    },
    numbering: {
      config: [
        {
          reference: "bullets",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "-",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 720, hanging: 360 } } },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 12240, height: 15840 },
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children: [
          // Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "Reference Consent Form",
                bold: true,
                size: 32, // 16pt title
              }),
            ],
          }),
          new Paragraph({ children: [new TextRun("")] }),

          // Section: Candidate Information
          new Paragraph({
            spacing: {
              after: 300,
            },
            children: [
              new TextRun({
                text: "Candidate Information",
                bold: true,
                size: 28, // 14pt heading
              }),
            ],
          }),
          new Paragraph({
            numbering: { reference: "bullets", level: 0 },
            children: [
              new TextRun({
                text: "Full Name: ",
                bold: true,
                size: 24,
              }),
              new TextRun({
                text: capitalizeName(fullName),
                size: 24,
              }),
            ],
          }),

          new Paragraph({
            numbering: { reference: "bullets", level: 0 },
            children: [
              new TextRun({
                text: "Email Address: ",
                bold: true,
                size: 24,
              }),
              new TextRun({
                text: email,
                size: 24,
              }),
            ],
          }),
          new Paragraph({ children: [new TextRun("")] }),

          // Section: Authorization
          new Paragraph({
            spacing: {
              after: 300,
            },
            children: [
              new TextRun({
                text: "Authorization and Consent",
                bold: true,
                size: 28, // 14pt heading
              }),
            ],
          }),
          new Paragraph({
            spacing: {
              after: 300,
            },
            children: [
              new TextRun({
                text: "I, the undersigned, hereby authorize ",
                size: 24,
              }),
              new TextRun({
                text: "Hayaibu Talent",
                bold: true,
                italics: true,
                size: 24,
              }),
              new TextRun({
                text: " to contact my current and/or previous employers, as well as other references I have provided, to verify information regarding my employment history, performance, and qualifications. This may include, but is not limited to, inquiries about my job duties, professional conduct, dates of employment, and eligibility for rehire.",
                size: 24,
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "I understand that this information will be used solely to assess my suitability for employment with Kingsbury Personnel's clients. I release ",
                size: 24,
              }),
              new TextRun({
                text: "Hayaibu Talent",
                bold: true,
                italics: true,
                size: 24,
              }),
              new TextRun({
                text: " and all persons or entities providing such information from any liability arising from the release or use of this information.",
                size: 24,
              }),
            ],
          }),
          new Paragraph({ children: [new TextRun("")] }),

          // Section: Acknowledgement
          new Paragraph({
            spacing: {
              after: 300,
            },
            children: [
              new TextRun({
                text: "Acknowledgement",
                bold: true,
                size: 28, // 14pt heading
              }),
            ],
          }),
          new Paragraph({ children: [new TextRun("I acknowledge that:")] }),
          new Paragraph({
            numbering: { reference: "bullets", level: 0 },
            children: [
              new TextRun("I have read and understood this consent form."),
            ],
          }),
          new Paragraph({
            numbering: { reference: "bullets", level: 0 },
            children: [
              new TextRun(
                "I voluntarily agree to the reference checks as described above.",
              ),
            ],
          }),
          new Paragraph({
            numbering: { reference: "bullets", level: 0 },
            children: [
              new TextRun(
                "A copy of this authorization shall be as valid as the original.",
              ),
            ],
          }),
          new Paragraph({ children: [new TextRun("")] }),

          // Section: Signature
          new Paragraph({
            children: [
              new TextRun({
                text: "Signature and Date",
                bold: true,
                size: 28, // 14pt heading
              }),
            ],
          }),
          new Paragraph({
            spacing: {
              after: 400,
              before: 600,
            },
            numbering: { reference: "bullets", level: 0 },
            children: [
              new TextRun({
                text: "Candidate Signature: _________________________________",
                size: 24,
              }),
            ],
          }),

          new Paragraph({
            spacing: {
              before: 300,
            },
            numbering: { reference: "bullets", level: 0 },
            children: [
              new TextRun({
                text: "Date: _______________________________________________",
                size: 24,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="signature_${fullName.replace(/ /g, "_")}.docx"`,
    },
  });
}
