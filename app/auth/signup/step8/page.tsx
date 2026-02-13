"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Employment = {
  employerName: string;
  address: string;
  businessType: string;
  jobTitle: string;
  phone: string;
  startDate: string;
  endDate: string;
  grade: string;
  salary: string;
  specialty: string;
  jobType: string;
  reasonForLeaving: string;
  duties: string;
};

type Props = {
  step: number;
  validateStep: () => boolean;
};

function SignupNavButtons({ step, validateStep }: Props) {
  const router = useRouter();

  const handleNext = () => {
    if (validateStep()) {
      router.push(`/auth/signup/step${step + 1}`);
    }
  };

  const handleBack = () => {
    router.push(`/auth/signup/step${step - 1}`);
  };

  return (
    <div className="flex gap-2 mt-3">
      <Button variant="outline" onClick={handleBack}>
        Back
      </Button>

      <Button onClick={handleNext}>Next</Button>
    </div>
  );
}

export default function Step8() {
  const [step] = useState(8);

  const [employmentHistory, setEmploymentHistory] = useState<Employment[]>([
    {
      employerName: "",
      address: "",
      businessType: "",
      jobTitle: "",
      phone: "",
      startDate: "",
      endDate: "",
      grade: "",
      salary: "",
      specialty: "",
      jobType: "",
      reasonForLeaving: "",
      duties: "",
    },
  ]);

  const updateEmployment = (
    index: number,
    field: keyof Employment,
    value: string,
  ) => {
    const updated = [...employmentHistory];
    updated[index][field] = value;
    setEmploymentHistory(updated);
  };

  const addEmployment = () => {
    setEmploymentHistory([
      ...employmentHistory,
      {
        employerName: "",
        address: "",
        businessType: "",
        jobTitle: "",
        phone: "",
        startDate: "",
        endDate: "",
        grade: "",
        salary: "",
        specialty: "",
        jobType: "",
        reasonForLeaving: "",
        duties: "",
      },
    ]);
  };

  const removeEmployment = (index: number) => {
    setEmploymentHistory(employmentHistory.filter((_, i) => i !== index));
  };

  const validateStep = (): boolean => {
    for (let i = 0; i < employmentHistory.length; i++) {
      const job = employmentHistory[i];

      if (
        !job.employerName ||
        !job.address ||
        !job.businessType ||
        !job.jobTitle ||
        !job.phone ||
        !job.startDate ||
        !job.endDate ||
        !job.grade ||
        !job.salary ||
        !job.specialty ||
        !job.jobType ||
        !job.reasonForLeaving ||
        !job.duties
      ) {
        toast.error(`Please complete all fields for employment ${i + 1}`);
        return false;
      }
    }

    return true;
  };

  return (
    <>
      <h2 className="text-primary text-3xl font-medium  mb-4 md:mb-7 text-center">
        Employment History
      </h2>

      <div className="min-w-full space-y-5 p-1 flex flex-col">
        {employmentHistory.map((job, index) => (
          <div className="border p-4 rounded-lg ">
            <Label className="mb-3">Employment {index + 1}</Label>

            <div
              key={index}
              className=" grid gap-x-5 gap-y-3 grid-cols-1 md:grid-cols-2"
            >
              <div>
                <Input
                  placeholder="Employer Name"
                  value={job.employerName}
                  onChange={(e) =>
                    updateEmployment(index, "employerName", e.target.value)
                  }
                />
              </div>

              <div>
                <Input
                  placeholder="Address"
                  value={job.address}
                  onChange={(e) =>
                    updateEmployment(index, "address", e.target.value)
                  }
                />
              </div>

              <div>
                <Input
                  placeholder="Business Type"
                  value={job.businessType}
                  onChange={(e) =>
                    updateEmployment(index, "businessType", e.target.value)
                  }
                />
              </div>
              <div>
                <Input
                  placeholder="Job Title"
                  value={job.jobTitle}
                  onChange={(e) =>
                    updateEmployment(index, "jobTitle", e.target.value)
                  }
                />
              </div>
              <div>
                <Input
                  placeholder="Phone"
                  value={job.phone}
                  onChange={(e) =>
                    updateEmployment(index, "phone", e.target.value)
                  }
                />
              </div>
              <div>
                <Input
                  type="date"
                  value={job.startDate}
                  onChange={(e) =>
                    updateEmployment(index, "startDate", e.target.value)
                  }
                />
              </div>

              <div>
                <Input
                  type="date"
                  value={job.endDate}
                  onChange={(e) =>
                    updateEmployment(index, "endDate", e.target.value)
                  }
                />
              </div>
              <div>
                <Input
                  placeholder="Grade"
                  value={job.grade}
                  onChange={(e) =>
                    updateEmployment(index, "grade", e.target.value)
                  }
                />
              </div>
              <div>
                <Input
                  placeholder="Salary"
                  value={job.salary}
                  onChange={(e) =>
                    updateEmployment(index, "salary", e.target.value)
                  }
                />
              </div>
              <div>
                <Input
                  placeholder="Specialty"
                  value={job.specialty}
                  onChange={(e) =>
                    updateEmployment(index, "specialty", e.target.value)
                  }
                />
              </div>
              <div>
                <Input
                  placeholder="Job Type"
                  value={job.jobType}
                  onChange={(e) =>
                    updateEmployment(index, "jobType", e.target.value)
                  }
                />
              </div>
              <div>
                <Input
                  placeholder="Reason For Leaving"
                  value={job.reasonForLeaving}
                  onChange={(e) =>
                    updateEmployment(index, "reasonForLeaving", e.target.value)
                  }
                />
              </div>

              <div>
                <Textarea
                  placeholder="Duties & Responsibilities"
                  value={job.duties}
                  onChange={(e) =>
                    updateEmployment(index, "duties", e.target.value)
                  }
                />
              </div>

              {employmentHistory.length > 1 && (
                <Button
                  variant="destructive"
                  type="button"
                  onClick={() => removeEmployment(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        ))}

        <Button type="button" onClick={addEmployment}>
          Add Another Employment
        </Button>

        <SignupNavButtons step={step} validateStep={validateStep} />
      </div>
    </>
  );
}
