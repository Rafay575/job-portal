import jsPDF from "jspdf";
import fs from "fs";
import path from "path";

function getLogoBase64() {
  const filePath = path.join(process.cwd(), "public/logo.png");
  const file = fs.readFileSync(filePath);
  return `data:image/png;base64,${file.toString("base64")}`;
}

function isEmpty(val: any): boolean {
  if (!val) return true;
  if (Array.isArray(val)) return val.length === 0;
  if (typeof val === "object") return Object.keys(val).length === 0;
  return false;
}
export async function generatePDFBuffer(user: any) {
  const {
    basic,
    questions,
    background,
    health,
    registration,
    documents,
    trainings,
    educations,
    experience,
    statement,
    declaration,
  } = user;
const capitalize = (str: string) => {
  if (!str) return "—";

  return str
    .trim()
    .split(" ")
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
};
  const isPermanent = basic?.type === "permanent";
 const logoBase64 = getLogoBase64();
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const PAGE_W = 210;
  const MARGIN = 14;
  const COL_W = (PAGE_W - MARGIN * 2) / 2;
  const MAX_Y = 275;

  let y = 0;

  // ── colour palette ────────────────────────────────────────────────────────
  const PRIMARY = [92, 73, 216] as const; // blue
  const HEADER_BG = [240, 245, 255] as const; // light blue-grey
  const LABEL_COL = [90, 90, 110] as const;
  const VALUE_COL = [30, 30, 30] as const;
  const DIVIDER = [210, 215, 230] as const;

  // ── helpers ───────────────────────────────────────────────────────────────

  function checkPageBreak(needed = 10) {
    if (y + needed > MAX_Y) {
      doc.addPage();
      y = 16;
    }
  }

  function drawCoverPage() {
    const W = PAGE_W;

    // ── White Background ──
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, W, 297, "F");

    const PRIMARY = [96, 77, 227];
    const TEXT_DARK = [40, 40, 60];
    const TEXT_LIGHT = [120, 120, 140];

    const LEFT = 25;

    // ── Logo (Centered) ──
    const logoW = 60;
    const logoH = 20;
    const logoX = (W - logoW) / 2;
    doc.addImage(logoBase64, "PNG", logoX, 20, logoW, logoH);

    // ── Accent Line (Centered under logo) ──
    doc.setDrawColor(96, 77, 227);
    doc.setLineWidth(1);
    doc.line(W / 2 - 25, 45, W / 2 + 25, 45);

    // ── Title (Primary Color) ──
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(96, 77, 227);
    doc.text("Applicant Details", LEFT, 60);
    

    // ── Info Fields ──
    const infoFields = [
      {
        label: "Name",
        value: (capitalize(basic.full_name) || "—"), 
       
      },
      { label: "Email", value: basic.email || "—" },
      { label: "Phone", value: basic.phone || "—" },
      { label: "Address", value: basic.address || "—" },
      {
        label: "Type",
        value:
          basic.type === "permanent"
            ? "Permanent"
            : basic.type === "agency-work"
              ? "Agency Work"
              : basic.type === "both"
                ? "Both"
                : "—",
      },
    ];

    let dy = 75;

    infoFields.forEach(({ label, value }) => {
      // Label
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(120, 120, 140);
      doc.text(label.toUpperCase(), LEFT, dy);

      // Value
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 60);

      const lines = doc.splitTextToSize(String(value), W - 50);
      doc.text(lines, LEFT, dy + 7);

      dy += lines.length > 1 ? 18 + (lines.length - 1) * 5 : 18;

      // Divider
      doc.setDrawColor(220, 220, 230);
      doc.setLineWidth(0.3);
      doc.line(LEFT, dy - 5, W - 25, dy - 5);
    });

    // ── Footer ──
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 170);
    doc.text(
      `Generated on ${new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`,
      W / 2,
      285,
      { align: "center" },
    );

    doc.addPage();
    y = 16;
  }
  function sectionHeader(title: string) {
    checkPageBreak(16);
    doc.setFillColor(...HEADER_BG);
    doc.rect(MARGIN, y, PAGE_W - MARGIN * 2, 10, "F");
    doc.setDrawColor(...PRIMARY);
    doc.setLineWidth(0.6);
    doc.line(MARGIN, y, MARGIN, y + 10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...PRIMARY);
    doc.text(title, MARGIN + 4, y + 7);
    y += 14;
  }

  function field(
    label: string,
    value: string | undefined | null,
    x: number,
    colW: number,
  ) {
    const val = value || "—";
    checkPageBreak(14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...LABEL_COL);
    doc.text(label, x, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...VALUE_COL);
    const lines = doc.splitTextToSize(val, colW - 4);
    doc.text(lines, x, y + 4);
    const lineH = lines.length * 5;
    return lineH + 8; // height consumed
  }

  /** Renders a grid of [label, value] pairs in 2 columns */
  function fieldGrid(pairs: [string, string | undefined | null][]) {
    let i = 0;
    while (i < pairs.length) {
      checkPageBreak(18);
      const rowStart = y;
      const left = pairs[i];
      const right = pairs[i + 1];
      const lh1 = left
        ? field(left[0], String(left[1] ?? "—"), MARGIN, COL_W)
        : 0;
      const lh2 = right
        ? field(right[0], String(right[1] ?? "—"), MARGIN + COL_W, COL_W)
        : 0;
      y = rowStart + Math.max(lh1, lh2);
      i += 2;
    }
    y += 2;
  }

  function divider() {
    doc.setDrawColor(...DIVIDER);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 4;
  }

  function subHeader(title: string) {
    checkPageBreak(10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...PRIMARY);
    doc.text(title, MARGIN, y);
    y += 5;
  }

  // ── Build PDF ─────────────────────────────────────────────────────────────

  drawCoverPage();

  // Step 1 – Personal Info (always shown)
  sectionHeader("Step 1 – Personal Info");
  fieldGrid([
    ["Full Name",capitalize(basic.full_name)],
    ["Email", basic.email],
    ["Phone", basic.phone],
    ["Address", basic.address],
    ["Postcode", basic.postcode],
    ["Nationality", basic.nationality],
    ["Immigration", basic.immigration_status],
    ["Expiry", basic.immigration_expiry],
    ["Work Permit", basic.work_permit ? "Yes" : "No"],
    ["Name Changed", basic.name_changed ? "Yes" : "No"],
    ...(basic.name_changed
      ? ([
          ["Previous Name", basic.previous_name],
          ["Changed To", basic.changed_to],
        ] as [string, string][])
      : []),
    ...(basic.type !== "agency-work"
      ? ([
          [
            "CV",
            basic.cv_file_path
              ? process.env.NEXT_PUBLIC_API_URL + basic.cv_file_path
              : "Not uploaded",
          ],
        ] as [string, string][])
      : []),
  ]);

  if (!isPermanent) {
    // Step 2 – Pre-Qualifying
    divider();
    sectionHeader("Step 2 – Pre-Qualifying");
    if (isEmpty(questions)) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(200, 140, 0);
      doc.text("⚠ Not submitted yet.", MARGIN, y);
      y += 8;
    } else {
      fieldGrid([
        ["Availability Issue", questions.availability_issue ? "Yes" : "No"],
        ["Work Restrictions", questions.work_restrictions ? "Yes" : "No"],
        ...(questions.work_restrictions
          ? ([["Restriction Details", questions.restriction_details]] as [
              string,
              string,
            ][])
          : []),
        ["Overtime", questions.overtime ? "Yes" : "No"],
        ["Hours to Avoid", questions.hours_avoid],
        ["Notice Period", questions.notice_period],
        ["Worked Before", questions.worked_before ? "Yes" : "No"],
        ["Applied Before", questions.applied_before ? "Yes" : "No"],
        ...(questions.applied_before
          ? ([["Applied Details", questions.applied_details]] as [
              string,
              string,
            ][])
          : []),
      ]);
    }

    // Step 3 – Criminal & Compliance
    divider();
    sectionHeader("Step 3 – Criminal & Compliance");
    if (isEmpty(background)) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(200, 140, 0);
      doc.text("⚠ Not submitted yet.", MARGIN, y);
      y += 8;
    } else {
      fieldGrid([
        ["Any Convictions", background.has_convictions ? "Yes" : "No"],
        ...(background.has_convictions
          ? ([["Conviction Details", background.conviction_details]] as [
              string,
              string,
            ][])
          : []),
        [
          "Unspent Convictions",
          background.has_unspent_convictions ? "Yes" : "No",
        ],
        ...(background.has_unspent_convictions
          ? ([["Unspent Details", background.unspent_details]] as [
              string,
              string,
            ][])
          : []),
        [
          "Fitness Investigation",
          background.fitness_investigation ? "Yes" : "No",
        ],
        [
          "Removed From Register",
          background.removed_from_register ? "Yes" : "No",
        ],
        ["CRB Check", background.crb ? "Yes" : "No"],
        ...(background.crb
          ? ([
              ["Surname", background.surname],
              ["Date of Birth", background.dob],
              [
                "CRB File",
                process.env.NEXT_PUBLIC_API_URL + background.crb_file_path ||
                  "Not uploaded",
              ],
            ] as [string, string][])
          : []),
      ]);
    }

    // Step 4 – Health
    divider();
    sectionHeader("Step 4 – Health Information");
    if (isEmpty(health)) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(200, 140, 0);
      doc.text("⚠ Not submitted yet.", MARGIN, y);
      y += 8;
    } else {
      fieldGrid([
        ["Absent Days", health.absent_days],
        ["Absence Periods", health.absence_periods],
        ["On Medication", health.on_medication ? "Yes" : "No"],
        ...(health.on_medication
          ? ([["Medication Details", health.medication_details]] as [
              string,
              string,
            ][])
          : []),
        ["Health Treatment", health.health_treatment ? "Yes" : "No"],
        ...(health.health_treatment
          ? ([["Treatment Details", health.treatment_details]] as [
              string,
              string,
            ][])
          : []),
        ["Medical Condition", health.medical_condition ? "Yes" : "No"],
        ...(health.medical_condition
          ? ([["Condition Details", health.condition_details]] as [
              string,
              string,
            ][])
          : []),
        ["Disabled", health.disabled ? "Yes" : "No"],
        ...(health.disabled
          ? ([["Impairment Type", health.impairment_type]] as [
              string,
              string,
            ][])
          : []),
        ["Fit for Night Shift", health.night_shift_fit ? "Yes" : "No"],
      ]);
    }

    // Step 5 – Professional Registration
    divider();
    sectionHeader("Step 5 – Professional Registration");
    if (isEmpty(registration)) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(200, 140, 0);
      doc.text("⚠ Not submitted yet.", MARGIN, y);
      y += 8;
    } else {
      fieldGrid([
        ["Is Nurse", registration.is_nurse ? "Yes" : "No"],
        ...(registration.is_nurse
          ? ([
              ["Professional Body", registration.professional_body],
              ["Registration Type", registration.registration_type],
              ["Registration Number", registration.registration_number],
              ["Registration Expiry", registration.registration_expiry],
            ] as [string, string][])
          : []),
      ]);
    }

    // Step 6 – Documents
    divider();
    sectionHeader("Step 6 – Documents");
    if (isEmpty(documents)) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(200, 140, 0);
      doc.text("⚠ Not submitted yet.", MARGIN, y);
      y += 8;
    } else {
      fieldGrid([
        [
          "Passport",
          process.env.NEXT_PUBLIC_API_URL + documents.passport ||
            "Not uploaded",
        ],
        [
          "Driving Licence",
          process.env.NEXT_PUBLIC_API_URL + documents.driving_licence ||
            "Not uploaded",
        ],
        [
          "Proof ID 1",
          process.env.NEXT_PUBLIC_API_URL + documents.proof_id1 ||
            "Not uploaded",
        ],
        [
          "Proof ID 2",
          process.env.NEXT_PUBLIC_API_URL + documents.proof_id2 ||
            "Not uploaded",
        ],
      ]);
    }

    // Step 7 – Training
    divider();
    sectionHeader("Step 7 – Training");
    if (isEmpty(trainings)) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(200, 140, 0);
      doc.text("⚠ Not submitted yet.", MARGIN, y);
      y += 8;
    } else {
      trainings.forEach((item: any, i: number) => {
        subHeader(`Training ${i + 1}`);
        fieldGrid([
          ["Course Title", item.title],
          ["Provider", item.provider],
          ["Duration", item.duration],
          ["Completion Date", item.completion_date],
        ]);
        if (i < trainings.length - 1) divider();
      });
    }

    // Step 8 – Education & Gaps
    divider();
    sectionHeader("Step 8 – Education & Gaps");
    if (isEmpty(educations)) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(200, 140, 0);
      doc.text("⚠ Not submitted yet.", MARGIN, y);
      y += 8;
    } else {
      educations.forEach((item: any, i: number) => {
        if (item.kind === "education") {
          subHeader("Education");
          fieldGrid([
            ["Qualification Type", item.qualificationType],
            ["Title", item.qualificationTitle],
            ["Institution", item.institutionName],
            ["Country", item.institutionCountry],
            ["Awarding Body", item.awardingBody],
            ["Grade", item.gradeOrResult],
            ["Start Date", item.startDate],
            ["End Date", item.endDate],
            ["Completed", item.completed],
            ["Professional Registration", item.hasProfessionalRegistration],
            ["Registration Body", item.registrationBody],
            ["Registration Number", item.registrationNumber],
            ["Registration Expiry", item.registrationExpiry],
            [
              "Certificate",
              process.env.NEXT_PUBLIC_API_URL + item.certificateFile ||
                "Not uploaded",
            ],
            ["Additional Notes", item.additionalNotes],
          ]);
        } else {
          subHeader("Gap");
          fieldGrid([
            ["Gap From", item.gapFrom],
            ["Gap To", item.gapTo],
            ["Reason", item.reason],
          ]);
        }
        if (i < educations.length - 1) divider();
      });
    }

    // Step 9 – Experience
    divider();
    sectionHeader("Step 9 – Experience");
    if (isEmpty(experience)) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(200, 140, 0);
      doc.text("⚠ Not submitted yet.", MARGIN, y);
      y += 8;
    } else {
      if (experience.areas?.length) {
        subHeader("Areas");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...VALUE_COL);
        const areasText = experience.areas.join(", ");
        const wrapped = doc.splitTextToSize(areasText, PAGE_W - MARGIN * 2);
        checkPageBreak(wrapped.length * 5 + 4);
        doc.text(wrapped, MARGIN, y);
        y += wrapped.length * 5 + 6;
      }
      experience.timeline?.forEach((item: any, i: number) => {
        if (item.kind === "experience") {
          subHeader("Experience");
          fieldGrid([
            ["Employer", item.employerName],
            ["Job Title", item.jobTitle],
            [
              "From",
              item.dateFrom
                ? new Date(item.dateFrom).toLocaleDateString()
                : undefined,
            ],
            [
              "To",
              item.dateTo
                ? new Date(item.dateTo).toLocaleDateString()
                : undefined,
            ],
            ["Duties", item.duties],
          ]);
        } else {
          subHeader("Gap");
          fieldGrid([
            [
              "Gap From",
              item.gapFrom
                ? new Date(item.gapFrom).toLocaleDateString()
                : undefined,
            ],
            [
              "Gap To",
              item.gapTo
                ? new Date(item.gapTo).toLocaleDateString()
                : undefined,
            ],
            ["Reason", item.reason],
          ]);
        }
        if (i < (experience.timeline?.length ?? 0) - 1) divider();
      });
    }

    // Step 10 – Supporting Statement
    divider();
    sectionHeader("Step 10 – Supporting Statement");
    if (isEmpty(statement)) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(200, 140, 0);
      doc.text("⚠ Not submitted yet.", MARGIN, y);
      y += 8;
    } else {
      const text = statement.supporting_statement || "—";
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...VALUE_COL);
      const lines = doc.splitTextToSize(text, PAGE_W - MARGIN * 2);
      checkPageBreak(lines.length * 5 + 4);
      doc.text(lines, MARGIN, y);
      y += lines.length * 5 + 6;
    }

    // Step 11 – Declaration
    divider();
    sectionHeader("Step 11 – Declaration");
    if (isEmpty(declaration)) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(200, 140, 0);
      doc.text("⚠ Not submitted yet.", MARGIN, y);
      y += 8;
    } else {
      fieldGrid([
        [
          "Declaration Confirmed",
          declaration.declaration_confirmed ? "Yes" : "No",
        ],
        ["Declaration Date", declaration.declaration_date],
        [
          "Signature",
          process.env.NEXT_PUBLIC_API_URL + declaration.signature_file ||
            "Not uploaded",
        ],
      ]);
    }
  }


 // Page numbers
const pageCount = doc.internal.pages.length - 1;

for (let p = 1; p <= pageCount; p++) {
  doc.setPage(p);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(160, 160, 180);

  doc.text(`Page ${p} of ${pageCount}`, PAGE_W - MARGIN, 291, {
    align: "right",
  });
}

  const filename = `${(basic.full_name || "applicant").replace(/\s+/g, "_")}_application.pdf`;
  const pdfBuffer = doc.output("arraybuffer");
  return Buffer.from(pdfBuffer);
}