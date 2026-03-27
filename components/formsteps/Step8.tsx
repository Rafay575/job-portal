"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Trash2, GraduationCap, CalendarOff, GripVertical } from "lucide-react";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { EducationEntry } from "@/types/Form";
import { GapEntry8 } from "@/types/Form";
import { Step8Type } from "@/types/Form";


// ─── Nav Buttons ──────────────────────────────────────────────────────────────

type NavProps = { onNext: () => void; onBack: () => void; disableBack?: boolean };

function SignupNavButtons({ onNext, onBack, disableBack }: NavProps) {
  return (
    <div className="flex gap-2 mt-3 justify-between">
      <Button type="button" variant="outline" onClick={onBack} disabled={disableBack} className="gap-2">
        <IoIosArrowBack />
        Back
      </Button>
      <Button type="button" onClick={onNext} className="gap-2">
        Next
        <IoIosArrowForward />
      </Button>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

let _id = 0;
const nextId = () => ++_id;

const qualificationTypes = [
  "GCSE / O-Level",
  "A-Level",
  "NVQ",
  "BTEC / Diploma",
  "Foundation Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "Other",
];

const emptyEducation = (): EducationEntry => ({
  kind: "education",
  id: nextId(),
  qualificationType: "",
  qualificationTitle: "",
  institutionName: "",
  institutionCountry: "United Kingdom",
  awardingBody: "",
  gradeOrResult: "",
  startDate: "",
  endDate: "",
  completed: "yes",
  additionalNotes: "",
  hasProfessionalRegistration: "no",
  registrationBody: "",
  registrationNumber: "",
  registrationExpiry: "",
  certificateFile: null,
});

const emptyGap = (): GapEntry8 => ({
  kind: "gap",
  id: nextId(),
  gapFrom: "",
  gapTo: "",
  reason: "",
});

// ─── Sortable Card ────────────────────────────────────────────────────────────

type CardProps = {
  entry: Step8Type;
  label: string;
  isDragOverlay?: boolean;
  onRemove: (id: number) => void;
  onUpdateEducation: (id: number, key: keyof Omit<EducationEntry, "kind" | "id">, value: any) => void;
  onUpdateGap: (id: number, key: keyof Omit<GapEntry8, "kind" | "id">, value: string) => void;
};

function SortableCard(props: CardProps) {
  const { entry, label, isDragOverlay, onRemove, onUpdateEducation, onUpdateGap } = props;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: entry.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={isDragOverlay ? undefined : style}
      className={`rounded-xl border p-4 ${
        entry.kind === "gap" ? "border-primary bg-amber-50/40" : "bg-white"
      } ${isDragOverlay ? "shadow-2xl rotate-1 scale-[1.02] opacity-95" : ""}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing touch-none p-1 rounded hover:bg-muted/60 text-muted-foreground"
            aria-label="Drag to reorder"
          >
            <GripVertical className="h-4 w-4" />
          </button>

          {entry.kind === "education" ? (
            <GraduationCap className="h-4 w-4 text-primary" />
          ) : (
            <CalendarOff className="h-4 w-4 text-primary" />
          )}

          <p className={`text-sm font-semibold ${entry.kind === "gap" ? "text-primary" : "text-primary"}`}>
            {label}
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={() => onRemove(entry.id)}
          className="gap-1 text-destructive hover:text-destructive h-8 px-2"
        >
          <Trash2 className="h-4 w-4" />
          Remove
        </Button>
      </div>

      {/* ── Education fields ── */}
      {entry.kind === "education" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Qualification Type */}
          <div>
            <Label className="text-sm">Qualification Type *</Label>
            <select
              value={entry.qualificationType}
              onChange={(e) => onUpdateEducation(entry.id, "qualificationType", e.target.value)}
              className="mt-2 w-full border rounded-xl p-2 text-sm bg-white"
            >
              <option value="">Select</option>
              {qualificationTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Qualification Title */}
          <div>
            <Label className="text-sm">Qualification Title / Subject *</Label>
            <Input
              className="mt-2"
              placeholder="e.g., BSc Computer Science"
              value={entry.qualificationTitle}
              onChange={(e) => onUpdateEducation(entry.id, "qualificationTitle", e.target.value)}
            />
          </div>

          {/* Institution Name */}
          <div>
            <Label className="text-sm">Institution Name *</Label>
            <Input
              className="mt-2"
              placeholder="e.g., University of Manchester"
              value={entry.institutionName}
              onChange={(e) => onUpdateEducation(entry.id, "institutionName", e.target.value)}
            />
          </div>

          {/* Institution Country */}
          <div>
            <Label className="text-sm">Institution Country *</Label>
            <Input
              className="mt-2"
              placeholder="e.g., United Kingdom"
              value={entry.institutionCountry}
              onChange={(e) => onUpdateEducation(entry.id, "institutionCountry", e.target.value)}
            />
          </div>

          {/* Awarding Body */}
          <div>
            <Label className="text-sm">Awarding Body *</Label>
            <Input
              className="mt-2"
              placeholder="e.g., Pearson / City & Guilds / University"
              value={entry.awardingBody}
              onChange={(e) => onUpdateEducation(entry.id, "awardingBody", e.target.value)}
            />
          </div>

          {/* Grade */}
          <div>
            <Label className="text-sm">Grade / Result *</Label>
            <Input
              className="mt-2"
              placeholder="e.g., 2:1 / Distinction / A*"
              value={entry.gradeOrResult}
              onChange={(e) => onUpdateEducation(entry.id, "gradeOrResult", e.target.value)}
            />
          </div>

          {/* Start / End Date */}
          <div>
            <Label className="text-sm">Start Date *</Label>
            <Input
              className="mt-2"
              type="date"
              value={entry.startDate}
              onChange={(e) => onUpdateEducation(entry.id, "startDate", e.target.value)}
            />
          </div>

          <div>
            <Label className="text-sm">End Date *</Label>
            <Input
              className="mt-2"
              type="date"
              value={entry.endDate}
              onChange={(e) => onUpdateEducation(entry.id, "endDate", e.target.value)}
            />
          </div>

          {/* Completed */}
          <div>
            <Label className="text-sm">Completed? *</Label>
            <div className="mt-2 flex gap-3">
              {(["yes", "no"] as const).map((v) => (
                <label key={v} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name={`completed-${entry.id}`}
                    checked={entry.completed === v}
                    onChange={() => onUpdateEducation(entry.id, "completed", v)}
                  />
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {/* Professional Registration */}
          <div>
            <Label className="text-sm">Professional Registration / Licence?</Label>
            <div className="mt-2 flex gap-3">
              {(["yes", "no"] as const).map((v) => (
                <label key={v} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name={`reg-${entry.id}`}
                    checked={entry.hasProfessionalRegistration === v}
                    onChange={() => onUpdateEducation(entry.id, "hasProfessionalRegistration", v)}
                  />
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {entry.hasProfessionalRegistration === "yes" && (
            <>
              <div>
                <Label className="text-sm">Registration Body *</Label>
                <Input
                  className="mt-2"
                  placeholder="e.g., NMC / HCPC / GMC"
                  value={entry.registrationBody}
                  onChange={(e) => onUpdateEducation(entry.id, "registrationBody", e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm">Registration Number *</Label>
                <Input
                  className="mt-2"
                  placeholder="e.g., PIN / Licence No"
                  value={entry.registrationNumber}
                  onChange={(e) => onUpdateEducation(entry.id, "registrationNumber", e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm">Registration Expiry *</Label>
                <Input
                  className="mt-2"
                  type="date"
                  value={entry.registrationExpiry}
                  onChange={(e) => onUpdateEducation(entry.id, "registrationExpiry", e.target.value)}
                />
              </div>
            </>
          )}

          {/* Certificate Upload */}
          <div className="md:col-span-2">
            <Label className="text-sm">Upload Certificate (optional)</Label>
            <div className="mt-2 border rounded-xl p-3">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  onUpdateEducation(entry.id, "certificateFile", file);
                }}
              />
              {entry.certificateFile && (
                <p className="text-xs text-muted-foreground mt-2">
                  Uploaded: {entry.certificateFile.name}
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <Label className="text-sm">Additional Notes (optional)</Label>
            <Textarea
              className="mt-2"
              placeholder="Any extra details about this qualification..."
              value={entry.additionalNotes}
              onChange={(e) => onUpdateEducation(entry.id, "additionalNotes", e.target.value)}
            />
          </div>
        </div>
      )}

      {/* ── Gap fields ── */}
      {entry.kind === "gap" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label className="text-sm">Gap From *</Label>
            <Input
              type="date"
              className="mt-2"
              value={entry.gapFrom}
              onChange={(e) => onUpdateGap(entry.id, "gapFrom", e.target.value)}
            />
          </div>
          <div>
            <Label className="text-sm">Gap To *</Label>
            <Input
              type="date"
              className="mt-2"
              value={entry.gapTo}
              onChange={(e) => onUpdateGap(entry.id, "gapTo", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <Label className="text-sm">Reason *</Label>
            <Textarea
              className="mt-2 min-h-[90px]"
              value={entry.reason}
              onChange={(e) => onUpdateGap(entry.id, "reason", e.target.value)}
              placeholder="e.g., travelling, caring for family, health recovery, gap year, etc."
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = { next: () => void; back: () => void };

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Step8({ next, back }: Props) {
  const [timeline, setTimeline] = useState<Step8Type[]>([]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // ── Add / Remove ────────────────────────────────────────────────────────────
  const addEducation = () =>
    setTimeline((prev) => [...prev, emptyEducation()]);

  const addGap = () =>
    setTimeline((prev) => [...prev, emptyGap()]);

  const removeEntry = (id: number) =>
    setTimeline((prev) => prev.filter((e) => e.id !== id));

  // ── Update ──────────────────────────────────────────────────────────────────
  const updateEducation = (
    id: number,
    key: keyof Omit<EducationEntry, "kind" | "id">,
    value: any,
  ) =>
    setTimeline((prev) =>
      prev.map((e) =>
        e.id === id && e.kind === "education" ? { ...e, [key]: value } : e
      )
    );

  const updateGap = (
    id: number,
    key: keyof Omit<GapEntry8, "kind" | "id">,
    value: string,
  ) =>
    setTimeline((prev) =>
      prev.map((e) =>
        e.id === id && e.kind === "gap" ? { ...e, [key]: value } : e
      )
    );

  // ── DnD ─────────────────────────────────────────────────────────────────────
  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;
    setTimeline((prev) => {
      const oldIndex = prev.findIndex((e) => e.id === active.id);
      const newIndex = prev.findIndex((e) => e.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  // ── Label ───────────────────────────────────────────────────────────────────
  const getLabel = (entry: Step8Type, tl: Step8Type[]) => {
    let count = 0;
    for (const e of tl) {
      if (e.kind === entry.kind) count++;
      if (e.id === entry.id) break;
    }
    return entry.kind === "education" ? `Education #${count}` : `Gap #${count}`;
  };

  // ── Validation ───────────────────────────────────────────────────────────────
  const validateStep = (): boolean => {
    const educations = timeline.filter((e): e is EducationEntry => e.kind === "education");

    if (educations.length === 0) {
      toast.error("Please add at least one education record");
      return false;
    }

    for (const entry of timeline) {
      const label = getLabel(entry, timeline);

      if (entry.kind === "education") {
        const {
          qualificationType, qualificationTitle, institutionName,
          institutionCountry, awardingBody, gradeOrResult, startDate, endDate,
          hasProfessionalRegistration, registrationBody, registrationNumber, registrationExpiry,
        } = entry;

        if (
          !qualificationType || !qualificationTitle.trim() || !institutionName.trim() ||
          !institutionCountry.trim() || !awardingBody.trim() || !gradeOrResult.trim() ||
          !startDate || !endDate
        ) {
          toast.error(`Please complete all required fields for ${label}`);
          return false;
        }

        if (new Date(startDate) > new Date(endDate)) {
          toast.error(`${label}: Start Date cannot be after End Date`);
          return false;
        }

        if (hasProfessionalRegistration === "yes") {
          if (!registrationBody.trim() || !registrationNumber.trim() || !registrationExpiry) {
            toast.error(`${label}: Please complete all registration details`);
            return false;
          }
        }
      }

      if (entry.kind === "gap") {
        const { gapFrom, gapTo, reason } = entry;
        const anyFilled = [gapFrom, gapTo, reason].some((v) => v.trim());
        if (!anyFilled) continue;

        if (!gapFrom || !gapTo || !reason.trim()) {
          toast.error(`Please complete all fields in ${label}`);
          return false;
        }
        if (new Date(gapFrom) > new Date(gapTo)) {
          toast.error(`${label}: "Gap From" cannot be after "Gap To"`);
          return false;
        }
      }
    }

    return true;
  };

  const activeEntry = activeId != null ? timeline.find((e) => e.id === activeId) ?? null : null;

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-w-full space-y-4 p-1 flex flex-col">

      {/* Header card */}
      <div className="rounded-2xl border bg-white p-5">
        <h2 className="text-lg font-semibold mb-1">Qualifications &amp; Education (UK)</h2>
        <p className="text-sm text-muted-foreground">
          Add your education history and any gaps between study periods. Drag the ⠿ handle to reorder entries.
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="outline" onClick={addEducation} className="gap-2 text-primary">
          <GraduationCap className="h-4 w-4" />
          + Add Education
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={addGap}
          className="gap-2 border-primary text-primary hover:bg-amber-50"
        >
          <CalendarOff className="h-4 w-4" />
          + Add Gap
        </Button>
      </div>

      {/* Timeline */}
      {timeline.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          No entries yet. Use the buttons above to add your education or any education gaps.
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={timeline.map((e) => e.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {timeline.map((entry) => (
                <SortableCard
                  key={entry.id}
                  entry={entry}
                  label={getLabel(entry, timeline)}
                  onRemove={removeEntry}
                  onUpdateEducation={updateEducation}
                  onUpdateGap={updateGap}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeEntry ? (
              <SortableCard
                entry={activeEntry}
                label={getLabel(activeEntry, timeline)}
                isDragOverlay
                onRemove={() => {}}
                onUpdateEducation={() => {}}
                onUpdateGap={() => {}}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      <SignupNavButtons
        onBack={back}
         onNext={() => {
          if (validateStep()) {
            console.log("Step8 Data:", timeline); // ✅ log here
            next();
          }
        }}
      />
    </div>
  );
}