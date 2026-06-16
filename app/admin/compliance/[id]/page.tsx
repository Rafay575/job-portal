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
import Image from "next/image";

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
const convertToInputDate = (date: string) => {
  if (!date) return "";

  const [day, month, year] = date.split("-");

  return `${year}-${month}-${day}`;
};
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

  // ── Constants ────────────────────────────────────────────────────────────
  const PAGE_W = 210;
  const PAGE_H = 297;
  const MARGIN = 14;
  const MAX_Y = 268; // leave room for footer
  const CONTENT_W = PAGE_W - MARGIN * 2;
  const COL_W = CONTENT_W / 2;

  // ── Colours (Recruitment Ally style) ────────────────────────────────────
  // Steel-blue table header: approx #4472C4
  const HEADER_BG: [number, number, number] = [92, 73, 216];
  const HEADER_TXT: [number, number, number] = [255, 255, 255];
  // Section heading underline colour — same blue
  const SECTION_COL: [number, number, number] = [92, 73, 216];
  // Label in two-col tables (left cell background)
  const LABEL_BG: [number, number, number] = [92, 73, 216];
  const LABEL_TXT: [number, number, number] = [255, 255, 255];
  // Value cell
  const VALUE_BG: [number, number, number] = [255, 255, 255];
  const VALUE_TXT: [number, number, number] = [30, 30, 30];
  // Table border
  const BORDER: [number, number, number] = [180, 190, 210];
  // Footer red
  const FOOTER_RED: [number, number, number] = [92, 73, 216];

  let y = 0;

  const capitalize = (str: string) => {
    if (!str) return "—";
    return str
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  };

  // ── Page header (logo left, company name right) ──────────────────────────
  function drawPageHeader() {
    // Logo top-right (matching Application Pack Form style)
    const logoW = 38;
    const logoH = 13;
    doc.addImage(logoBase64, "PNG", PAGE_W - MARGIN - logoW, 6, logoW, logoH);
  }

  // ── Page footer ──────────────────────────────────────────────────────────
  function drawPageFooter(pageNum: number, totalPages: number) {
    // Red bold company name centered
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...FOOTER_RED);
    doc.text("Hayaibu Talent", PAGE_W / 2, PAGE_H - 8, { align: "center" });

    // Page number right
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 170);
    doc.text(`Page ${pageNum} of ${totalPages}`, PAGE_W - MARGIN, PAGE_H - 8, {
      align: "right",
    });
  }

  // ── Section heading (underlined, blue) ───────────────────────────────────
  function sectionHeader(title: string) {
    y += 10;
    checkPageBreak(14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...SECTION_COL);
    doc.text(title, MARGIN, y);

    // Underline
    const tw = doc.getTextWidth(title);
    doc.setDrawColor(...SECTION_COL);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, y + 1, MARGIN + tw, y + 1);

    y += 5;
  }

  // ── Sub-header (smaller, blue, bold) ─────────────────────────────────────
  function subHeader(title: string) {
    y += 7;
    checkPageBreak(10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...SECTION_COL);
    doc.text(title, MARGIN, y);
    y += 3;
  }

  // ── Page break check ─────────────────────────────────────────────────────
  function checkPageBreak(needed = 12) {
    if (y + needed > MAX_Y) {
      doc.addPage();
      drawPageHeader();
      y = 28;
    }
  }

  // ── Two-column label/value row (like Employment History table) ────────────
  // Left cell = dark blue label, right cell = white value
  function tableRow(
    label: string,
    value: string | undefined | null,
    rowH = 8,
    url?: string,
  ) {
    const val = value || "—";
    const labelW = 55;
    const valueW = CONTENT_W - labelW;

    // Wrap value text
    const valLines = doc.splitTextToSize(val, valueW - 4);
    const neededH = Math.max(rowH, valLines.length * 5 + 4);

    checkPageBreak(neededH + 2);

    // Label cell (blue bg)
    doc.setFillColor(...LABEL_BG);
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.3);
    doc.rect(MARGIN, y, labelW, neededH, "FD");

    // Value cell (white bg)
    doc.setFillColor(...VALUE_BG);
    doc.rect(MARGIN + labelW, y, valueW, neededH, "FD");

    // Label text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...LABEL_TXT);
    doc.text(label, MARGIN + 2, y + neededH / 2 + 1.5);

    // Value text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...VALUE_TXT);
    doc.text(valLines, MARGIN + labelW + 2, y + 5);

    if (url) {
      const linkText = "View File";
      const x = MARGIN + labelW + 2;
      const textY = y + 5;

      // Blue text
      doc.setTextColor(0, 0, 255);

      // Underline
      const textWidth = doc.getTextWidth(linkText);
      doc.line(x, textY + 0.5, x + textWidth, textY + 0.5);

      // Clickable link
      doc.link(x, textY - 4, textWidth, 5, {
        url,
      });

      // Restore text color
      doc.setTextColor(...VALUE_TXT);
    }

    y += neededH;
  }

  // ── Not submitted notice ──────────────────────────────────────────────────
  function notSubmitted() {
    checkPageBreak(8);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(200, 140, 0);
    doc.text("⚠  This section has not been submitted yet.", MARGIN, y);
    y += 8;
  }

  // ═════════════════════════════════════════════════════════════════════════
  // ── PAGE 1: Cover Page ──────────────────────────────────────────────────
  // ═════════════════════════════════════════════════════════════════════════

  // White background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");

  // Logo centered
  const logoW = 60;
  const logoH = 20;
  doc.addImage(logoBase64, "PNG", (PAGE_W - logoW) / 2, 20, logoW, logoH);

  // Accent line
  doc.setDrawColor(...SECTION_COL);
  doc.setLineWidth(1);
  doc.line(PAGE_W / 2 - 25, 44, PAGE_W / 2 + 25, 44);

  // "Application Pack Form" title on cover//
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...SECTION_COL);
  doc.text("Application Pack Form", PAGE_W / 2, 58, { align: "center" });

  // Applicant summary fields
  const coverFields = [
    { label: "Name", value: capitalize(basic?.full_name) || "—" },
    { label: "Email", value: basic?.email || "—" },
    { label: "Phone", value: basic?.phone || "—" },
    { label: "Address", value: basic?.address || "—" },
    {
      label: "Type",
      value:
        basic?.type === "permanent"
          ? "Permanent"
          : basic?.type === "agency-work"
            ? "Agency Work"
            : basic?.type === "both"
              ? "Both"
              : "—",
    },
  ];

  let cy = 72;
  coverFields.forEach(({ label, value }) => {
    // Label
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 140);
    doc.text(label.toUpperCase(), MARGIN + 10, cy);

    // Value
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 60);
    const lines = doc.splitTextToSize(String(value), PAGE_W - 50);
    doc.text(lines, MARGIN + 10, cy + 6);
    cy += lines.length > 1 ? 10 + (lines.length - 1) * 4 : 10;

    // Divider
    doc.setDrawColor(210, 215, 230);
    doc.setLineWidth(0.3);
    doc.line(MARGIN + 10, cy, PAGE_W - MARGIN - 10, cy);
    cy += 7;
  });

  // Cover footer
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...FOOTER_RED);
  doc.text("Hayaibu Talent", PAGE_W / 2, PAGE_H - 8, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 170);
  doc.text(
    `Generated on ${new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}`,
    PAGE_W / 2,
    PAGE_H - 14,
    { align: "center" },
  );

  // ═════════════════════════════════════════════════════════════════════════
  // ── Step Pages ──────────────────────────────────────────────────────────
  // ═════════════════════════════════════════════════════════════════════════

  doc.addPage();
  drawPageHeader();
  y = 28;

  // ── Step 1 – Personal Info ───────────────────────────────────────────────
  sectionHeader("Step 1 – Personal Information");
  tableRow("Full Name", basic?.full_name);
  tableRow("Email", basic?.email);
  tableRow("Phone", basic?.phone);
  tableRow("Address", basic?.address);
  tableRow("Postcode", basic?.postcode);
  tableRow("Nationality", basic?.nationality);
  tableRow("Immigration Status", basic?.immigration_status);
  tableRow("Immigration Expiry", convertToInputDate(basic?.immigration_expiry));
  tableRow("Work Permit", basic?.work_permit ? "Yes" : "No");
  tableRow("Name Changed", basic?.name_changed ? "Yes" : "No");
  if (basic?.name_changed) {
    tableRow("Previous Name", basic?.previous_name);
    tableRow("Changed To", basic?.changed_to);
  }
  // if (basic?.type !== "agency-work") {
  //   tableRow(
  //     "CV",
  //     basic?.cv_file_path
  //       ? process.env.NEXT_PUBLIC_API_URL + basic.cv_file_path
  //       : "Not uploaded",
  //   );
  // }
  if (basic?.type !== "agency-work") {
    const cvUrl = basic?.cv_file_path
      ? `${process.env.NEXT_PUBLIC_API_URL}${basic.cv_file_path}`
      : null;
    tableRow("CV", cvUrl ? "View CV" : "Not uploaded", 8, cvUrl || undefined);
  }

  if (!isPermanent) {
    // ── Step 2 – Pre-Qualifying ────────────────────────────────────────────
    y += 4;

    sectionHeader("Step 2 – Pre-Qualifying Questions");
    if (isEmpty(questions)) {
      notSubmitted();
    } else {
      tableRow(
        "Availability Issue",
        questions.availability_issue ? "Yes" : "No",
      );
      tableRow("Work Restrictions", questions.work_restrictions ? "Yes" : "No");
      if (questions.work_restrictions) {
        tableRow("Restriction Details", questions.restriction_details);
      }
      tableRow("Overtime", questions.overtime ? "Yes" : "No");
      tableRow("Hours to Avoid", questions.hours_avoid);
      tableRow("Notice Period", questions.notice_period);
      tableRow("Worked Before", questions.worked_before ? "Yes" : "No");
      tableRow("Applied Before", questions.applied_before ? "Yes" : "No");
      if (questions.applied_before) {
        tableRow("Applied Details", questions.applied_details);
      }
    }

    // ── Step 3 – Criminal & Compliance ────────────────────────────────────
    y += 4;

    sectionHeader("Step 3 – Criminal & Compliance");
    if (isEmpty(background)) {
      notSubmitted();
    } else {
      tableRow("Any Convictions", background.has_convictions ? "Yes" : "No");
      if (background.has_convictions) {
        tableRow("Conviction Details", background.conviction_details);
      }
      tableRow(
        "Unspent Convictions",
        background.has_unspent_convictions ? "Yes" : "No",
      );
      if (background.has_unspent_convictions) {
        tableRow("Unspent Details", background.unspent_details);
      }
      tableRow(
        "Fitness Investigation",
        background.fitness_investigation ? "Yes" : "No",
      );
      tableRow(
        "Removed From Register",
        background.removed_from_register ? "Yes" : "No",
      );
      tableRow("DBS/CRB Check", background.crb ? "Yes" : "No");
      if (background.crb) {
        tableRow("Certificate Number", background.certificate_number);
        tableRow("Full Name", background.full_name);
        tableRow("Surname", background.surname);
        tableRow("Date of Birth", convertToInputDate(background.dob));
        // tableRow(
        //   "DBS/CRB File",
        //   background.crb_file_path
        //     ? process.env.NEXT_PUBLIC_API_URL + background.crb_file_path
        //     : "Not uploaded",
        // );

        const DBSFileUrl = background.crb_file_path
          ? process.env.NEXT_PUBLIC_API_URL + background.crb_file_path
          : null;
        tableRow(
          "DBS/CRB File",
          DBSFileUrl ? "View File" : "Not uploaded",
          8,
          DBSFileUrl || undefined,
        );
      }
    }

    // ── Step 4 – Health ────────────────────────────────────────────────────
    y += 4;

    sectionHeader("Step 4 – Health Information");
    if (isEmpty(health)) {
      notSubmitted();
    } else {
      tableRow("Sick Leaves (last 3 years)", health.absent_days);
      tableRow("On Medication", health.on_medication ? "Yes" : "No");
      if (health.on_medication) {
        tableRow("Medication Details", health.medication_details);
      }
      tableRow("Health Treatment", health.health_treatment ? "Yes" : "No");
      if (health.health_treatment) {
        tableRow("Treatment Details", health.treatment_details);
      }
      tableRow("Medical Condition", health.medical_condition ? "Yes" : "No");
      if (health.medical_condition) {
        tableRow("Condition Details", health.condition_details);
      }
      tableRow("Disabled", health.disabled ? "Yes" : "No");
      if (health.disabled) {
        tableRow("Impairment Type", health.impairment_type);
      }
      tableRow("Fit for Night Shift", health.night_shift_fit ? "Yes" : "No");
    }

    // ── Step 5 – Professional Registration ───────────────────────────────
    y += 4;

    sectionHeader("Step 5 – Professional Registration");
    if (isEmpty(registration)) {
      notSubmitted();
    } else {
      tableRow("Is Nurse", registration.is_nurse ? "Yes" : "No");
      if (registration.is_nurse) {
        tableRow("Professional Body", registration.professional_body);
        tableRow("Registration Type", registration.registration_type);
        tableRow("Registration Number", registration.registration_number);
        tableRow(
          "Registration Expiry",
          convertToInputDate(registration.registration_expiry),
        );
      }
    }

    // ── Step 6 – Documents ───────────────────────────────────────────────
    y += 4;

    sectionHeader("Step 6 – Documents");
    if (isEmpty(documents)) {
      notSubmitted();
    } else {
      // tableRow(
      //   "Passport",
      //   documents.passport
      //     ? process.env.NEXT_PUBLIC_API_URL + documents.passport
      //     : "Not uploaded",
      // );

      const passport = documents.passport
        ? process.env.NEXT_PUBLIC_API_URL + documents.passport
        : null;
      tableRow(
        "Passport",
        passport ? "View File" : "Not uploaded",
        8,
        passport || undefined,
      );

      // tableRow(
      //   "Driving Licence (Front)",
      //   documents.driving_licence_front
      //     ? process.env.NEXT_PUBLIC_API_URL + documents.driving_licence_front
      //     : "Not uploaded",
      // );

      const driving_licence_front = documents.driving_licence_front
        ? process.env.NEXT_PUBLIC_API_URL + documents.driving_licence_front
        : null;
      tableRow(
        "Driving Licence (Front)",
        driving_licence_front ? "View File" : "Not uploaded",
        8,
        driving_licence_front || undefined,
      );

      // tableRow(
      //   "Driving Licence (Back)",
      //   documents.driving_licence_back
      //     ? process.env.NEXT_PUBLIC_API_URL + documents.driving_licence_back
      //     : "Not uploaded",
      // );

      const driving_licence_back = documents.driving_licence_back
        ? process.env.NEXT_PUBLIC_API_URL + documents.driving_licence_back
        : null;
      tableRow(
        "Driving Licence (Back)",
        driving_licence_back ? "View File" : "Not uploaded",
        8,
        driving_licence_back || undefined,
      );

      // tableRow(
      //   "Proof ID 1",
      //   documents.proof_id1
      //     ? process.env.NEXT_PUBLIC_API_URL + documents.proof_id1
      //     : "Not uploaded",
      // );

      const proof_id1 = documents.proof_id1
        ? process.env.NEXT_PUBLIC_API_URL + documents.proof_id1
        : null;
      tableRow(
        "Proof ID 1",
        proof_id1 ? "View File" : "Not uploaded",
        8,
        proof_id1 || undefined,
      );

      // tableRow(
      //   "Proof ID 2",
      //   documents.proof_id2
      //     ? process.env.NEXT_PUBLIC_API_URL + documents.proof_id2
      //     : "Not uploaded",
      // );

      const proof_id2 = documents.proof_id2
        ? process.env.NEXT_PUBLIC_API_URL + documents.proof_id2
        : null;
      tableRow(
        "Proof ID 2",
        proof_id2 ? "View File" : "Not uploaded",
        8,
        proof_id2 || undefined,
      );
    }

    // ── Step 7 – Training ─────────────────────────────────────────────────
    y += 4;

    sectionHeader("Step 7 – Training Courses Attended");

    if (isEmpty(trainings)) {
      notSubmitted();
    } else {
      trainings.forEach((item: any, i: number) => {
        subHeader(`Training ${i + 1}`);

        tableRow("Course Title", item.title);
        tableRow("Training Provider", item.provider);
        tableRow("Duration", item.duration);
        tableRow("Date Completion", convertToInputDate(item.completion_date));
        // tableRow(
        //   "Certificate",
        //   item.certificate_file_path
        //     ? `${process.env.NEXT_PUBLIC_API_URL}${item.certificate_file_path}`
        //     : "Not uploaded",
        // );

        const certificate_file_path = item.certificate_file_path
          ? `${process.env.NEXT_PUBLIC_API_URL}${item.certificate_file_path}`
          : null;
        tableRow(
          "Certificate",
          certificate_file_path ? "View File" : "Not uploaded",
          8,
          certificate_file_path || undefined,
        );
      });
    }

    // ── Step 8 – Education & Gaps ─────────────────────────────────────────
    y += 4;

    sectionHeader("Step 8 – Education & Gaps");
    if (isEmpty(educations)) {
      notSubmitted();
    } else {
      educations.forEach((item: any, i: number) => {
        if (item.kind === "education") {
          subHeader(`Education`);
          tableRow("Qualification Type", item.qualificationType);
          tableRow("Title", item.qualificationTitle);
          tableRow("Institution", item.institutionName);
          tableRow("Country", item.institutionCountry);
          tableRow("Awarding Body", item.awardingBody);
          tableRow("Grade", item.gradeOrResult);
          tableRow("Start Date", convertToInputDate(item.startDate));
          tableRow("End Date", convertToInputDate(item.endDate));
          tableRow("Completed", item.completed);
          tableRow(
            "Professional Registration",
            item.hasProfessionalRegistration,
          );
          if (item.hasProfessionalRegistration === "yes") {
            tableRow("Registration Body", item.registrationBody);
            tableRow("Registration Number", item.registrationNumber);
            tableRow(
              "Registration Expiry",
              convertToInputDate(item.registrationExpiry),
            );
          }

          // tableRow(
          //   "Certificate",
          //   item.certificateFile
          //     ? `${process.env.NEXT_PUBLIC_API_URL}${item.certificateFile}`
          //     : "Not uploaded",
          // );

          const certificateFile = item.certificateFile
            ? `${process.env.NEXT_PUBLIC_API_URL}${item.certificateFile}`
            : null;
          tableRow(
            "Certificate",
            certificateFile ? "View File" : "Not uploaded",
            8,
            certificateFile || undefined,
          );

          tableRow("Additional Notes", item.additionalNotes);
        } else {
          subHeader(`Gap`);
          tableRow("Gap From", convertToInputDate(item.gapFrom));
          tableRow("Gap To", convertToInputDate(item.gapTo));
          tableRow("Reason", item.reason);
        }
      });
    }

    // ── Step 9 – Experience ───────────────────────────────────────────────
    y += 4;

    sectionHeader("Step 9 – Employment History & Experience");
    if (isEmpty(experience)) {
      notSubmitted();
    } else {
      y += 2;
      // Experience areas
      if (experience.areas?.length) {
        checkPageBreak(14);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...SECTION_COL);
        doc.text("Experience Areas:", MARGIN, y);
        y += 5;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...VALUE_TXT);
        const areasText = experience.areas.join(", ");
        const wrapped = doc.splitTextToSize(areasText, CONTENT_W);
        checkPageBreak(wrapped.length * 5 + 4);
        doc.text(wrapped, MARGIN, y);
        y += wrapped.length * 5 + 6;
      }

      experience.timeline?.forEach((item: any, i: number) => {
        if (item.kind === "experience") {
          subHeader(`Employment`);
          // Two-col employment table (like the reference PDF)
          tableRow("Employer Name", item.employerName);
          tableRow("Job Title", item.jobTitle);
          tableRow(
            "Start Date",
            item.dateFrom
              ? convertToInputDate(item.dateFrom)
              : "—",
          );
          tableRow(
            "End Date",
            item.dateTo
              ? convertToInputDate(item.dateTo)
              : "—",
          );
          tableRow("Description of Duties", item.duties);
        } else {
          subHeader(`Gap`);
          tableRow(
            "Gap From",
            item.gapFrom
              ? convertToInputDate(item.gapFrom)
              : "—",
          );
          tableRow(
            "Gap To",
            item.gapTo
              ? convertToInputDate(item.gapTo)
              : "—",
          );
          tableRow("Reason", item.reason);
        }
        if (i < (experience.timeline?.length ?? 0) - 1) {
          y += 3;
        }
      });
    }

    // ── Step 10 – Supporting Statement ───────────────────────────────────
    y += 4;

    sectionHeader("Step 10 – Supporting Information");
    if (isEmpty(statement)) {
      notSubmitted();
    } else {
      checkPageBreak(14);
      y += 2;
      const text = statement.supporting_statement || "—";
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...VALUE_TXT);
      const lines = doc.splitTextToSize(text, CONTENT_W);
      checkPageBreak(lines.length * 5 + 4);
      doc.text(lines, MARGIN, y);
      y += lines.length * 5 + 6;
    }

    // ── Step 11 – Declaration ─────────────────────────────────────────────
    y += 4;

    sectionHeader("Step 11 – Declaration");

    if (isEmpty(declaration)) {
      notSubmitted();
    } else {
      checkPageBreak(20);
      y += 2;

      const sigBase64 = declaration.signature_file
        ? await getBase64FromUrl(
            process.env.NEXT_PUBLIC_API_URL + declaration.signature_file,
          )
        : null;


      // NAME
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...VALUE_TXT);

      doc.text(`Name: ${basic?.full_name || ""}`, MARGIN, y);

      y += 6;

      // DATE
      doc.text(
        `Date: ${convertToInputDate(declaration.declaration_date) || ""}`,
        MARGIN,
        y,
      );

      y += 8;

      // SIGNATURE IMAGE
      if (sigBase64) {
        const imgWidth = 40; // adjust as needed
        const imgHeight = 18; // adjust as needed

        checkPageBreak(imgHeight + 5);
        doc.text(`Signature:`, MARGIN, y);
        y += 3;
        doc.addImage(sigBase64, "PNG", MARGIN, y, imgWidth, imgHeight);

        y += imgHeight + 6;
      } else {
        doc.text("No signature provided", MARGIN, y);
        y += 6;
      }
    }
  }

  // ── Stamp headers & footers on every page ─────────────────────────────────
  const pageCount = doc.internal.pages.length - 1;
  for (let p = 2; p <= pageCount; p++) {
    // cover page (p=1) already has its own footer
    doc.setPage(p);
    drawPageFooter(p, pageCount);
  }
  // Fix cover page footer page number
  doc.setPage(1);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 170);
  doc.text(`Page 1 of ${pageCount}`, PAGE_W - MARGIN, PAGE_H - 8, {
    align: "right",
  });

  const filename = `${(basic?.full_name || "applicant").replace(/\s+/g, "_")}_application.pdf`;
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
  console.log("User data:", user.experience.timeline);
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
              <Info
                label="Expiry"
                value={convertToInputDate(basic.immigration_expiry)}
              />
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
                <Info
                  label="DBS/CRB Check"
                  value={background.crb ? "Yes" : "No"}
                />
                {Boolean(background.crb) && (
                  <>
                    {/* NEW FIELDS - Added before Surname */}
                    <Info
                      label="Certificate Number"
                      value={background.certificate_number}
                    />
                    <Info label="Full Name" value={background.full_name} />
                    <Info label="Surname" value={background.surname} />
                    <Info
                      label="Date of Birth"
                      value={convertToInputDate(background.dob)}
                    />
                    <Info
                      label="DBS/CRB File"
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
                  label="Sick Leaves in last 3 years"
                  value={health.absent_days}
                />
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
                      value={convertToInputDate(
                        registration.registration_expiry,
                      )}
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
                  label="Driving Licence (Front)"
                  value={<FileLink path={documents.driving_licence_front} />}
                />
                <Info
                  label="Driving Licence (Back)"
                  value={<FileLink path={documents.driving_licence_back} />}
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
                      value={convertToInputDate(item.completion_date)}
                    />
                    <Info
                      label="Training Certificate"
                      value={<FileLink path={item.certificate_file_path} />}
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
                        <Info
                          label="Start Date"
                          value={convertToInputDate(item.startDate)}
                        />
                        <Info
                          label="End Date"
                          value={convertToInputDate(item.endDate)}
                        />
                        <Info label="Completed" value={item.completed} />
                        <Info
                          label="Professional Registration"
                          value={item.hasProfessionalRegistration}
                        />
                        {Boolean(item.hasProfessionalRegistration == "yes") && (
                          <>
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
                              value={convertToInputDate(
                                item.registrationExpiry,
                              )}
                            />
                          </>
                        )}
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
                        <Info
                          label="Gap From"
                          value={convertToInputDate(item.gapFrom)}
                        />
                        <Info
                          label="Gap To"
                          value={convertToInputDate(item.gapTo)}
                        />
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
                                    ? 
                                        convertToInputDate(item.dateFrom)
                                    : undefined
                                }
                              />
                              <Info
                                label="To"
                                value={
                                  item.dateTo
                                    ? 
                                        convertToInputDate(item.dateTo)
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
                                    ?
                                        convertToInputDate(item.gapFrom)
                                    : undefined
                                }
                              />
                              <Info
                                label="Gap To"
                                value={
                                  item.gapTo
                                    ?
                                        convertToInputDate(item.gapTo)
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
                  value={convertToInputDate(declaration.declaration_date)}
                />

                <Info
                  label="Signature File"
                  value={
                    <Image
                      src={declaration.signature_file}
                      alt="Signature"
                      width={400}
                      height={200}
                      className="border rounded-md w-[40%] p-2 mt-1  object-contain"
                    />
                  }
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
