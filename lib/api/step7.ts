import { Step7Type } from "@/types/Form";
import axios from "axios";

// ================= GET TRAININGS =================
export const getTrainings = async (userId: number | string) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/step7?userId=${userId}`,
    );
    return res.data;
  } catch (err: any) {
    return { success: false, message: "Failed to fetch trainings" };
  }
};

// ================= SAVE TRAININGS (UPSERT) =================
export const saveTrainings = async (
  userId: number | string,
  trainings: Step7Type[],
) => {
  try {
    // ✅ Build FormData instead of plain JSON
    const formData = new FormData();
    formData.append("userId", String(userId));

    // Append metadata as JSON string (files sent separately)
    const trainingsMeta = trainings.map((t) => ({
      title: t.title,
      provider: t.provider,
      duration: t.duration,
      completionDate: t.completionDate,
      certificateFilePath:
        typeof t.certificateFile === "string" ? t.certificateFile : null,
    }));
    formData.append("trainings", JSON.stringify(trainingsMeta));

    // Append each file with its index key: certificate_0, certificate_1 ...
    trainings.forEach((t, i) => {
      if (t.certificateFile instanceof File) {
        formData.append(`certificate_${i}`, t.certificateFile);
      }
    });

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/step7`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    return res.data;
  } catch (err: any) {
    return { success: false, message: "Failed to save trainings" };
  }
};
