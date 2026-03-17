"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
type GapItem = {
  gapFrom: string;
  gapTo: string;
  reason: string;
};

type Education = {
  qualificationType: string; // GCSE, A Level, NVQ, Degree, etc
  qualificationTitle: string; // subject / course title
  institutionName: string;
  institutionCountry: string; // UK, Pakistan, etc
  awardingBody: string; // e.g., Pearson, City & Guilds, University name
  gradeOrResult: string; // e.g., A*, 2:1, Distinction
  startDate: string;
  endDate: string;
  completed: "yes" | "no";
  additionalNotes: string;

  // Optional extras (common for UK onboarding)
  hasProfessionalRegistration: "yes" | "no";
  registrationBody: string;
  registrationNumber: string;
  registrationExpiry: string;

  certificateFile: File | null;
  // NEW GAP SECTION
  hasEducationGaps: "yes" | "no";
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

type Props = {
  next: () => void;
  back: () => void;
};
const emptyGap = (): GapItem => ({
  gapFrom: "",
  gapTo: "",
  reason: "",
});

const emptyEducation = (): Education => ({
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
  hasEducationGaps: "no",
  gapExplanation: "",
  gaps: [emptyGap()],
});

export default function Step8({ next, back }: Props) {
  const [educationHistory, setEducationHistory] = useState<Education[]>([
    emptyEducation(),
  ]);

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

  const updateEducation = (
    index: number,
    field: keyof Education,
    value: any,
  ) => {
    const updated = [...educationHistory];
    (updated[index] as any)[field] = value;
    setEducationHistory(updated);
  };

  const addEducation = () => {
    setEducationHistory([...educationHistory, emptyEducation()]);
  };

  const removeEducation = (index: number) => {
    const nextList = educationHistory.filter((_, i) => i !== index);
    setEducationHistory(nextList.length ? nextList : [emptyEducation()]);
  };

  const validateStep = (): boolean => {
    // Require at least one education record fully filled
    for (let i = 0; i < educationHistory.length; i++) {
      const e = educationHistory[i];

      if (
        !e.qualificationType ||
        !e.qualificationTitle.trim() ||
        !e.institutionName.trim() ||
        !e.institutionCountry.trim() ||
        !e.awardingBody.trim() ||
        !e.gradeOrResult.trim() ||
        !e.startDate ||
        !e.endDate
      ) {
        toast.error(
          `Please complete all required fields for Education ${i + 1}`,
        );
        return false;
      }

      if (new Date(e.startDate) > new Date(e.endDate)) {
        toast.error(`Education ${i + 1}: Start Date cannot be after End Date`);
        return false;
      }

      if (e.hasProfessionalRegistration === "yes") {
        if (
          !e.registrationBody.trim() ||
          !e.registrationNumber.trim() ||
          !e.registrationExpiry
        ) {
          toast.error(
            `Education ${i + 1}: Please complete registration details`,
          );
          return false;
        }
      }
      if (e.hasEducationGaps === "yes") {
        if (!e.gapExplanation.trim()) {
          toast.error(`Education ${i + 1}: Please explain your education gap`);
          return false;
        }

        for (let g = 0; g < e.gaps.length; g++) {
          const gap = e.gaps[g];

          if (!gap.gapFrom || !gap.gapTo || !gap.reason.trim()) {
            toast.error(`Education ${i + 1} Gap ${g + 1}: complete all fields`);
            return false;
          }

          if (new Date(gap.gapFrom) > new Date(gap.gapTo)) {
            toast.error(`Education ${i + 1} Gap ${g + 1}: invalid dates`);
            return false;
          }
        }
      }
    }

    return true;
  };
  const addGap = (eduIndex: number) => {
    const updated = [...educationHistory];
    updated[eduIndex].gaps.push(emptyGap());
    setEducationHistory(updated);
  };

  const removeGap = (eduIndex: number, gapIndex: number) => {
    const updated = [...educationHistory];
    updated[eduIndex].gaps.splice(gapIndex, 1);

    if (updated[eduIndex].gaps.length === 0) {
      updated[eduIndex].gaps = [emptyGap()];
    }

    setEducationHistory(updated);
  };

  const updateGap = (
    eduIndex: number,
    gapIndex: number,
    field: keyof GapItem,
    value: string,
  ) => {
    const updated = [...educationHistory];
    updated[eduIndex].gaps[gapIndex][field] = value;
    setEducationHistory(updated);
  };

  return (
    <>
      <div className="min-w-full space-y-5 p-1 flex flex-col">
        <div className="rounded-2xl border bg-white p-5">
          <h2 className="text-lg font-semibold mb-1">
            Qualifications & Education (UK)
          </h2>
          <p className="text-sm text-muted-foreground">
            Add your education and qualifications. You can add multiple entries.
          </p>
        </div>

        <AnimatePresence mode="popLayout">
          {educationHistory.map((edu, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3 }}
              className="border bg-white p-4 rounded-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base font-semibold">
                  Education {index + 1}
                </Label>

                {educationHistory.length > 1 && (
                  <Button
                    variant="destructive"
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="gap-2"
                  >
                    Remove
                  </Button>
                )}
              </div>

              <div className="grid gap-x-5 gap-y-3 grid-cols-1 md:grid-cols-2">
                {/* Qualification Type */}
                <div>
                  <Label className="text-sm">Qualification Type *</Label>
                  <select
                    value={edu.qualificationType}
                    onChange={(e) =>
                      updateEducation(
                        index,
                        "qualificationType",
                        e.target.value,
                      )
                    }
                    className="mt-2 w-full border rounded-xl p-2 text-sm bg-white"
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
                    Qualification Title / Subject *
                  </Label>
                  <Input
                    className="mt-2"
                    placeholder="e.g., BSc Computer Science"
                    value={edu.qualificationTitle}
                    onChange={(e) =>
                      updateEducation(
                        index,
                        "qualificationTitle",
                        e.target.value,
                      )
                    }
                  />
                </div>

                {/* Institution Name */}
                <div>
                  <Label className="text-sm">Institution Name *</Label>
                  <Input
                    className="mt-2"
                    placeholder="e.g., University of Manchester"
                    value={edu.institutionName}
                    onChange={(e) =>
                      updateEducation(index, "institutionName", e.target.value)
                    }
                  />
                </div>

                {/* Institution Country */}
                <div>
                  <Label className="text-sm">Institution Country *</Label>
                  <Input
                    className="mt-2"
                    placeholder="e.g., United Kingdom"
                    value={edu.institutionCountry}
                    onChange={(e) =>
                      updateEducation(
                        index,
                        "institutionCountry",
                        e.target.value,
                      )
                    }
                  />
                </div>

                {/* Awarding Body */}
                <div>
                  <Label className="text-sm">Awarding Body *</Label>
                  <Input
                    className="mt-2"
                    placeholder="e.g., Pearson / City & Guilds / University"
                    value={edu.awardingBody}
                    onChange={(e) =>
                      updateEducation(index, "awardingBody", e.target.value)
                    }
                  />
                </div>

                {/* Grade/Result */}
                <div>
                  <Label className="text-sm">Grade / Result *</Label>
                  <Input
                    className="mt-2"
                    placeholder="e.g., 2:1 / Distinction / A*"
                    value={edu.gradeOrResult}
                    onChange={(e) =>
                      updateEducation(index, "gradeOrResult", e.target.value)
                    }
                  />
                </div>

                {/* Start/End */}
                <div>
                  <Label className="text-sm">Start Date *</Label>
                  <Input
                    className="mt-2"
                    type="date"
                    value={edu.startDate}
                    onChange={(e) =>
                      updateEducation(index, "startDate", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label className="text-sm">End Date *</Label>
                  <Input
                    className="mt-2"
                    type="date"
                    value={edu.endDate}
                    onChange={(e) =>
                      updateEducation(index, "endDate", e.target.value)
                    }
                  />
                </div>

                {/* Completed */}
                <div>
                  <Label className="text-sm">Completed? *</Label>
                  <div className="mt-2 flex gap-3">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name={`completed-${index}`}
                        checked={edu.completed === "yes"}
                        onChange={() =>
                          updateEducation(index, "completed", "yes")
                        }
                      />
                      Yes
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name={`completed-${index}`}
                        checked={edu.completed === "no"}
                        onChange={() =>
                          updateEducation(index, "completed", "no")
                        }
                      />
                      No
                    </label>
                  </div>
                </div>

                {/* Professional Registration */}
                <div>
                  <Label className="text-sm">
                    Professional Registration / Licence?
                  </Label>
                  <div className="mt-2 flex gap-3">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name={`reg-${index}`}
                        checked={edu.hasProfessionalRegistration === "yes"}
                        onChange={() =>
                          updateEducation(
                            index,
                            "hasProfessionalRegistration",
                            "yes",
                          )
                        }
                      />
                      Yes
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name={`reg-${index}`}
                        checked={edu.hasProfessionalRegistration === "no"}
                        onChange={() =>
                          updateEducation(
                            index,
                            "hasProfessionalRegistration",
                            "no",
                          )
                        }
                      />
                      No
                    </label>
                  </div>
                </div>

                {edu.hasProfessionalRegistration === "yes" && (
                  <>
                    <div>
                      <Label className="text-sm">Registration Body *</Label>
                      <Input
                        className="mt-2"
                        placeholder="e.g., NMC / HCPC / GMC"
                        value={edu.registrationBody}
                        onChange={(e) =>
                          updateEducation(
                            index,
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
                        placeholder="e.g., PIN / Licence No"
                        value={edu.registrationNumber}
                        onChange={(e) =>
                          updateEducation(
                            index,
                            "registrationNumber",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div>
                      <Label className="text-sm">Registration Expiry *</Label>
                      <Input
                        className="mt-2"
                        type="date"
                        value={edu.registrationExpiry}
                        onChange={(e) =>
                          updateEducation(
                            index,
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
                  <Label className="text-sm">
                    Upload Certificate (optional)
                  </Label>
                  <div className="mt-2 border rounded-xl p-3">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        updateEducation(index, "certificateFile", file);
                      }}
                    />
                    {edu.certificateFile && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Uploaded: {edu.certificateFile.name}
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
                    value={edu.additionalNotes}
                    onChange={(e) =>
                      updateEducation(index, "additionalNotes", e.target.value)
                    }
                  />
                </div>

                {/* Education Gap Section */}
                <div className="rounded-xl border bg-white p-4 md:col-span-2">
                  <p className="text-base font-semibold">Education Gaps</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Explain any gaps between your education periods.
                  </p>

                  <div className="mt-3 flex gap-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name={`edu-gap-${index}`}
                        checked={edu.hasEducationGaps === "no"}
                        onChange={() =>
                          updateEducation(index, "hasEducationGaps", "no")
                        }
                      />
                      No
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name={`edu-gap-${index}`}
                        checked={edu.hasEducationGaps === "yes"}
                        onChange={() =>
                          updateEducation(index, "hasEducationGaps", "yes")
                        }
                      />
                      Yes
                    </label>
                  </div>

                  {edu.hasEducationGaps === "yes" && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <Label className="text-sm">Gap Explanation *</Label>
                        <Textarea
                          className="mt-2"
                          value={edu.gapExplanation}
                          onChange={(e) =>
                            updateEducation(
                              index,
                              "gapExplanation",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      <div className="flex justify-between items-center">
                        <p className="text-sm font-semibold">Gap Records</p>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => addGap(index)}
                        >
                          Add Gap
                        </Button>
                      </div>
                      <AnimatePresence mode="popLayout">
                        {edu.gaps.map((g, gapIndex) => (
                          <motion.div
                            key={gapIndex}
                            layout
                            initial={{ opacity: 0, y: -10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, y: -10, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="border rounded-xl p-4"
                          >
                            <div className="flex justify-between">
                              <p className="text-sm font-semibold">
                                Gap #{gapIndex + 1}
                              </p>

                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => removeGap(index, gapIndex)}
                              >
                                Remove
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                              <div>
                                <Label className="text-sm">Gap From *</Label>
                                <Input
                                  type="date"
                                  className="mt-2"
                                  value={g.gapFrom}
                                  onChange={(e) =>
                                    updateGap(
                                      index,
                                      gapIndex,
                                      "gapFrom",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>

                              <div>
                                <Label className="text-sm">Gap To *</Label>
                                <Input
                                  type="date"
                                  className="mt-2"
                                  value={g.gapTo}
                                  onChange={(e) =>
                                    updateGap(
                                      index,
                                      gapIndex,
                                      "gapTo",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>

                              <div className="md:col-span-2">
                                <Label className="text-sm">Reason *</Label>
                                <Textarea
                                  className="mt-2"
                                  value={g.reason}
                                  onChange={(e) =>
                                    updateGap(
                                      index,
                                      gapIndex,
                                      "reason",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <Button type="button" onClick={addEducation}>
          Add Another Qualification
        </Button>

        <SignupNavButtons
          onBack={back}
          onNext={() => {
            if (validateStep()) next();
          }}
        />
      </div>
    </>
  );
}
