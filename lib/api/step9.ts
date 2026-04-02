export type Step9TimelineItem = {
  id?: number;
  kind: "experience" | "gap";

  // experience
  employerName?: string;
  jobTitle?: string;
  duties?: string;
  dateFrom?: string;
  dateTo?: string;

  // gap
  gapFrom?: string;
  gapTo?: string;
  reason?: string;
};

export type Step9Data = {
  areas: string[];
  timeline: Step9TimelineItem[];
};

// =========================
// GET STEP 9
// =========================
export async function getStep9(userId: any): Promise<Step9Data> {
  try {
    const res = await fetch(`/api/step9?userId=${userId}`);
    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch Step 9");
    }

    return {
      areas: data.data.areas || [],
      timeline: (data.data.timeline || []).map((item: any) => ({
        ...item,
      })),
    };
  } catch (error) {
    console.error("getStep9 error:", error);
    return {
      areas: [],
      timeline: [],
    };
  }
}

// =========================
// SAVE STEP 9
// =========================
export async function saveStep9(
  userId: number | string,
  data: Step9Data
) {
  try {
    const formData = new FormData();

    formData.append("userId", String(userId));

    // =====================
    // AREAS
    // =====================
    formData.append("areas", JSON.stringify(data.areas));

    // =====================
    // TIMELINE
    // =====================
    data.timeline.forEach((item, i) => {
      formData.append(`timeline[${i}][kind]`, item.kind);

      if (item.kind === "experience") {
        formData.append(`timeline[${i}][employerName]`, item.employerName || "");
        formData.append(`timeline[${i}][jobTitle]`, item.jobTitle || "");
        formData.append(`timeline[${i}][duties]`, item.duties || "");
        formData.append(`timeline[${i}][dateFrom]`, item.dateFrom || "");
        formData.append(`timeline[${i}][dateTo]`, item.dateTo || "");
      }

      if (item.kind === "gap") {
        formData.append(`timeline[${i}][gapFrom]`, item.gapFrom || "");
        formData.append(`timeline[${i}][gapTo]`, item.gapTo || "");
        formData.append(`timeline[${i}][reason]`, item.reason || "");
      }
    });

    const res = await fetch("/api/step9", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Save failed");
    }

    return result;
  } catch (error) {
    console.error("saveStep9 error:", error);
    throw error;
  }
}