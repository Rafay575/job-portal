"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Trash2, Briefcase, CalendarOff, GripVertical } from "lucide-react";
import { getStep9, saveStep9 } from "@/lib/api/step9";
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

// ✅ Use Date.now() + counter to avoid collisions with real DB numeric IDs
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

// ✅ Moved outside component so it's not re-created on every render
// ✅ Fixed: use `db.kind` not `db.entry_type` — matches what the API actually returns
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

// ─── Sortable Card ────────────────────────────────────────────────────────────

type CardProps = {
  entry: TimelineEntry9;
  label: string;
  isDragOverlay?: boolean;
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

function SortableCard(props: CardProps) {
  const {
    entry,
    label,
    isDragOverlay,
    onRemove,
    onUpdateExperience,
    onUpdateGap,
  } = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: entry.id });

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
        entry.kind === "gap" ? "border-amber-200 bg-amber-50/40" : "bg-white"
      } ${isDragOverlay ? "shadow-2xl rotate-1 scale-[1.02] opacity-95" : ""}`}
    >
      {/* Card header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* Drag handle */}
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing touch-none p-1 rounded hover:bg-muted/60 text-muted-foreground"
            aria-label="Drag to reorder"
          >
            <GripVertical className="h-4 w-4" />
          </button>

          {entry.kind === "experience" ? (
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          ) : (
            <CalendarOff className="h-4 w-4 text-primary" />
          )}
          <p
            className={`text-sm font-semibold ${entry.kind === "gap" ? "text-primary" : ""}`}
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
                Date From<span className="text-red-500">*</span>{" "}
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

type Props = { next: () => void; back: () => void };

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Step9({ next, back }: Props) {
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const [blur, setBlur] = useState(false);

  const [data, setData] = useState<Step9Type>({
    areas: [],
    timeline: [],
  });
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

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

  const addExperience = () =>
    setData((prev) => ({
      ...prev,
      timeline: [...prev.timeline, emptyExperience()],
    }));

  const addGap = () =>
    setData((prev) => ({ ...prev, timeline: [...prev.timeline, emptyGap()] }));

  const removeEntry = (id: number) =>
    setData((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((e) => e.id !== id),
    }));

  const updateExperience = (
    id: number,
    key: keyof Omit<ExperienceEntry, "kind" | "id">,
    value: string,
  ) =>
    setData((prev) => ({
      ...prev,
      timeline: prev.timeline.map((e) =>
        e.id === id && e.kind === "experience" ? { ...e, [key]: value } : e,
      ),
    }));

  const updateGap = (
    id: number,
    key: keyof Omit<GapEntry9, "kind" | "id">,
    value: string,
  ) =>
    setData((prev) => ({
      ...prev,
      timeline: prev.timeline.map((e) =>
        e.id === id && e.kind === "gap" ? { ...e, [key]: value } : e,
      ),
    }));

  const handleDragStart = (event: DragStartEvent) =>
    setActiveId(event.active.id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;
    setData((prev) => {
      const oldIndex = prev.timeline.findIndex((e) => e.id === active.id);
      const newIndex = prev.timeline.findIndex((e) => e.id === over.id);
      return {
        ...prev,
        timeline: arrayMove(prev.timeline, oldIndex, newIndex),
      };
    });
  };

  const getLabel = (entry: TimelineEntry9, timeline: TimelineEntry9[]) => {
    let count = 0;
    for (const e of timeline) {
      if (e.kind === entry.kind) count++;
      if (e.id === entry.id) break;
    }
    return entry.kind === "experience"
      ? `Experience #${count}`
      : `Gap #${count}`;
  };

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
        if (new Date(dateFrom) > new Date(dateTo)) {
          toast.error(`${label}: "Date From" cannot be after "Date To"`);
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
        if (new Date(gapFrom) > new Date(gapTo)) {
          toast.error(`${label}: "Gap From" cannot be after "Gap To"`);
          return false;
        }
      }
    }
    return true;
  };

  const activeEntry =
    activeId != null
      ? (data.timeline.find((e) => e.id === activeId) ?? null)
      : null;

  // ✅ Fixed: getStep9 returns Step9Data directly (areas + timeline), not a {success, data} wrapper
  const router = useRouter();
  useEffect(() => {
    const verifyUser = async () => {
      if (!user.id) {
        toast.error("Id not found  ");
        router.push("/");
        return;
      }
      const isApproved = await checkApproval(user.id);

      if (!isApproved) {
        setBlur(true);
      }
    };

    verifyUser();
    const load = async () => {
      setLoading(true);

      try {
        const res = await getStep9(user.id);

        setData({
          areas: res.areas || [],
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

  const handleNext = async () => {
    if (!validateStep()) return;
    if (!user.id) {
      toast.error("Id not found in Handle Next");
      return;
    }
    try {
      setLoading(true);
      const res = await saveStep9(user.id, data);
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
        className={blur ? "blur-[3px] pointer-events-none select-none p-2" : ""}
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
              Add your work history and any employment gaps. Drag the ⠿ handle
              on each card to reorder entries.
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

            {/* Drag-and-drop list */}
            {data.timeline.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                No entries yet. Use the buttons above to add your experience or
                employment gaps.
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={data.timeline.map((e) => e.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {data.timeline.map((entry) => (
                      <SortableCard
                        key={entry.id}
                        entry={entry}
                        label={getLabel(entry, data.timeline)}
                        onRemove={removeEntry}
                        onUpdateExperience={updateExperience}
                        onUpdateGap={updateGap}
                      />
                    ))}
                  </div>
                </SortableContext>

                <DragOverlay>
                  {activeEntry ? (
                    <SortableCard
                      entry={activeEntry}
                      label={getLabel(activeEntry, data.timeline)}
                      isDragOverlay
                      onRemove={() => {}}
                      onUpdateExperience={() => {}}
                      onUpdateGap={() => {}}
                    />
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </div>

          <SignupNavButtons onBack={back} onNext={handleNext} />
        </div>
      </div>

      {/* Overlay */}
      {blur && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm">
              <h2 className="text-lg font-semibold mb-2">
                Appliaction Submitted Successfully.
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                One of our representative will get back to you with in 24 to 48
                hours.
              </p>

              {/* Optional action */}
              <div className="flex justify-evenly items-center">
                <Link href={"/"}>
                  <button className="px-6 py-1 bg-primary text-white rounded text-[15px] flex gap-1 items-center">
                    Done
                    {/* <IoMdCheckmark className="size-5 mb-0.5"/> */}
                  </button>
                </Link>
              </div>
            </div>
          </div>
      )}
    </div>
  );
}
