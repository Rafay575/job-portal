import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Trash2, GraduationCap, CalendarOff } from "lucide-react";
import { EducationEntry } from "@/types/Form";
import { GapEntry8 } from "@/types/Form";
import { Step8Type } from "@/types/Form";
import { useEffect, useState } from "react";

// Updated import — using the new API module path
import { getTimeline, saveTimeline } from "@/lib/api/step8";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { FullPageLoader } from "../Loading";
import { useRouter } from "next/navigation";
import { checkApproval } from "@/lib/users";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { IoRefresh } from "react-icons/io5";
import Link from "next/link";
import { DocCard } from "../common/DocCard";

// ─── Nav Buttons ──────────────────────────────────────────────────────────────

type NavProps = {
  onNext: () => void;
  onBack: () => void;
  disableBack?: boolean;
};

function SignupNavButtons({ onNext, onBack, disableBack }: NavProps) {
  return (
    <div className="flex gap-2 mt-3 justify-between">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        disabled={disableBack}
        className="gap-2"
      >
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
  institutionCountry: "",
  awardingBody: "",
  gradeOrResult: "",
  startDate: "",
  endDate: "",
  completed: "no",
  additionalNotes: "",
  hasProfessionalRegistration: "no",
  registrationBody: "",
  registrationNumber: "",
  registrationExpiry: "",
  certificateFile: null, // ← existingCertificateFile removed
});

const emptyGap = (): GapEntry8 => ({
  kind: "gap",
  id: nextId(),
  gapFrom: "",
  gapTo: "",
  reason: "",
});
// ─── Gap Detection Helpers ─────────────────────────────────────────────────────

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const MIN_GAP_DAYS = 30;

const addDays = (dateStr: string, days: number): string => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

const diffInDays = (a: string, b: string): number => {
  return Math.round(
    (new Date(b).getTime() - new Date(a).getTime()) / MS_PER_DAY,
  );
};

const formatDisplayDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

type DetectedGap8 = { gapFrom: string; gapTo: string };


// ─── Improved Gap Detection (covers Education AND existing Gap cards) ────────

type CoveredInterval8 = { from: string; to: string };

// Merge overlapping/touching intervals into a minimal sorted set
const mergeIntervals8 = (intervals: CoveredInterval8[]): CoveredInterval8[] => {
  if (intervals.length === 0) return [];

  const sorted = [...intervals].sort((a, b) =>
    a.from < b.from ? -1 : a.from > b.from ? 1 : 0,
  );
  const merged: CoveredInterval8[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    const current = sorted[i];

    // Touching means current.from is at most 1 day after last.to (no uncovered day between them)
    const gapBetween = diffInDays(last.to, current.from);

    if (gapBetween <= 1) {
      // Overlapping or directly adjacent → merge
      if (current.to > last.to) {
        last.to = current.to;
      }
    } else {
      merged.push({ from: current.from, to: current.to });
    }
  }

  return merged;
};

const detectMissingEducationGaps = (tl: Step8Type[]): DetectedGap8[] => {
  // 1. Collect Education intervals
  const educationIntervals: CoveredInterval8[] = tl
    .filter((e): e is EducationEntry => e.kind === "education")
    .filter((e) => e.startDate && e.endDate)
    .map((e) => ({ from: e.startDate, to: e.endDate }));

  // 2. Collect EXISTING Gap intervals — these are already "covered" and must
  //    not be re-suggested or duplicated
  const existingGapIntervals: CoveredInterval8[] = tl
    .filter((e): e is GapEntry8 => e.kind === "gap")
    .filter((e) => e.gapFrom && e.gapTo)
    .map((e) => ({ from: e.gapFrom, to: e.gapTo }));

  // 3. Merge Education + existing Gaps into one covered timeline
  const covered = mergeIntervals8([
    ...educationIntervals,
    ...existingGapIntervals,
  ]);

  if (covered.length < 2) return [];

  // 4. Walk consecutive merged intervals; whatever sits between them is
  //    genuinely uncovered and becomes a candidate new Gap
  const newGaps: DetectedGap8[] = [];

  for (let i = 0; i < covered.length - 1; i++) {
    const current = covered[i];
    const next = covered[i + 1];

    const uncoveredStart = addDays(current.to, 1);
    const uncoveredEnd = addDays(next.from, -1);

    if (diffInDays(uncoveredStart, uncoveredEnd) < 0) continue; // shouldn't happen post-merge, but safe

    const uncoveredLengthDays = diffInDays(uncoveredStart, uncoveredEnd) + 1;
    if (uncoveredLengthDays >= MIN_GAP_DAYS) {
      newGaps.push({ gapFrom: uncoveredStart, gapTo: uncoveredEnd });
    }
  }

  return newGaps;
};

const gapAlreadyExists8 = (gap: DetectedGap8, tl: Step8Type[]): boolean => {
  return tl.some(
    (e) =>
      e.kind === "gap" && e.gapFrom === gap.gapFrom && e.gapTo === gap.gapTo,
  );
};

// ─── Sort Helper ────────────────────────────────────────────────────────────────
// Descending by start date (most recent first). Entries without a date sink to
// the bottom; among those, higher id (added later) comes first.
const getStartDate8 = (entry: Step8Type): string =>
  entry.kind === "education" ? entry.startDate : entry.gapFrom;

const sortTimelineDescending8 = (tl: Step8Type[]): Step8Type[] => {
  return [...tl].sort((a, b) => {
    const dateA = getStartDate8(a);
    const dateB = getStartDate8(b);

    if (dateA && dateB)
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    if (dateA && !dateB) return -1;
    if (!dateA && dateB) return 1;
    return b.id - a.id;
  });
};
// ─── Future Date Validation ───────────────────────────────────────────────────

const getTodayStr = (): string => {
  return new Date().toISOString().split("T")[0];
};

const isFutureDate = (dateStr: string): boolean => {
  if (!dateStr) return false;
  return dateStr > getTodayStr(); // safe as plain ISO "yyyy-mm-dd" string comparison
};

type FutureDateCheck = {
  entryId: number;
  kind: "education" | "gap";
  field: string;
  label: string;
};

const findFutureDateViolation = (tl: Step8Type[]): FutureDateCheck | null => {
  for (const entry of tl) {
    if (entry.kind === "education") {
      if (isFutureDate(entry.startDate)) {
        return {
          entryId: entry.id,
          kind: "education",
          field: "Start Date",
          label: "Education",
        };
      }
      if (isFutureDate(entry.endDate)) {
        return {
          entryId: entry.id,
          kind: "education",
          field: "End Date",
          label: "Education",
        };
      }
    } else {
      if (isFutureDate(entry.gapFrom)) {
        return {
          entryId: entry.id,
          kind: "gap",
          field: "Gap From",
          label: "Gap",
        };
      }
      if (isFutureDate(entry.gapTo)) {
        return {
          entryId: entry.id,
          kind: "gap",
          field: "Gap To",
          label: "Gap",
        };
      }
    }
  }
  return null;
};
// ─── Sortable Card ────────────────────────────────────────────────────────────

type CardProps = {
  entry: Step8Type;
  label: string;
  onRemove: (id: number) => void;
  onUpdateEducation: (
    id: number,
    key: keyof Omit<EducationEntry, "kind" | "id">,
    value: any,
  ) => void;
  onUpdateGap: (
    id: number,
    key: keyof Omit<GapEntry8, "kind" | "id">,
    value: string,
  ) => void;
};

function TimelineCard(props: CardProps) {
  const { entry, label, onRemove, onUpdateEducation, onUpdateGap } = props;

   const handleDocUpdate = <K extends keyof EducationEntry>(
    key: K,
    value: EducationEntry[K],
  ) => {
    onUpdateEducation(
      entry.id,
      key as keyof Omit<EducationEntry, "kind" | "id">,
      value,
    );
  };

  return (
    <div
      id={`timeline-entry-${entry.id}`}
      className={`rounded-xl border px-2 p-4 ${
        entry.kind === "gap" ? "border-primary bg-amber-50/40" : "bg-white"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {entry.kind === "education" ? (
            <GraduationCap className="h-4 w-4 text-primary" />
          ) : (
            <CalendarOff className="h-4 w-4 text-primary" />
          )}

          <p className="text-sm font-semibold text-primary">{label}</p>
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
            <Label className="text-sm">
              Qualification Type <span className="text-red-500">*</span>
            </Label>
            <select
              value={entry.qualificationType}
              onChange={(e) =>
                onUpdateEducation(entry.id, "qualificationType", e.target.value)
              }
              className="mt-2 w-full border rounded-md p-2 text-sm bg-white focus-visible:outline-none"
            >
              <option value="">Select</option>
              {qualificationTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Qualification Title */}
          <div>
            <Label className="text-sm">
              Qualification Title / Subject{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              className="mt-2"
              value={entry.qualificationTitle}
              onChange={(e) =>
                onUpdateEducation(
                  entry.id,
                  "qualificationTitle",
                  e.target.value,
                )
              }
            />
          </div>

          {/* Institution Name */}
          <div>
            <Label className="text-sm">
              Institution Name <span className="text-red-500">*</span>
            </Label>
            <Input
              className="mt-2"
              value={entry.institutionName}
              onChange={(e) =>
                onUpdateEducation(entry.id, "institutionName", e.target.value)
              }
            />
          </div>

          {/* Institution Country */}
          <div>
            <Label className="text-sm">
              Institution Country <span className="text-red-500">*</span>
            </Label>
            <Input
              className="mt-2"
              value={entry.institutionCountry}
              onChange={(e) =>
                onUpdateEducation(
                  entry.id,
                  "institutionCountry",
                  e.target.value,
                )
              }
            />
          </div>

          {/* Awarding Body */}
          <div>
            <Label className="text-sm">
              Awarding Body <span className="text-red-500">*</span>
            </Label>
            <Input
              className="mt-2"
              value={entry.awardingBody}
              onChange={(e) =>
                onUpdateEducation(entry.id, "awardingBody", e.target.value)
              }
            />
          </div>

          {/* Grade */}
          <div>
            <Label className="text-sm">
              Grade / Result <span className="text-red-500">*</span>
            </Label>
            <Input
              className="mt-2"
              value={entry.gradeOrResult}
              onChange={(e) =>
                onUpdateEducation(entry.id, "gradeOrResult", e.target.value)
              }
            />
          </div>

          {/* Start / End Date */}
          <div>
            <Label className="text-sm">
              Start Date <span className="text-red-500">*</span>
            </Label>
            <Input
              className="mt-2"
              type="date"
              value={entry.startDate}
              onChange={(e) =>
                onUpdateEducation(entry.id, "startDate", e.target.value)
              }
            />
          </div>

          <div>
            <Label className="text-sm">
              End Date <span className="text-red-500">*</span>
            </Label>
            <Input
              className="mt-2"
              type="date"
              value={entry.endDate}
              onChange={(e) =>
                onUpdateEducation(entry.id, "endDate", e.target.value)
              }
            />
          </div>

          {/* Completed */}
          <div>
            <Label className="text-sm">
              Completed? <span className="text-red-500">*</span>
            </Label>
            <div className="mt-2">
              <RadioGroup
                value={entry.completed ?? "no"}
                onValueChange={(value) =>
                  onUpdateEducation(
                    entry.id,
                    "completed",
                    value as "yes" | "no",
                  )
                }
                className="flex gap-3"
              >
                {(["yes", "no"] as const).map((v) => (
                  <div key={v} className="flex items-center gap-2">
                    <RadioGroupItem value={v} id={`${entry.id}-${v}`} />
                    <Label htmlFor={`${entry.id}-${v}`}>
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          {/* Professional Registration */}
          <div>
            <Label className="text-sm">
              Professional Registration / Licence?
              <span className="text-red-500">*</span>
            </Label>

            <div className="mt-2">
              <RadioGroup
                value={entry.hasProfessionalRegistration ?? "no"}
                onValueChange={(value) =>
                  onUpdateEducation(
                    entry.id,
                    "hasProfessionalRegistration",
                    value as "yes" | "no",
                  )
                }
                className="flex gap-3"
              >
                {(["yes", "no"] as const).map((v) => (
                  <div key={v} className="flex items-center gap-2">
                    <RadioGroupItem value={v} id={`reg-${entry.id}-${v}`} />
                    <Label htmlFor={`reg-${entry.id}-${v}`}>
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          {entry.hasProfessionalRegistration === "yes" && (
            <>
              <div>
                <Label className="text-sm">
                  Registration Body <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="mt-2"
                  value={entry.registrationBody}
                  onChange={(e) =>
                    onUpdateEducation(
                      entry.id,
                      "registrationBody",
                      e.target.value,
                    )
                  }
                />
              </div>
              <div>
                <Label className="text-sm">Registration Number *</Label>
                <Input
                  className="mt-2"
                  value={entry.registrationNumber}
                  onChange={(e) =>
                    onUpdateEducation(
                      entry.id,
                      "registrationNumber",
                      e.target.value,
                    )
                  }
                />
              </div>
              <div>
                <Label className="text-sm">
                  Registration Expiry <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="mt-2"
                  type="date"
                  value={entry.registrationExpiry}
                  onChange={(e) =>
                    onUpdateEducation(
                      entry.id,
                      "registrationExpiry",
                      e.target.value,
                    )
                  }
                />
              </div>
            </>
          )}

          {/* Certificate Upload */}
          <div className="md:col-span-2">
             <div className="md:col-span-2">
              <DocCard<EducationEntry>
                title="Certificate (optional)"
                fieldKey="certificateFile"
                hint="Upload certificate (PDF, DOC, DOCX, JPG, JPEG or PNG)"
                file={entry.certificateFile}
                onUpdate={handleDocUpdate}
                acceptedTypes={[".pdf", ".doc", ".docx", ".jpg", ".png", ".jpeg"]}
              />

              
            </div>
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <Label className="text-sm">Additional Notes (optional)</Label>
            <Textarea
              className="mt-2"
              value={entry.additionalNotes}
              onChange={(e) =>
                onUpdateEducation(entry.id, "additionalNotes", e.target.value)
              }
            />
          </div>
        </div>
      )}

      {/* ── Gap fields ── */}
      {entry.kind === "gap" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label className="text-sm">
              Gap From <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              className="mt-2"
              value={entry.gapFrom}
              onChange={(e) => onUpdateGap(entry.id, "gapFrom", e.target.value)}
            />
          </div>
          <div>
            <Label className="text-sm">
              Gap To <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              className="mt-2"
              value={entry.gapTo}
              onChange={(e) => onUpdateGap(entry.id, "gapTo", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <Label className="text-sm">
              Reason <span className="text-red-500">*</span>
            </Label>
            <Textarea
              className="mt-2 min-h-[90px]"
              value={entry.reason}
              onChange={(e) => onUpdateGap(entry.id, "reason", e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = { next: () => void; back: () => void; userId:any };

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Step8({ next, back,userId }: Props) {
  const [loading, setLoading] = useState(false);

  const [timeline, setTimeline] = useState<Step8Type[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [pendingGapIds, setPendingGapIds] = useState<number[]>([]);

  // Load data on page load
  useEffect(() => {
    
    async function loadTimeline() {
      try {
        setLoading(true);
        const data = await getTimeline(userId);
        // Convert loaded data to include proper IDs and types
        const formattedData = data.map((item: any) => {
          if (item.kind === "education") {
            return {
              ...emptyEducation(),
              ...item,
              id: item.id || nextId(),
            };
          } else {
            return {
              ...emptyGap(),
              ...item,
              id: item.id || nextId(),
            };
          }
        });
        setTimeline(formattedData);
      } catch (err) {
        console.error("Failed to load timeline", err);
        toast.error("Failed to load timeline");
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    }

    loadTimeline();
  }, []);

  // ── Add / Remove ────────────────────────────────────────────────────────────
  // const addEducation = () => setTimeline((prev) => [emptyEducation(), ...prev]);
  const addEducation = () => {
    const newEducation = emptyEducation();

    setTimeline((prev) => sortTimelineDescending8([...prev, newEducation]));

    requestAnimationFrame(() => {
      const el = document.getElementById(`timeline-entry-${newEducation.id}`);

      el?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  };

  // const addGap = () => setTimeline((prev) => [emptyGap(), ...prev]);
  const addGap = () => {
    const newGap = emptyGap();

    setTimeline((prev) => sortTimelineDescending8([...prev, newGap]));

    setTimeout(() => {
      document.getElementById(`timeline-entry-${newGap.id}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const removeEntry = (id: number) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p>Are you sure you want to remove this entry?</p>

        <div className="flex gap-2 justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.dismiss(t.id)}
          >
            No
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              setTimeline((prev) =>
                sortTimelineDescending8(prev.filter((e) => e.id !== id)),
              );

              toast.dismiss(t.id);
              toast.success("Entry removed");
            }}
          >
            Yes
          </Button>
        </div>
      </div>
    ));
  };

  // ── Update ──────────────────────────────────────────────────────────────────

  // Only these fields should trigger a live re-sort + scroll. Text fields
  // (institution name, notes, grade, etc.) must NOT trigger this — re-sorting
  // while the user is mid-keystroke in a text field yanks the card away from
  // under their cursor.
  const DATE_KEYS_EDUCATION = new Set(["startDate", "endDate"]);
  const DATE_KEYS_GAP = new Set(["gapFrom", "gapTo"]);

  // Scrolls the given entry back into view after a re-sort may have moved its
  // position. Runs after React has committed the re-sorted DOM.
  const scrollEntryIntoView8 = (id: number) => {
    requestAnimationFrame(() => {
      const el = document.getElementById(`timeline-entry-${id}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const updateEducation = (
    id: number,
    key: keyof Omit<EducationEntry, "kind" | "id">,
    value: any,
  ) => {
    const isDateField = DATE_KEYS_EDUCATION.has(key as string);

    setTimeline((prev) => {
      const updated = prev.map((e) =>
        e.id === id && e.kind === "education" ? { ...e, [key]: value } : e,
      );

      return isDateField ? sortTimelineDescending8(updated) : updated;
    });

    // Only re-scroll when a date change could have moved this card's position
    if (isDateField) {
      scrollEntryIntoView8(id);
    }
  };

  const updateGap = (
    id: number,
    key: keyof Omit<GapEntry8, "kind" | "id">,
    value: string,
  ) => {
    const isDateField = DATE_KEYS_GAP.has(key as string);

    setTimeline((prev) => {
      const updated = prev.map((e) =>
        e.id === id && e.kind === "gap" ? { ...e, [key]: value } : e,
      );

      return isDateField ? sortTimelineDescending8(updated) : updated;
    });

    if (isDateField) {
      scrollEntryIntoView8(id);
    }
  };
  // ── Label ───────────────────────────────────────────────────────────────────
  const getLabel = (entry: Step8Type, tl: Step8Type[]) => {
    let count = 0;
    for (const e of tl) {
      if (e.kind === entry.kind) count++;
      if (e.id === entry.id) break;
    }
    // return entry.kind === "education" ? `Education #${count}` : `Gap #${count}`;
    return entry.kind === "education" ? `Education` : `Gap`;
  };

  // ── Validation ───────────────────────────────────────────────────────────────
  const validateStep = (): boolean => {
    const educations = timeline.filter(
      (e): e is EducationEntry => e.kind === "education",
    );

    if (educations.length === 0) {
      toast.error("Please add at least one education record");
      return false;
    }

    for (const entry of timeline) {
      const label = getLabel(entry, timeline);

      if (entry.kind === "education") {
        const {
          qualificationType,
          qualificationTitle,
          institutionName,
          institutionCountry,
          awardingBody,
          gradeOrResult,
          startDate,
          endDate,
          hasProfessionalRegistration,
          registrationBody,
          registrationNumber,
          registrationExpiry,
        } = entry;

        if (
          !qualificationType ||
          !qualificationTitle?.trim() ||
          !institutionName?.trim() ||
          !institutionCountry?.trim() ||
          !awardingBody?.trim() ||
          !gradeOrResult?.trim() ||
          !startDate ||
          !endDate
        ) {
          toast.error(`Please complete all required fields for ${label}`);
          return false;
        }

        if (startDate === endDate) {
          toast.error(
            `${label}: Start Date and End Date cannot be the same date`,
          );

          requestAnimationFrame(() => {
            document
              .getElementById(`timeline-entry-${entry.id}`)
              ?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
          });

          return false;
        }

        if (new Date(startDate) > new Date(endDate)) {
          toast.error(`${label}: Start Date cannot be after End Date`);

          requestAnimationFrame(() => {
            document
              .getElementById(`timeline-entry-${entry.id}`)
              ?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
          });

          return false;
        }
        if (!entry.completed) {
          toast.error(
            `${label}: Please select whether the qualification is completed`,
          );
          return false;
        }
        if (!entry.hasProfessionalRegistration) {
          toast.error(
            `${label}: Please select whether you have a professional registration`,
          );
          return false;
        }

        if (hasProfessionalRegistration === "yes") {
          if (
            !registrationBody?.trim() ||
            !registrationNumber?.trim() ||
            !registrationExpiry
          ) {
            toast.error(`${label}: Please complete all registration details`);
            return false;
          }
        }
      }

      if (entry.kind === "gap") {
        const { gapFrom, gapTo, reason } = entry;
        const anyFilled = [gapFrom, gapTo, reason].some((v) => v?.trim());
        if (!anyFilled) continue;

        if (!gapFrom || !gapTo || !reason?.trim()) {
          toast.error(`Please complete all fields in ${label}`);
          return false;
        }
        if (gapFrom === gapTo) {
          toast.error(`${label}: Gap From and Gap To cannot be the same date`);

          requestAnimationFrame(() => {
            document
              .getElementById(`timeline-entry-${entry.id}`)
              ?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
          });

          return false;
        }

        if (new Date(gapFrom) > new Date(gapTo)) {
          toast.error(`${label}: Gap From cannot be after Gap To`);

          requestAnimationFrame(() => {
            document
              .getElementById(`timeline-entry-${entry.id}`)
              ?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
          });

          return false;
        }
      }
    }

    return true;
  };

  // Save data (POST API) — called when user clicks Next
  const handleSave = async (): Promise<boolean> => {
    try {
      if (!userId) {
        toast.error("User not found. Please login again.");
        return false;
      }

      setLoading(true);

      await saveTimeline(userId, timeline);

      return true;
    } catch (err) {
      console.error("Save failed", err);
      toast.error("Failed to save timeline");
      return false;
    } finally {
      setLoading(false);
    }
  };
  // Handle Next: validate → save → proceed
  const handleNext = async () => {
    // ─── Step 0: Future date validation (NEW — runs first) ─────────────────
    const futureViolation = findFutureDateViolation(timeline);
    if (futureViolation) {
      toast.error(
        `${futureViolation.label} contains a future ${futureViolation.field}. Dates must be today or in the past.`,
      );
      requestAnimationFrame(() => {
        const el = document.getElementById(
          `timeline-entry-${futureViolation.entryId}`,
        );
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      return;
    }

    // ─── Overlap Validation ───────────────────────────────────────────────────────

    type DateRange8 = {
      entryId: number;
      kind: "education" | "gap";
      label: string;
      from: string;
      to: string;
    };

    const getRanges8 = (tl: Step8Type[]): DateRange8[] => {
      const ranges: DateRange8[] = [];

      for (const e of tl) {
        if (e.kind === "education" && e.startDate && e.endDate) {
          ranges.push({
            entryId: e.id,
            kind: "education",
            label: "Education",
            from: e.startDate,
            to: e.endDate,
          });
        } else if (e.kind === "gap" && e.gapFrom && e.gapTo) {
          ranges.push({
            entryId: e.id,
            kind: "gap",
            label: "Gap",
            from: e.gapFrom,
            to: e.gapTo,
          });
        }
      }

      return ranges;
    };

    // Two inclusive ranges overlap if (startA <= endB) && (startB <= endA)
    const rangesOverlap8 = (a: DateRange8, b: DateRange8): boolean => {
      return a.from <= b.to && b.from <= a.to;
    };

    type OverlapViolation8 = {
      first: DateRange8;
      second: DateRange8;
    };

    const findOverlapViolation = (
      tl: Step8Type[],
    ): OverlapViolation8 | null => {
      const ranges = getRanges8(tl).sort((a, b) =>
        a.from < b.from ? -1 : a.from > b.from ? 1 : 0,
      );

      for (let i = 0; i < ranges.length; i++) {
        for (let j = i + 1; j < ranges.length; j++) {
          if (rangesOverlap8(ranges[i], ranges[j])) {
            return { first: ranges[i], second: ranges[j] };
          }
        }
      }

      return null;
    };

    const buildOverlapMessage8 = (v: OverlapViolation8): string => {
      const { first, second } = v;

      // Gap vs Education
      if (
        (first.kind === "gap" && second.kind === "education") ||
        (first.kind === "education" && second.kind === "gap")
      ) {
        return `A Gap period overlaps with an Education period. Please adjust the dates so they do not overlap.`;
      }

      // Education vs Education
      if (first.kind === "education" && second.kind === "education") {
        return `Two Education periods overlap. Please adjust the dates so they do not overlap.`;
      }

      // Gap vs Gap
      return `Two Gap periods overlap. Please adjust the dates so they do not overlap.`;
    };
    // ─── Step 0.5: Overlap validation (NEW) ─────────────────────────────────
    const overlapViolation = findOverlapViolation(timeline);
    if (overlapViolation) {
      toast.error(buildOverlapMessage8(overlapViolation));
      requestAnimationFrame(() => {
        // Scroll to the later-starting entry — that's typically the one the user needs to fix
        const targetId =
          overlapViolation.second.from >= overlapViolation.first.from
            ? overlapViolation.second.entryId
            : overlapViolation.first.entryId;
        const el = document.getElementById(`timeline-entry-${targetId}`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      return;
    }

    // ─── Step A: Detect missing education gaps ─────────────────────────────
    const detected = detectMissingEducationGaps(timeline);
    const missing = detected.filter((g) => !gapAlreadyExists8(g, timeline));

    if (missing.length > 0) {
      const newGaps: GapEntry8[] = missing.map((g) => ({
        kind: "gap",
        id: nextId(),
        gapFrom: g.gapFrom,
        gapTo: g.gapTo,
        reason: "",
      }));

      setTimeline((prev) => sortTimelineDescending8([...prev, ...newGaps]));
      setPendingGapIds(newGaps.map((g) => g.id));

      const lines = missing
        .map(
          (g, idx) =>
            `Gap ${idx + 1}: ${formatDisplayDate(g.gapFrom)} - ${formatDisplayDate(g.gapTo)}`,
        )
        .join("\n");
      toast.error(
        `Education gaps were detected and automatically added.\n${lines}\nPlease provide a reason for each gap before continuing.`,
        { duration: 6000 },
      );

      requestAnimationFrame(() => {
        const el = document.getElementById(`timeline-entry-${newGaps[0].id}`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      });

      return; // block submission
    }

    // ─── Step B: Block if previously auto-added gaps still lack a reason ───
    const unfinishedPending = timeline.filter(
      (e): e is GapEntry8 =>
        e.kind === "gap" && pendingGapIds.includes(e.id) && !e.reason?.trim(),
    );
    if (unfinishedPending.length > 0) {
      toast.error(
        "Please provide a reason for each auto-detected gap before continuing.",
      );
      requestAnimationFrame(() => {
        const el = document.getElementById(
          `timeline-entry-${unfinishedPending[0].id}`,
        );
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      return;
    }

    // ─── Step C: existing validation + save, unchanged ─────────────────────
    if (!validateStep()) return;

    // Final descending sort right before save (matches Step9's pattern)
    setTimeline((prev) => sortTimelineDescending8(prev));

    const saved = await handleSave();
    if (saved) {
      setPendingGapIds([]);
      next();
    }
  };

  // Show loading state only on initial load
  if (initialLoad && loading) {
    return (
      <div className="min-w-full space-y-4 p-1 flex flex-col">
        <div className="rounded-2xl border bg-white p-5">
          <h2 className="text-lg font-semibold mb-1">
            Qualifications &amp; Education (UK)
          </h2>
          <p className="text-sm text-muted-foreground">
            Loading your timeline...
          </p>
        </div>
        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }
  if (loading) return <FullPageLoader />;

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="relative">
      <div>
        <div className="min-w-full space-y-4 p-1 flex flex-col">
          {/* Header card */}
          <div className="rounded-2xl border bg-white p-5">
            <h2 className="text-lg font-semibold mb-1">
              Qualifications &amp; Education (UK)
            </h2>
            <p className="text-sm text-muted-foreground">
              Add your complete education history and any gaps. Entries are
              ordered automatically by date, most recent first.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={addEducation}
              className="gap-2 text-primary"
              disabled={loading}
            >
              <GraduationCap className="h-4 w-4" />+ Add Education
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={addGap}
              className="gap-2 border-primary text-primary hover:bg-amber-50"
              disabled={loading}
            >
              <CalendarOff className="h-4 w-4" />+ Add Gap
            </Button>
          </div>

          {/* Timeline render */}
          {timeline.length === 0 && !loading ? (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              No entries yet. Use the buttons above to add your education or any
              education gaps.
            </div>
          ) : (
            <div className="space-y-3">
              {timeline.map((entry) => (
                <TimelineCard
                  key={entry.id}
                  entry={entry}
                  label={getLabel(entry, timeline)}
                  onRemove={removeEntry}
                  onUpdateEducation={updateEducation}
                  onUpdateGap={updateGap}
                />
              ))}
            </div>
          )}

          <SignupNavButtons
            onBack={back}
            onNext={handleNext}
            disableBack={loading}
          />
        </div>
      </div>
    </div>
  );
}