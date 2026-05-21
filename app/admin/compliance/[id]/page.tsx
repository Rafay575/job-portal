"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStep1 } from "@/lib/api/step1";
import { getStep2 } from "@/lib/api/step2";
import { getStep3 } from "@/lib/api/step3";
import { getStep4 } from "@/lib/api/step4";
import { getStep5 } from "@/lib/api/step5";
import { getStep6 } from "@/lib/api/step6";
import { getTrainings } from "@/lib/api/step7";
import { getTimeline } from "@/lib/api/step8";
import { getStep9 } from "@/lib/api/step9";
import { getStep10 } from "@/lib/api/step10";
import { getStep11 } from "@/lib/api/step11";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import jsPDF from "jspdf";
import {
  approveUser,
  checkApproval,
  deleteUser,
  rejectUser,
} from "@/lib/users";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { FullPageLoader } from "@/components/Loading";
import { boolean } from "zod";
import { Trash2 } from "lucide-react";
import { FiCheck } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";

// ── helpers ──────────────────────────────────────────────────────────────────

function isEmpty(val: any): boolean {
  if (!val) return true;
  if (Array.isArray(val)) return val.length === 0;
  if (typeof val === "object") return Object.keys(val).length === 0;
  return false;
}

function FileLink({ path }: { path?: string }) {
  if (!path) return <span className="text-gray-400">Not uploaded</span>;
  return (
    <a
      href={path}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block px-3 py-1 bg-primary text-white rounded text-xs"
    >
      View
    </a>
  );
}
function NotSubmitted() {
  return (
    <p className="text-sm text-amber-500 italic">
      ⚠ This section has not been submitted yet.
    </p>
  );
}

async function safeFetch<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    const res = await fn();
    return res ?? fallback;
  } catch {
    return fallback;
  }
}

// ── PDF Generator ─────────────────────────────────────────────────────────────
// Add this utility above generatePDF
async function getBase64FromUrl(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

async function generatePDF(user: any) {
  const logoBase64 = await getBase64FromUrl("/logo.png");
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

  const isPermanent = basic?.type === "permanent";
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
  const capitalize = (str: string) => {
    if (!str) return "—";

    return str
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };
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
        value: capitalize(basic.full_name) || "—",
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
    doc.setDrawColor(96, 77, 227);
    doc.setLineWidth(0.6);
    doc.line(MARGIN, y, MARGIN, y + 10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(96, 77, 227);
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
    doc.setTextColor(96, 77, 227);
    doc.text(title, MARGIN, y);
    y += 5;
  }

  // ── Build PDF ─────────────────────────────────────────────────────────────

  drawCoverPage();

  // Step 1 – Personal Info (always shown)
  sectionHeader("Step 1 – Personal Info");
  fieldGrid([
    ["Full Name", basic.full_name],
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
  doc.save(filename);
}

// ── page ─────────────────────────────────────────────────────────────────────

export default function UserDetailPage() {
  const params = useParams();
  const user_id = params?.id as string | undefined;
  const [isApproved, setIsApproved] = useState<boolean | null>(null);
  const [status, setStatus] = useState<
    "pending" | "approved" | "rejected" | null
  >(null);

  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [user, setUser] = useState<any>({
    basic: {},
    questions: {},
    background: {},
    health: {},
    registration: {},
    documents: {},
    trainings: [],
    educations: [],
    experience: {},
    statement: {},
    declaration: {},
  });
  const fetchApproval = async () => {
    setLoading(true);
    const { status, isApproved } = await checkApproval(user_id);
    setIsApproved(isApproved);
    setStatus(status);
    setLoading(false);
  };

  useEffect(() => {
    if (!user_id) return;
    fetchApproval();
    const fetchData = async () => {
      setLoading(true);
      const step1 = await safeFetch(() => getStep1(user_id), {
        success: false,
        data: [],
      });
      const isPermanent = step1?.data?.[0]?.type === "permanent";
      const [
        step2,
        step3,
        step4,
        step5,
        step6,
        step7,
        step8,
        step9,
        step10,
        step11,
      ] = isPermanent
        ? Array(10).fill(null)
        : await Promise.all([
            safeFetch(() => getStep2(user_id), { success: false, data: [] }),
            safeFetch(() => getStep3(user_id), { success: false, data: [] }),
            safeFetch(() => getStep4(user_id), { success: false, data: [] }),
            safeFetch(() => getStep5(user_id), { success: false, data: [] }),
            safeFetch(() => getStep6(user_id), { success: false, data: [] }),
            safeFetch(() => getTrainings(user_id), {
              success: false,
              data: [],
            }),
            safeFetch(() => getTimeline(user_id), []),
            safeFetch(() => getStep9(user_id), { areas: [], timeline: [] }),
            safeFetch(() => getStep10(user_id), { success: false, data: [] }),
            safeFetch(() => getStep11(user_id), { success: false, data: [] }),
          ]);
      setUser({
        basic: step1?.data?.[0] ?? {},
        questions: step2?.data?.[0] ?? {},
        background: step3?.data?.[0] ?? {},
        health: step4?.data?.[0] ?? {},
        registration: step5?.data?.[0] ?? {},
        documents: step6?.data?.[0] ?? {},
        trainings: step7?.data ?? [],
        educations: Array.isArray(step8) ? step8 : [],
        experience: step9 ?? {},
        statement: step10?.data?.[0] ?? {},
        declaration: step11?.data?.[0] ?? {},
      });
      setLoading(false);
    };
    fetchData();
  }, [user_id]);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    await new Promise((r) => setTimeout(r, 50)); // let spinner render
    await generatePDF(user);
    setDownloading(false);
  };

  if (!user_id)
    return (
      <div className="p-6 text-red-500 font-medium">
        Invalid page — no user ID found in the URL.
      </div>
    );

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
  if (loading) return <FullPageLoader />;
  return (
    <div className="p-6 space-y-6">
      {/* ── Header + Download Button ─────────────────────────────────────── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center sm:gap-2 flex-wrap">
            <h1 className="text-2xl md:text-4xl font-bold text-primary capitalize">
              {basic.full_name || "Unknown Applicant"}
            </h1>
            <span className="text-white bg px-2 py-0.5 text-[11px] rounded-full">
              {basic.type}
            </span>
          </div>
          <p className="text-gray-500 text-[12px]! md:text-[15px]!">
            {basic.email || "No email provided"}
          </p>
        </div>

        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded shadow hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {downloading ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Generating…
            </>
          ) : (
            <>
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
                />
              </svg>
              Download PDF
            </>
          )}
        </button>
      </div>
      <ActionsButtons
        id={user_id}
        status={status}
        fetchApproval={fetchApproval}
        setStatus={setStatus}
        setLoading={setLoading}
      />

      {/* ── Step 1 – Personal Info ─────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Step 1 – Personal Info</CardTitle>
        </CardHeader>
        <CardContent>
          {isEmpty(basic) ? (
            <NotSubmitted />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Info label="Full Name" value={basic.full_name} />
              <Info label="Email" value={basic.email} />
              <Info label="Phone" value={basic.phone} />
              <Info label="Address" value={basic.address} />
              <Info label="Postcode" value={basic.postcode} />
              <Info label="Nationality" value={basic.nationality} />
              <Info label="Immigration" value={basic.immigration_status} />
              <Info label="Expiry" value={basic.immigration_expiry} />
              <Info
                label="Work Permit"
                value={basic.work_permit ? "Yes" : "No"}
              />
              <Info
                label="Name Changed"
                value={basic.name_changed ? "Yes" : "No"}
              />

              {Boolean(basic.name_changed) && (
                <Info label="Previous Name" value={basic.previous_name} />
              )}
              {Boolean(basic.name_changed) && (
                <Info label="Changed To" value={basic.changed_to} />
              )}

              {Boolean(basic.type !== "agency-work") && (
                <Info
                  label="CV"
                  value={<FileLink path={basic.cv_file_path} />}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Step 2 – Pre-Qualifying ────────────────────────────────────────── */}
      {basic.type !== "permanent" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">
              Step 2 – Pre-Qualifying
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEmpty(questions) ? (
              <NotSubmitted />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <Info
                  label="Availability Issue"
                  value={questions.availability_issue ? "Yes" : "No"}
                />
                <Info
                  label="Work Restrictions"
                  value={questions.work_restrictions ? "Yes" : "No"}
                />
                {Boolean(questions.work_restrictions) && (
                  <Info
                    label="Restriction Details"
                    value={questions.restriction_details}
                  />
                )}
                <Info
                  label="Overtime"
                  value={questions.overtime ? "Yes" : "No"}
                />
                <Info label="Hours to Avoid" value={questions.hours_avoid} />
                <Info label="Notice Period" value={questions.notice_period} />
                <Info
                  label="Worked Before"
                  value={questions.worked_before ? "Yes" : "No"}
                />
                <Info
                  label="Applied Before"
                  value={questions.applied_before ? "Yes" : "No"}
                />
                {Boolean(questions.applied_before) && (
                  <Info
                    label="Applied Details"
                    value={questions.applied_details}
                  />
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Step 3 – Criminal & Compliance ────────────────────────────────── */}
      {basic.type !== "permanent" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">
              Step 3 – Criminal & Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEmpty(background) ? (
              <NotSubmitted />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3  gap-4 text-sm">
                <Info
                  label="Any Convictions"
                  value={background.has_convictions ? "Yes" : "No"}
                />
                {Boolean(background.has_convictions) && (
                  <Info
                    label="Conviction Details"
                    value={background.conviction_details}
                  />
                )}

                <Info
                  label="Unspent Convictions"
                  value={background.has_unspent_convictions ? "Yes" : "No"}
                />
                {Boolean(background.has_unspent_convictions) && (
                  <Info
                    label="Unspent Details"
                    value={background.unspent_details}
                  />
                )}
                <Info
                  label="Fitness Investigation"
                  value={background.fitness_investigation ? "Yes" : "No"}
                />
                <Info
                  label="Removed From Register"
                  value={background.removed_from_register ? "Yes" : "No"}
                />
                <Info label="CRB Check" value={background.crb ? "Yes" : "No"} />
                {Boolean(background.crb) && (
                  <>
                    <Info label="Surname" value={background.surname} />
                    <Info label="Date of Birth" value={background.dob} />
                    <Info
                      label="CRB File"
                      value={<FileLink path={background.crb_file_path} />}
                    />
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Step 4 – Health Information ───────────────────────────────────── */}
      {basic.type !== "permanent" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">
              Step 4 – Health Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEmpty(health) ? (
              <NotSubmitted />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3  gap-4 text-sm">
                <Info label="Absent Days" value={health.absent_days} />
                <Info label="Absence Periods" value={health.absence_periods} />
                <Info
                  label="On Medication"
                  value={health.on_medication ? "Yes" : "No"}
                />
                {Boolean(health.on_medication) && (
                  <Info
                    label="Medication Details"
                    value={health.medication_details}
                  />
                )}
                <Info
                  label="Health Treatment"
                  value={health.health_treatment ? "Yes" : "No"}
                />
                {Boolean(health.health_treatment) && (
                  <Info
                    label="Treatment Details"
                    value={health.treatment_details}
                  />
                )}
                <Info
                  label="Medical Condition"
                  value={health.medical_condition ? "Yes" : "No"}
                />
                {Boolean(health.medical_condition) && (
                  <Info
                    label="Condition Details"
                    value={health.condition_details}
                  />
                )}
                <Info label="Disabled" value={health.disabled ? "Yes" : "No"} />
                {Boolean(health.disabled) && (
                  <Info
                    label="Impairment Type"
                    value={health.impairment_type}
                  />
                )}
                <Info
                  label="Fit for Night Shift"
                  value={health.night_shift_fit ? "Yes" : "No"}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Step 5 – Professional Registration ────────────────────────────── */}
      {basic.type !== "permanent" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">
              Step 5 – Professional Registration
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEmpty(registration) ? (
              <NotSubmitted />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3  gap-4 text-sm">
                <Info
                  label="Is Nurse"
                  value={registration.is_nurse ? "Yes" : "No"}
                />
                {Boolean(registration.is_nurse) && (
                  <>
                    <Info
                      label="Professional Body"
                      value={registration.professional_body}
                    />
                    <Info
                      label="Registration Type"
                      value={registration.registration_type}
                    />
                    <Info
                      label="Registration Number"
                      value={registration.registration_number}
                    />
                    <Info
                      label="Registration Expiry"
                      value={registration.registration_expiry}
                    />
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Step 6 – Documents ────────────────────────────────────────────── */}
      {basic.type !== "permanent" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Step 6 – Documents</CardTitle>
          </CardHeader>
          <CardContent>
            {isEmpty(documents) ? (
              <NotSubmitted />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3  gap-4">
                <Info
                  label="Passport"
                  value={<FileLink path={documents.passport} />}
                />
                <Info
                  label="Driving Licence"
                  value={<FileLink path={documents.driving_licence} />}
                />
                <Info
                  label="Proof ID 1"
                  value={<FileLink path={documents.proof_id1} />}
                />
                <Info
                  label="Proof ID 2"
                  value={<FileLink path={documents.proof_id2} />}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Step 7 – Training ─────────────────────────────────────────────── */}
      {basic.type !== "permanent" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Step 7 – Training</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEmpty(trainings) ? (
              <NotSubmitted />
            ) : (
              trainings.map((item: any, i: number) => (
                <div key={item.id ?? i} className="border p-4 rounded">
                  <div className="text-primary font-semibold mb-2">
                    Training {i + 1}
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3  gap-4">
                    <Info label="Course Title" value={item.title} />
                    <Info label="Provider" value={item.provider} />
                    <Info label="Duration" value={item.duration} />
                    <Info
                      label="Completion Date"
                      value={item.completion_date}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Step 8 – Education & Gaps ─────────────────────────────────────── */}
      {basic.type !== "permanent" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">
              Step 8 – Education & Gaps
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEmpty(educations) ? (
              <NotSubmitted />
            ) : (
              educations.map((item: any, i: number) => (
                <div key={item.id ?? i} className="border p-4 rounded">
                  {item.kind === "education" ? (
                    <>
                      <div className="text-primary font-semibold mb-2">
                        Education
                      </div>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3  gap-4">
                        <Info
                          label="Qualification Type"
                          value={item.qualificationType}
                        />
                        <Info label="Title" value={item.qualificationTitle} />
                        <Info
                          label="Institution"
                          value={item.institutionName}
                        />
                        <Info label="Country" value={item.institutionCountry} />
                        <Info label="Awarding Body" value={item.awardingBody} />
                        <Info label="Grade" value={item.gradeOrResult} />
                        <Info label="Start Date" value={item.startDate} />
                        <Info label="End Date" value={item.endDate} />
                        <Info label="Completed" value={item.completed} />
                        <Info
                          label="Professional Registration"
                          value={item.hasProfessionalRegistration}
                        />
                        <Info
                          label="Registration Body"
                          value={item.registrationBody}
                        />
                        <Info
                          label="Registration Number"
                          value={item.registrationNumber}
                        />
                        <Info
                          label="Registration Expiry"
                          value={item.registrationExpiry}
                        />
                        <Info
                          label="Certificate File"
                          value={<FileLink path={item.certificateFile} />}
                        />
                        <Info
                          label="Additional Notes"
                          value={item.additionalNotes}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-primary font-semibold mb-2">Gap</div>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3  gap-4">
                        <Info label="Gap From" value={item.gapFrom} />
                        <Info label="Gap To" value={item.gapTo} />
                        <Info label="Reason" value={item.reason} />
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Step 9 – Experience ───────────────────────────────────────────── */}
      {basic.type !== "permanent" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Step 9 – Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isEmpty(experience) ? (
              <NotSubmitted />
            ) : (
              <>
                {/* Areas */}
                <div className="border p-4 rounded">
                  <div className="text-primary font-semibold mb-2">Areas</div>
                  <div className="flex flex-wrap gap-2">
                    {experience.areas?.length ? (
                      experience.areas.map((area: string, i: number) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-gray-200 rounded text-xs"
                        >
                          {area}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">
                        No areas added
                      </span>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  {experience.timeline?.length ? (
                    experience.timeline.map((item: any, i: number) => (
                      <div key={item.id ?? i} className="border p-4 rounded">
                        {item.kind === "experience" ? (
                          <>
                            <div className="text-primary font-semibold mb-2">
                              Experience
                            </div>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3  gap-4">
                              <Info
                                label="Employer"
                                value={item.employerName}
                              />
                              <Info label="Job Title" value={item.jobTitle} />
                              <Info
                                label="From"
                                value={
                                  item.dateFrom
                                    ? new Date(
                                        item.dateFrom,
                                      ).toLocaleDateString()
                                    : undefined
                                }
                              />
                              <Info
                                label="To"
                                value={
                                  item.dateTo
                                    ? new Date(item.dateTo).toLocaleDateString()
                                    : undefined
                                }
                              />
                              <Info label="Duties" value={item.duties} />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-primary font-semibold mb-2">
                              Gap
                            </div>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3  gap-4">
                              <Info
                                label="Gap From"
                                value={
                                  item.gapFrom
                                    ? new Date(
                                        item.gapFrom,
                                      ).toLocaleDateString()
                                    : undefined
                                }
                              />
                              <Info
                                label="Gap To"
                                value={
                                  item.gapTo
                                    ? new Date(item.gapTo).toLocaleDateString()
                                    : undefined
                                }
                              />
                              <Info label="Reason" value={item.reason} />
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">
                      No experience timeline found.
                    </p>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Step 10 – Supporting Statement ───────────────────────────────── */}
      {basic.type !== "permanent" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">
              Step 10 – Supporting Statement
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEmpty(statement) ? (
              <NotSubmitted />
            ) : (
              <p className="text-gray-600">
                {statement.supporting_statement || "—"}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Step 11 – Declaration ─────────────────────────────────────────── */}
      {basic.type !== "permanent" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">
              Step 11 – Declaration
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEmpty(declaration) ? (
              <NotSubmitted />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3  gap-4">
                <Info
                  label="Declaration Confirmed"
                  value={declaration.declaration_confirmed ? "Yes" : "No"}
                />
                <Info
                  label="Declaration Date"
                  value={declaration.declaration_date}
                />
                <Info
                  label="Signature File"
                  value={<FileLink path={declaration.signature_file} />}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="font-semibold text-gray-700 text-xs">{label}:</p>
      <p className="text-gray-500 font-medium ">{value ?? "—"}</p>
    </div>
  );
}
const ActionsButtons = ({
  id,
  status,
  setStatus,
  fetchApproval,
  setLoading,
}: {
  id: number | string;
  status: "pending" | "approved" | "rejected" | null;
  setStatus: React.Dispatch<
    React.SetStateAction<"pending" | "approved" | "rejected" | null>
  >;
  fetchApproval: () => void | Promise<void>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const handleApprove = async () => {
    toast.custom((t) => (
      <div className="bg-white shadow-lg rounded-lg p-4 border w-[280px]">
        <p className="text-sm font-medium mb-3">
          Are you sure you want to approve this user?
        </p>

        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 text-sm rounded bg-gray-200"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>

          <button
            className="px-3 py-1 text-sm rounded bg-primary text-white"
            onClick={async () => {
              toast.dismiss(t.id);

              setLoading(true);
              const res = await approveUser(id);

              if (res.success) {
                toast.success("User approved");
                fetchApproval();
              } else {
                toast.error(res.message);
              }

              setLoading(false);
            }}
          >
            Approve
          </button>
        </div>
      </div>
    ));
  };
  const handleReject = async () => {
    toast.custom((t) => (
      <div className="bg-white shadow-lg rounded-lg p-4 border w-[280px]">
        <p className="text-sm font-medium mb-3">
          Are you sure you want to reject this user?
        </p>

        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 text-sm rounded bg-gray-200"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>

          <button
            className="px-3 py-1 text-sm rounded bg-red-600 text-white"
            onClick={async () => {
              toast.dismiss(t.id);

              setLoading(true);
              const res = await rejectUser(id);

              if (res.success) {
                toast.success("User rejected");
                fetchApproval();
              } else {
                toast.error(res.message);
              }

              setLoading(false);
            }}
          >
            Reject
          </button>
        </div>
      </div>
    ));
  };
  const handleDelete = async () => {
    toast.custom((t) => (
      <div className="bg-white shadow-lg rounded-lg p-4 border w-[280px]">
        <p className="text-sm font-medium mb-3">
          Are you sure you want to delete this user?
        </p>

        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 text-sm rounded bg-gray-200"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>

          <button
            className="px-3 py-1 text-sm rounded bg-red-600 text-white"
            onClick={async () => {
              toast.dismiss(t.id);

              setLoading(true);

              const res = await deleteUser(id);

              if (res.success) {
                toast.success("User deleted");
                router.push("/admin/compliance");
              } else {
                toast.error(res.message);
              }

              setLoading(false);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="flex flex-col gap-2 items-start">
      {/* STATUS */}
      <div className="font-semibold text-md">
        Status:{" "}
        <span className="font-medium underline">
          {status === "approved"
            ? "Approved"
            : status === "rejected"
              ? "Rejected"
              : "Pending"}
        </span>
      </div>

      <div className="flex gap-2 flex-wrap">
        {/* APPROVE BUTTON */}
        {(status === "pending" || status === "rejected") && (
          <Button onClick={handleApprove}>
            <FiCheck className="w-4 h-4  text-white gap-2" />
            Approve User
          </Button>
        )}

        {/* REJECT BUTTON */}
        {(status === "pending" || status === "approved") && (
          <Button variant="destructive" onClick={handleReject}>
            <RxCross1 className="w-4 h-4  text-white" />
            Reject User
          </Button>
        )}
        <Button
          onClick={handleDelete}
          variant="destructive"
          className=" text-white "
        >
          <Trash2 className="w-4 h-4  text-white" />
          Delete User
        </Button>
      </div>
    </div>
  );
};
