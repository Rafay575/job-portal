"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Trash2, Briefcase, CalendarOff } from "lucide-react";
import { getStep9, saveStep9 } from "@/lib/api/step9";

import { ExperienceEntry } from "@/types/Form";
import { GapEntry9 } from "@/types/Form";
import { TimelineEntry9 } from "@/types/Form";
import { Step9Type } from "@/types/Form";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { FullPageLoader } from "../Loading";
import { useRouter } from "next/navigation";
import { checkApproval } from "@/lib/users";
import Link from "next/link";

// ─── Nav Buttons ─────────────────────────────────────────────────────────────

type NavProps = {
  onNext: () => void;
  onBack: () => void;
  disableBack?: boolean;
};

function SignupNavButtons({ onNext, onBack, disableBack }: NavProps) {
  return (
    <div className="flex gap-2 mt-4 justify-between">
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

let _idCounter = 0;
const nextTempId = () => -++_idCounter; // negative IDs = local-only, never clash with DB

const emptyExperience = (): ExperienceEntry => ({
  kind: "experience",
  id: nextTempId(),
  employerName: "",
  dateFrom: "",
  dateTo: "",
  jobTitle: "",
  duties: "",
});

const emptyGap = (): GapEntry9 => ({
  kind: "gap",
  id: nextTempId(),
  gapFrom: "",
  gapTo: "",
  reason: "",
});

function dbToStep9Frontend(db: any): TimelineEntry9 {
  if (db.kind === "experience") {
    return {
      id: db.id,
      kind: "experience",
      employerName: db.employerName || "",
      jobTitle: db.jobTitle || "",
      duties: db.duties || "",
      dateFrom: db.dateFrom || "",
      dateTo: db.dateTo || "",
    };
  }

  return {
    id: db.id,
    kind: "gap",
    gapFrom: db.gapFrom || "",
    gapTo: db.gapTo || "",
    reason: db.reason || "",
  };
}

// ─── Sort Helper ──────────────────────────────────────────────────────────────

// Gets the "start date" of any entry for sorting purposes
const getStartDate = (entry: TimelineEntry9): string => {
  if (entry.kind === "experience") return entry.dateFrom;
  return entry.gapFrom;
};

// Sorts timeline entries in descending order (most recent first) by start date.
// Entries with no date fall to the bottom; among those, newer IDs come first.
const sortTimelineDescending = (
  timeline: TimelineEntry9[],
): TimelineEntry9[] => {
  return [...timeline].sort((a, b) => {
    const dateA = getStartDate(a);
    const dateB = getStartDate(b);

    if (dateA && dateB) {
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    }
    if (dateA && !dateB) return -1;
    if (!dateA && dateB) return 1;
    // Both have no date — keep insertion order (higher negative id = more recent)
    return a.id - b.id;
  });
};

// ─── Card Component ───────────────────────────────────────────────────────────

type CardProps = {
  entry: TimelineEntry9;
  label: string;
  onRemove: (id: number) => void;
  onUpdateExperience: (
    id: number,
    key: keyof Omit<ExperienceEntry, "kind" | "id">,
    value: string,
  ) => void;
  onUpdateGap: (
    id: number,
    key: keyof Omit<GapEntry9, "kind" | "id">,
    value: string,
  ) => void;
};

function TimelineCard(props: CardProps) {
  const { entry, label, onRemove, onUpdateExperience, onUpdateGap } = props;

  return (
    <div
      className={`rounded-xl border p-4 ${
        entry.kind === "gap" ? "border-amber-200 bg-amber-50/40" : "bg-white"
      }`}
    >
      {/* Card header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {entry.kind === "experience" ? (
            <Briefcase className="h-4 w-4 text-primary" />
          ) : (
            <CalendarOff className="h-4 w-4 text-primary" />
          )}
          <p
            className={`text-sm font-semibold text-primary ${entry.kind === "gap" ? "text-primary" : ""}`}
          >
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

      {/* Experience fields */}
      {entry.kind === "experience" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label className="text-sm">
              Name of Employer<span className="text-red-500">*</span>
            </Label>
            <Input
              className="mt-2"
              value={entry.employerName}
              onChange={(e) =>
                onUpdateExperience(entry.id, "employerName", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm">
                Date From<span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                className="mt-2"
                value={entry.dateFrom}
                onChange={(e) =>
                  onUpdateExperience(entry.id, "dateFrom", e.target.value)
                }
              />
            </div>
            <div>
              <Label className="text-sm">
                Date To<span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                className="mt-2"
                value={entry.dateTo}
                onChange={(e) =>
                  onUpdateExperience(entry.id, "dateTo", e.target.value)
                }
              />
            </div>
          </div>

          <div>
            <Label className="text-sm">
              Job Title<span className="text-red-500">*</span>
            </Label>
            <Input
              className="mt-2"
              value={entry.jobTitle}
              onChange={(e) =>
                onUpdateExperience(entry.id, "jobTitle", e.target.value)
              }
            />
          </div>

          <div className="md:col-span-2">
            <Label className="text-sm">
              Brief Description of Duties<span className="text-red-500">*</span>
            </Label>
            <Textarea
              className="mt-2 min-h-[110px]"
              value={entry.duties}
              onChange={(e) =>
                onUpdateExperience(entry.id, "duties", e.target.value)
              }
            />
          </div>
        </div>
      )}

      {/* Gap fields */}
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

// ─── Gap Detection Helpers ─────────────────────────────────────────────────────

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const MIN_GAP_DAYS = 30;

// Adds N days to a YYYY-MM-DD string, returns YYYY-MM-DD
const addDays = (dateStr: string, days: number): string => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

// Whole-day difference between two YYYY-MM-DD strings (b - a)
const diffInDays = (a: string, b: string): number => {
  return Math.round(
    (new Date(b).getTime() - new Date(a).getTime()) / MS_PER_DAY,
  );
};

// "2025-03-31" -> "31 Mar 2025" (for toast/alert display only)
const formatDisplayDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
type DetectedGap = { gapFrom: string; gapTo: string };

// Sorts experiences by dateFrom ascending, then walks consecutive pairs
// looking for uncovered periods of at least MIN_GAP_DAYS.
// Overlapping or touching experiences produce no gap (difference <= 0 is skipped).
// const detectMissingGaps = (timeline: TimelineEntry9[]): DetectedGap[] => {
//   const experiences = timeline
//     .filter((e): e is ExperienceEntry => e.kind === "experience")
//     .filter((e) => e.dateFrom && e.dateTo) // ignore incomplete rows
//     .sort(
//       (a, b) => new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime(),
//     );

//   const gaps: DetectedGap[] = [];

//   for (let i = 0; i < experiences.length - 1; i++) {
//     const current = experiences[i];
//     const next = experiences[i + 1];

//     const gapStart = addDays(current.dateTo, 1);
//     const gapEnd = addDays(next.dateFrom, -1);

//     // next starts before/at current ends => overlap or touching, no gap
//     if (diffInDays(gapStart, gapEnd) < 0) continue;

//     const gapLengthDays = diffInDays(gapStart, gapEnd) + 1; // inclusive
//     if (gapLengthDays >= MIN_GAP_DAYS) {
//       gaps.push({ gapFrom: gapStart, gapTo: gapEnd });
//     }
//   }

//   return gaps;
// };
// ─── Improved Gap Detection (covers Experience AND existing Gap cards) ───────

type CoveredInterval9 = { from: string; to: string };

// Merge overlapping/touching intervals into a minimal sorted set
const mergeIntervals9 = (intervals: CoveredInterval9[]): CoveredInterval9[] => {
  if (intervals.length === 0) return [];

  const sorted = [...intervals].sort((a, b) =>
    a.from < b.from ? -1 : a.from > b.from ? 1 : 0,
  );
  const merged: CoveredInterval9[] = [sorted[0]];

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

const detectMissingExperienceGaps = (
  timeline: TimelineEntry9[],
): DetectedGap[] => {
  // 1. Collect Experience intervals
  const experienceIntervals: CoveredInterval9[] = timeline
    .filter((e): e is ExperienceEntry => e.kind === "experience")
    .filter((e) => e.dateFrom && e.dateTo)
    .map((e) => ({ from: e.dateFrom, to: e.dateTo }));

  // 2. Collect EXISTING Gap intervals — these are already "covered" and must
  //    not be re-suggested or duplicated
  const existingGapIntervals: CoveredInterval9[] = timeline
    .filter((e): e is GapEntry9 => e.kind === "gap")
    .filter((e) => e.gapFrom && e.gapTo)
    .map((e) => ({ from: e.gapFrom, to: e.gapTo }));

  // 3. Merge Experience + existing Gaps into one covered timeline
  const covered = mergeIntervals9([
    ...experienceIntervals,
    ...existingGapIntervals,
  ]);

  if (covered.length < 2) return [];

  // 4. Walk consecutive merged intervals; whatever sits between them is
  //    genuinely uncovered and becomes a candidate new Gap
  const newGaps: DetectedGap[] = [];

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
// Checks if a detected gap already has a matching Gap entry in the timeline
// (same from/to dates — exact match, since that's what defines "the same gap")
const gapAlreadyExists = (
  gap: DetectedGap,
  timeline: TimelineEntry9[],
): boolean => {
  return timeline.some(
    (e) =>
      e.kind === "gap" && e.gapFrom === gap.gapFrom && e.gapTo === gap.gapTo,
  );
};

// ─── Future Date Validation ───────────────────────────────────────────────────

const getTodayStr = (): string => {
  return new Date().toISOString().split("T")[0];
};

const isFutureDate = (dateStr: string): boolean => {
  if (!dateStr) return false;
  return dateStr > getTodayStr(); // plain ISO "yyyy-mm-dd" string comparison is safe
};

type FutureDateCheck9 = { entryId: number; field: string; label: string };

const findFutureDateViolation9 = (
  timeline: TimelineEntry9[],
): FutureDateCheck9 | null => {
  for (const entry of timeline) {
    if (entry.kind === "experience") {
      if (isFutureDate(entry.dateFrom)) {
        return { entryId: entry.id, field: "Start Date", label: "Experience" };
      }
      if (isFutureDate(entry.dateTo)) {
        return { entryId: entry.id, field: "End Date", label: "Experience" };
      }
    } else {
      if (isFutureDate(entry.gapFrom)) {
        return { entryId: entry.id, field: "Gap From", label: "Gap" };
      }
      if (isFutureDate(entry.gapTo)) {
        return { entryId: entry.id, field: "Gap To", label: "Gap" };
      }
    }
  }
  return null;
};
// ─── Main Component ───────────────────────────────────────────────────────────

export default function Step9({ next, back,userId }: Props) {
  const [loading, setLoading] = useState(false);
  

  const [data, setData] = useState<Step9Type>({
    areas: [],
    timeline: [],
  });

  const [pendingGapIds, setPendingGapIds] = useState<number[]>([]);

  const areas = [
    "Mental Health",
    "Learning Disabilities",
    "Drug & Alcohol",
    "Housing",
    "Elderly",
    "Children/Young People",
  ];

  const toggleArea = (area: string) =>
    setData((prev) => ({
      ...prev,
      areas: prev.areas.includes(area)
        ? prev.areas.filter((a) => a !== area)
        : [...prev.areas, area],
    }));

  // ─── Add / Remove ───────────────────────────────────────────────────────────
  // Sort only when adding or removing — NOT while the user is typing

  const addExperience = () => {
    const newExperience = emptyExperience();

    setData((prev) => ({
      ...prev,
      timeline: sortTimelineDescending([...prev.timeline, newExperience]),
    }));

    requestAnimationFrame(() => {
      const el = document.getElementById(`timeline-entry-${newExperience.id}`);

      el?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  };

  const addGap = () => {
    const newGap = emptyGap();

    setData((prev) => ({
      ...prev,
      timeline: sortTimelineDescending([...prev.timeline, newGap]),
    }));

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
        <p className="text-sm">Are you sure you want to remove this entry?</p>

        <div className="flex justify-end gap-2">
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
              setData((prev) => ({
                ...prev,
                timeline: sortTimelineDescending(
                  prev.timeline.filter((e) => e.id !== id),
                ),
              }));

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

  // ─── Update Handlers ────────────────────────────────────────────────────────
  // Do NOT re-sort here — cards jumping while the user types is bad UX.
  // The definitive sort happens just before saving in handleNext.

  // Date keys that should trigger a live re-sort + scroll. Text fields (name,
  // title, duties, reason) must NOT trigger this — typing would cause jumpy UX.
  const DATE_KEYS_EXPERIENCE = new Set(["dateFrom", "dateTo"]);
  const DATE_KEYS_GAP = new Set(["gapFrom", "gapTo"]);

  // Re-scrolls the given entry back into view after a re-sort has potentially
  // moved its position in the list. Runs after the DOM has repainted.
  const scrollEntryIntoView9 = (id: number) => {
    requestAnimationFrame(() => {
      const el = document.getElementById(`timeline-entry-${id}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const updateExperience = (
    id: number,
    key: keyof Omit<ExperienceEntry, "kind" | "id">,
    value: string,
  ) => {
    const isDateField = DATE_KEYS_EXPERIENCE.has(key as string);

    setData((prev) => {
      const updatedTimeline = prev.timeline.map((e) =>
        e.id === id && e.kind === "experience" ? { ...e, [key]: value } : e,
      );

      return {
        ...prev,
        timeline: isDateField
          ? sortTimelineDescending(updatedTimeline)
          : updatedTimeline,
      };
    });

    // Only re-scroll when a date change could have moved this card's position
    if (isDateField) {
      scrollEntryIntoView9(id);
    }
  };

  const updateGap = (
    id: number,
    key: keyof Omit<GapEntry9, "kind" | "id">,
    value: string,
  ) => {
    const isDateField = DATE_KEYS_GAP.has(key as string);

    setData((prev) => {
      const updatedTimeline = prev.timeline.map((e) =>
        e.id === id && e.kind === "gap" ? { ...e, [key]: value } : e,
      );

      return {
        ...prev,
        timeline: isDateField
          ? sortTimelineDescending(updatedTimeline)
          : updatedTimeline,
      };
    });

    if (isDateField) {
      scrollEntryIntoView9(id);
    }
  };
  // ─── Label ──────────────────────────────────────────────────────────────────

  const getLabel = (entry: TimelineEntry9, timeline: TimelineEntry9[]) => {
    let count = 0;
    for (const e of timeline) {
      if (e.kind === entry.kind) count++;
      if (e.id === entry.id) break;
    }
    // return entry.kind === "experience" ? `Experience #${count}`: `Gap #${count}`;
    return entry.kind === "experience" ? `Experience` : `Gap`;
  };

  // ─── Validation ─────────────────────────────────────────────────────────────

  const validateStep = (): boolean => {
    if (data.areas.length === 0) {
      toast.error("Please select at least one area of experience");
      return false;
    }
    for (const entry of data.timeline) {
      const label = getLabel(entry, data.timeline);
      if (entry.kind === "experience") {
        const { employerName, dateFrom, dateTo, jobTitle, duties } = entry;
        const anyFilled = [
          employerName,
          dateFrom,
          dateTo,
          jobTitle,
          duties,
        ].some((v) => v.trim());
        if (!anyFilled) continue;
        if (
          !employerName.trim() ||
          !dateFrom ||
          !dateTo ||
          !jobTitle.trim() ||
          !duties.trim()
        ) {
          toast.error(`Please complete all fields in ${label}`);
          return false;
        }
        if (dateFrom === dateTo) {
          toast.error(
            `${label}: Date From and Date To cannot be the same date`,
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

        if (new Date(dateFrom) > new Date(dateTo)) {
          toast.error(`${label}: "Date From" cannot be after "Date To"`);

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
      if (entry.kind === "gap") {
        const { gapFrom, gapTo, reason } = entry;
        const anyFilled = [gapFrom, gapTo, reason].some((v) => v.trim());
        if (!anyFilled) continue;
        if (!gapFrom || !gapTo || !reason.trim()) {
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
          toast.error(`${label}: "Gap From" cannot be after "Gap To"`);

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

  // ─── Load ────────────────────────────────────────────────────────────────────

  const router = useRouter();

  useEffect(() => {
    

    const load = async () => {
      setLoading(true);
      try {
        const res = await getStep9(userId);
        setData({
          areas: res.areas || [],
          // Data comes back already sorted by sort_order ASC from the DB
          timeline: (res.timeline || []).map(dbToStep9Frontend),
        });
      } catch (err) {
        console.error("Failed to load Step 9:", err);
        toast.error("Failed to load saved data");
      }
      setLoading(false);
    };

    load();
  }, []);

  // ─── Save ─────────────────────────────────────────────────────────────────────

  const handleNext = async () => {
    if (!userId) {
      toast.error("Id not found");
      return;
    }

    // ─── Step 0: Future date validation (NEW — runs first) ─────────────────
    const futureViolation = findFutureDateViolation9(data.timeline);
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

    type DateRange9 = {
      entryId: number;
      kind: "experience" | "gap";
      label: string;
      from: string;
      to: string;
    };

    const getRanges9 = (timeline: TimelineEntry9[]): DateRange9[] => {
      const ranges: DateRange9[] = [];

      for (const e of timeline) {
        if (e.kind === "experience" && e.dateFrom && e.dateTo) {
          ranges.push({
            entryId: e.id,
            kind: "experience",
            label: "Experience",
            from: e.dateFrom,
            to: e.dateTo,
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
    const rangesOverlap9 = (a: DateRange9, b: DateRange9): boolean => {
      return a.from <= b.to && b.from <= a.to;
    };

    type OverlapViolation9 = {
      first: DateRange9;
      second: DateRange9;
    };

    const findOverlapViolation9 = (
      timeline: TimelineEntry9[],
    ): OverlapViolation9 | null => {
      const ranges = getRanges9(timeline).sort((a, b) =>
        a.from < b.from ? -1 : a.from > b.from ? 1 : 0,
      );

      for (let i = 0; i < ranges.length; i++) {
        for (let j = i + 1; j < ranges.length; j++) {
          if (rangesOverlap9(ranges[i], ranges[j])) {
            return { first: ranges[i], second: ranges[j] };
          }
        }
      }

      return null;
    };

    const buildOverlapMessage9 = (v: OverlapViolation9): string => {
      const { first, second } = v;

      if (
        (first.kind === "gap" && second.kind === "experience") ||
        (first.kind === "experience" && second.kind === "gap")
      ) {
        return `Gap period overlaps with Experience period. Please adjust the dates so they do not overlap.`;
      }
      if (first.kind === "experience" && second.kind === "experience") {
        return `Two Experience periods overlap. Please adjust the dates so they do not overlap.`;
      }
      return `Two Gap periods overlap. Please adjust the dates so they do not overlap.`;
    };

    // ─── Step 0.5: Overlap validation (NEW) ─────────────────────────────────
    const overlapViolation = findOverlapViolation9(data.timeline);
    if (overlapViolation) {
      toast.error(buildOverlapMessage9(overlapViolation));
      requestAnimationFrame(() => {
        const targetId =
          overlapViolation.second.from >= overlapViolation.first.from
            ? overlapViolation.second.entryId
            : overlapViolation.first.entryId;
        const el = document.getElementById(`timeline-entry-${targetId}`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      return;
    }

    // ─── Step A: Detect missing gaps ────────────────────────────────────────
    const detected = detectMissingExperienceGaps(data.timeline);
    const missing = detected.filter((g) => !gapAlreadyExists(g, data.timeline));

    if (missing.length > 0) {
      const newGaps: GapEntry9[] = missing.map((g) => ({
        kind: "gap",
        id: nextTempId(),
        gapFrom: g.gapFrom,
        gapTo: g.gapTo,
        reason: "",
      }));

      setData((prev) => ({
        ...prev,
        timeline: sortTimelineDescending([...prev.timeline, ...newGaps]),
      }));
      setPendingGapIds(newGaps.map((g) => g.id));

      const lines = missing
        .map(
          (g, idx) =>
            `Gap ${idx + 1}: ${formatDisplayDate(g.gapFrom)} - ${formatDisplayDate(g.gapTo)}`,
        )
        .join("\n");
      toast.error(
        `Employment gaps were detected and automatically added.\n${lines}\nPlease provide a reason for each gap before continuing.`,
        { duration: 6000 },
      );

      // Scroll to the first newly created gap card once it's rendered
      requestAnimationFrame(() => {
        const el = document.getElementById(`timeline-entry-${newGaps[0].id}`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      });

      return; // prevent submission
    }

    // ─── Step B: If previously-flagged gaps still lack a reason, block again ──
    // (covers the case where gaps were auto-added on a prior attempt and the
    // user clicked Next again without filling them in)
    const unfinishedPending = data.timeline.filter(
      (e): e is GapEntry9 =>
        e.kind === "gap" && pendingGapIds.includes(e.id) && !e.reason.trim(),
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

    // ─── Step C: existing validation, unchanged ────────────────────────────
    if (!validateStep()) return;

    try {
      setLoading(true);

      const sortedData: Step9Type = {
        ...data,
        timeline: sortTimelineDescending(data.timeline),
      };

      await saveStep9(userId, sortedData);
      setPendingGapIds([]);
      next();
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <FullPageLoader />;

  return (
    <div className="relative px-2">
      <div
        
      >
        <div className="min-w-full space-y-4 p-2 flex flex-col">
          {/* Areas */}
          <div className="rounded-xl border bg-white p-4">
            <Label className="text-base font-semibold">
              Areas of Experience *
            </Label>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {areas.map((area) => (
                <label
                  key={area}
                  className="flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer hover:bg-muted/40"
                >
                  <input
                    type="checkbox"
                    checked={data.areas.includes(area)}
                    onChange={() => toggleArea(area)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">{area}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Timeline section */}
          <div className="rounded-xl border bg-white p-4">
            <p className="text-base font-semibold mb-1">
              Experience &amp; Employment Gaps
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Add your work history and any employment gaps.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mb-5">
              <Button
                type="button"
                variant="outline"
                onClick={addExperience}
                className="gap-2 text-primary"
              >
                <Briefcase className="h-4 w-4" />+ Add Experience
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={addGap}
                className="gap-2 border-primary text-primary hover:bg-amber-50"
              >
                <CalendarOff className="h-4 w-4" />+ Add Gap
              </Button>
            </div>

            {/* Timeline list */}
            {data.timeline.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                No entries yet. Use the buttons above to add your experience or
                employment gaps.
              </div>
            ) : (
              <div className="space-y-3">
                {data.timeline.map((entry) => (
                  <div key={entry.id} id={`timeline-entry-${entry.id}`}>
                    <TimelineCard
                      entry={entry}
                      label={getLabel(entry, data.timeline)}
                      onRemove={removeEntry}
                      onUpdateExperience={updateExperience}
                      onUpdateGap={updateGap}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <SignupNavButtons onBack={back} onNext={handleNext} />
        </div>
      </div>
    </div>
  );
}
