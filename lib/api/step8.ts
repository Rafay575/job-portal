import toast from "react-hot-toast";

export type TimelineItem = {
  id?: number; // Add id for tracking
  kind: "education" | "gap";

  // education
  qualificationType?: string;
  qualificationTitle?: string;
  institutionName?: string;
  institutionCountry?: string;
  awardingBody?: string;
  gradeOrResult?: string;
  startDate?: string;
  endDate?: string;
  completed?: "yes" | "no"; // Change to "yes" | "no"
  hasProfessionalRegistration?: "yes" | "no"; // Change to "yes" | "no"
  registrationBody?: string;
  registrationNumber?: string;
  registrationExpiry?: string;
  certificateFile?: string | File | null; // Allow File or string
  existingCertificateFile?: string | null;
  additionalNotes?: string;

  // gap
  gapFrom?: string;
  gapTo?: string;
  reason?: string;
};

export async function getTimeline(userId: any) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/step8?userId=${userId}`,
    );

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch timeline");
    }

    // Ensure each item has proper types and default values
    return data.data.map((item: any) => ({
      ...item,
      completed: item.completed || "yes",
      hasProfessionalRegistration: item.hasProfessionalRegistration || "no",
    }));
  } catch (error) {
    console.error("getTimeline error:", error);
    return [];
  }
}

export async function saveTimeline(
  userId: number | string,
  timeline: TimelineItem[],
) {
  try {
    const formData = new FormData();

    formData.append("userId", String(userId));

    timeline.forEach((item, i) => {
      formData.append(`timeline[${i}][kind]`, item.kind);

      if (item.kind === "education") {
        formData.append(
          `timeline[${i}][qualificationType]`,
          item.qualificationType || "",
        );
        formData.append(
          `timeline[${i}][qualificationTitle]`,
          item.qualificationTitle || "",
        );
        formData.append(
          `timeline[${i}][institutionName]`,
          item.institutionName || "",
        );
        formData.append(
          `timeline[${i}][institutionCountry]`,
          item.institutionCountry || "",
        );
        formData.append(
          `timeline[${i}][awardingBody]`,
          item.awardingBody || "",
        );
        formData.append(
          `timeline[${i}][gradeOrResult]`,
          item.gradeOrResult || "",
        );
        formData.append(`timeline[${i}][startDate]`, item.startDate || "");
        formData.append(`timeline[${i}][endDate]`, item.endDate || "");
        formData.append(`timeline[${i}][completed]`, item.completed || "yes");
        formData.append(
          `timeline[${i}][hasProfessionalRegistration]`,
          item.hasProfessionalRegistration || "no",
        );
        formData.append(
          `timeline[${i}][registrationBody]`,
          item.registrationBody || "",
        );
        formData.append(
          `timeline[${i}][registrationNumber]`,
          item.registrationNumber || "",
        );
        formData.append(
          `timeline[${i}][registrationExpiry]`,
          item.registrationExpiry || "",
        );
        formData.append(
          `timeline[${i}][additionalNotes]`,
          item.additionalNotes || "",
        );

        // ✅ FILE HANDLING
        if (item.certificateFile instanceof File) {
          formData.append(`certificate_${i}`, item.certificateFile);
        } else if (
          typeof item.certificateFile === "string" &&
          item.certificateFile
        ) {
          formData.append(`existing_certificate_${i}`, item.certificateFile);
        }
      }

      if (item.kind === "gap") {
        formData.append(`timeline[${i}][gapFrom]`, item.gapFrom || "");
        formData.append(`timeline[${i}][gapTo]`, item.gapTo || "");
        formData.append(`timeline[${i}][reason]`, item.reason || "");
      }
    });

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/step8`, {
      method: "POST",
      body: formData, // ✅ NO JSON
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message);
    }
    toast.success(data.message);

    return data;
  } catch (error) {
    console.error("saveTimeline error:", error);
    throw error;
  }
}
