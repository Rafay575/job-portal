"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Plus, Trash2 } from "lucide-react";

type ExperienceItem = {
  employerName: string;
  dateFrom: string; // yyyy-mm-dd
  dateTo: string; // yyyy-mm-dd
  jobTitle: string;
  duties: string;
};

type GapItem = {
  gapFrom: string; // yyyy-mm-dd
  gapTo: string; // yyyy-mm-dd
  reason: string;
};

type MandatoryExperience = {
  areas: string[];
  vulnerableDefinition: string;
  properCareMeasures: string;
  nonVerbalChoice: string;
  abuseAction: string;

  experiences: ExperienceItem[];

  // Employment gaps
  hasEmploymentGaps: "yes" | "no";
  gapExplanation: string;
  gaps: GapItem[];
};

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

type Props = {
  next: () => void;
  back: () => void;
};

const emptyExperience = (): ExperienceItem => ({
  employerName: "",
  dateFrom: "",
  dateTo: "",
  jobTitle: "",
  duties: "",
});

const emptyGap = (): GapItem => ({
  gapFrom: "",
  gapTo: "",
  reason: "",
});

export default function Step9({ next, back }: Props) {
  const [mandatoryExperience, setMandatoryExperience] =
    useState<MandatoryExperience>({
      areas: [],
      vulnerableDefinition: "",
      properCareMeasures: "",
      nonVerbalChoice: "",
      abuseAction: "",
      experiences: [emptyExperience()],

      hasEmploymentGaps: "no",
      gapExplanation: "",
      gaps: [emptyGap()],
    });

  const areas = [
    "Mental Health",
    "Learning Disabilities",
    "Drug & Alcohol",
    "Housing",
    "Elderly",
    "Children/Young People",
  ];

  const toggleArea = (area: string) => {
    setMandatoryExperience((prev) => ({
      ...prev,
      areas: prev.areas.includes(area)
        ? prev.areas.filter((a) => a !== area)
        : [...prev.areas, area],
    }));
  };

  // Experience handlers
  const addExperience = () => {
    setMandatoryExperience((prev) => ({
      ...prev,
      experiences: [...prev.experiences, emptyExperience()],
    }));
  };

  const removeExperience = (index: number) => {
    setMandatoryExperience((prev) => {
      const nextList = prev.experiences.filter((_, i) => i !== index);
      return { ...prev, experiences: nextList.length ? nextList : [emptyExperience()] };
    });
  };

  const updateExperience = (
    index: number,
    key: keyof ExperienceItem,
    value: string,
  ) => {
    setMandatoryExperience((prev) => ({
      ...prev,
      experiences: prev.experiences.map((item, i) =>
        i === index ? { ...item, [key]: value } : item,
      ),
    }));
  };

  // Gap handlers
  const addGap = () => {
    setMandatoryExperience((prev) => ({
      ...prev,
      gaps: [...prev.gaps, emptyGap()],
    }));
  };

  const removeGap = (index: number) => {
    setMandatoryExperience((prev) => {
      const nextList = prev.gaps.filter((_, i) => i !== index);
      return { ...prev, gaps: nextList.length ? nextList : [emptyGap()] };
    });
  };

  const updateGap = (index: number, key: keyof GapItem, value: string) => {
    setMandatoryExperience((prev) => ({
      ...prev,
      gaps: prev.gaps.map((g, i) => (i === index ? { ...g, [key]: value } : g)),
    }));
  };

  const validateExperiences = (): boolean => {
    const hasAnyFilled = mandatoryExperience.experiences.some((x) =>
      Object.values(x).some((v) => v.trim() !== ""),
    );

    // optional section: if nothing filled, let it pass
    if (!hasAnyFilled) return true;

    for (let i = 0; i < mandatoryExperience.experiences.length; i++) {
      const x = mandatoryExperience.experiences[i];

      const anyFieldFilled = Object.values(x).some((v) => v.trim() !== "");
      if (!anyFieldFilled) continue;

      if (
        !x.employerName.trim() ||
        !x.dateFrom ||
        !x.dateTo ||
        !x.jobTitle.trim() ||
        !x.duties.trim()
      ) {
        toast.error(`Please complete all fields in Experience #${i + 1}`);
        return false;
      }

      if (x.dateFrom && x.dateTo && new Date(x.dateFrom) > new Date(x.dateTo)) {
        toast.error(`Experience #${i + 1}: "Date From" cannot be after "Date To"`);
        return false;
      }
    }

    return true;
  };

  const validateGaps = (): boolean => {
    if (mandatoryExperience.hasEmploymentGaps === "no") return true;

    // If they said Yes, then we require either:
    // (a) gapExplanation, and
    // (b) at least one gap row properly filled (UK-friendly)
    if (!mandatoryExperience.gapExplanation.trim()) {
      toast.error("Please explain your employment gap(s)");
      return false;
    }

    const hasAnyGapFilled = mandatoryExperience.gaps.some((g) =>
      Object.values(g).some((v) => v.trim() !== ""),
    );

    if (!hasAnyGapFilled) {
      toast.error("Please add at least one employment gap record");
      return false;
    }

    for (let i = 0; i < mandatoryExperience.gaps.length; i++) {
      const g = mandatoryExperience.gaps[i];

      const anyFieldFilled = Object.values(g).some((v) => v.trim() !== "");
      if (!anyFieldFilled) continue; // allow empty row

      if (!g.gapFrom || !g.gapTo || !g.reason.trim()) {
        toast.error(`Please complete all fields in Gap #${i + 1}`);
        return false;
      }

      if (new Date(g.gapFrom) > new Date(g.gapTo)) {
        toast.error(`Gap #${i + 1}: "Gap From" cannot be after "Gap To"`);
        return false;
      }
    }

    return true;
  };

  const validateStep = (): boolean => {
    if (
      mandatoryExperience.areas.length === 0 ||
      !mandatoryExperience.vulnerableDefinition.trim() ||
      !mandatoryExperience.properCareMeasures.trim() ||
      !mandatoryExperience.nonVerbalChoice.trim() ||
      !mandatoryExperience.abuseAction.trim()
    ) {
      toast.error("Please complete all mandatory experience fields");
      return false;
    }

    if (!validateExperiences()) return false;
    if (!validateGaps()) return false;

    return true;
  };

  return (
    <div className="min-w-full space-y-4 p-2 flex flex-col">
      {/* Areas */}
      <div className="rounded-xl border bg-white p-4">
        <Label className="text-base font-semibold">Select all that apply *</Label>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {areas.map((area) => (
            <label
              key={area}
              className="flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer hover:bg-muted/40"
            >
              <input
                type="checkbox"
                checked={mandatoryExperience.areas.includes(area)}
                onChange={() => toggleArea(area)}
                className="h-4 w-4"
              />
              <span className="text-sm">{area}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Mandatory textareas */}
      <div className="rounded-xl border bg-white p-4">
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <Label className="text-sm">Definition of vulnerable people *</Label>
            <Textarea
              className="mt-2 min-h-[110px]"
              value={mandatoryExperience.vulnerableDefinition}
              onChange={(e) =>
                setMandatoryExperience((prev) => ({
                  ...prev,
                  vulnerableDefinition: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <Label className="text-sm">Measures to ensure proper care *</Label>
            <Textarea
              className="mt-2 min-h-[110px]"
              value={mandatoryExperience.properCareMeasures}
              onChange={(e) =>
                setMandatoryExperience((prev) => ({
                  ...prev,
                  properCareMeasures: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <Label className="text-sm">Helping a non-verbal client make choices *</Label>
            <Textarea
              className="mt-2 min-h-[110px]"
              value={mandatoryExperience.nonVerbalChoice}
              onChange={(e) =>
                setMandatoryExperience((prev) => ({
                  ...prev,
                  nonVerbalChoice: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <Label className="text-sm">Action if witnessing abuse *</Label>
            <Textarea
              className="mt-2 min-h-[110px]"
              value={mandatoryExperience.abuseAction}
              onChange={(e) =>
                setMandatoryExperience((prev) => ({
                  ...prev,
                  abuseAction: e.target.value,
                }))
              }
            />
          </div>
        </div>
      </div>

      {/* Experience Section */}
      <div className="rounded-xl border bg-white p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-base font-semibold">Experience</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add as many as you want. If you start filling one entry, please complete all fields.
            </p>
          </div>

          <Button type="button" variant="outline" onClick={addExperience} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Experience
          </Button>
        </div>

        <div className="mt-4 space-y-3">
          {mandatoryExperience.experiences.map((exp, index) => (
            <div key={index} className="rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Experience #{index + 1}</p>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => removeExperience(index)}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm">Name of Employer</Label>
                  <Input
                    className="mt-2"
                    value={exp.employerName}
                    onChange={(e) =>
                      updateExperience(index, "employerName", e.target.value)
                    }
                    placeholder="e.g., ABC Care Services"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm">Date From</Label>
                    <Input
                      type="date"
                      className="mt-2"
                      value={exp.dateFrom}
                      onChange={(e) =>
                        updateExperience(index, "dateFrom", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Date To</Label>
                    <Input
                      type="date"
                      className="mt-2"
                      value={exp.dateTo}
                      onChange={(e) =>
                        updateExperience(index, "dateTo", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm">Job Title</Label>
                  <Input
                    className="mt-2"
                    value={exp.jobTitle}
                    onChange={(e) => updateExperience(index, "jobTitle", e.target.value)}
                    placeholder="e.g., Support Worker"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label className="text-sm">Brief Description of Duties</Label>
                  <Textarea
                    className="mt-2 min-h-[110px]"
                    value={exp.duties}
                    onChange={(e) => updateExperience(index, "duties", e.target.value)}
                    placeholder="Describe what you did in this role..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Employment Gap Section */}
      <div className="rounded-xl border bg-white p-4">
        <p className="text-base font-semibold">Employment Gaps</p>
        <p className="text-xs text-muted-foreground mt-1">
          In the UK, employers may ask you to explain gaps longer than 3 months.
        </p>

        <div className="mt-3 flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="hasEmploymentGaps"
              checked={mandatoryExperience.hasEmploymentGaps === "no"}
              onChange={() =>
                setMandatoryExperience((prev) => ({
                  ...prev,
                  hasEmploymentGaps: "no",
                  gapExplanation: "",
                  gaps: [emptyGap()],
                }))
              }
            />
            No
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="hasEmploymentGaps"
              checked={mandatoryExperience.hasEmploymentGaps === "yes"}
              onChange={() =>
                setMandatoryExperience((prev) => ({
                  ...prev,
                  hasEmploymentGaps: "yes",
                }))
              }
            />
            Yes
          </label>
        </div>

        {mandatoryExperience.hasEmploymentGaps === "yes" && (
          <div className="mt-4 space-y-4">
            <div>
              <Label className="text-sm">Gap Explanation *</Label>
              <Textarea
                className="mt-2 min-h-[110px]"
                value={mandatoryExperience.gapExplanation}
                onChange={(e) =>
                  setMandatoryExperience((prev) => ({
                    ...prev,
                    gapExplanation: e.target.value,
                  }))
                }
                placeholder="Briefly explain why there was a gap (e.g., study, travel, family care, illness, visa processing, etc.)"
              />
            </div>

            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Gap Records</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Add your gap period(s) and reason.
                </p>
              </div>

              <Button type="button" variant="outline" onClick={addGap} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Gap
              </Button>
            </div>

            <div className="space-y-3">
              {mandatoryExperience.gaps.map((g, index) => (
                <div key={index} className="rounded-xl border p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Gap #{index + 1}</p>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeGap(index)}
                      className="gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm">Gap From *</Label>
                      <Input
                        type="date"
                        className="mt-2"
                        value={g.gapFrom}
                        onChange={(e) => updateGap(index, "gapFrom", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label className="text-sm">Gap To *</Label>
                      <Input
                        type="date"
                        className="mt-2"
                        value={g.gapTo}
                        onChange={(e) => updateGap(index, "gapTo", e.target.value)}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label className="text-sm">Reason *</Label>
                      <Textarea
                        className="mt-2 min-h-[90px]"
                        value={g.reason}
                        onChange={(e) => updateGap(index, "reason", e.target.value)}
                        placeholder="e.g., studying, maternity leave, caring for family, health recovery, relocation, etc."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <SignupNavButtons
        onBack={back}
        onNext={() => {
          if (validateStep()) {
            next();
          }
        }}
      />
    </div>
  );
}