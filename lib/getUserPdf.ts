import { generatePDFBuffer } from "@/lib/pdf/generatePDF";
import { getStep1 } from "@/lib/api/step1";
import { getStep2 } from "@/lib/api/step2";
import { getStep3 } from "@/lib/api/step3";
import { getStep4 } from "@/lib/api/step4";
import { getStep5 } from "@/lib/api/step5";
import { getStep6 } from "@/lib/api/step6";
import { getTrainings } from "@/lib/api/step7";
import { getTimeline } from "@/lib/api/step8";
import { getStep9 } from "@/lib/api/step9";
import { getStep10 } from "@/lib/api/step10";
import { getStep11 } from "@/lib/api/step11";

async function safeFetch<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    const res = await fn();
    return res ?? fallback;
  } catch {
    return fallback;
  }
}
export async function getUserPDF(user_id: string | number) {
  // Step 1
  const step1 = await safeFetch(() => getStep1(user_id), { success: false, data: [] });
//   console.log("step1:", step1);
  const isPermanent = step1?.data?.[0]?.type === "permanent";
//   console.log("isPermanent:", isPermanent);
  const [
    step2,
    step3,
    step4,
    step5,
    step6,
    step7,
    step8,
    step9,
    step10,
    step11,
  ] = isPermanent
    ? Array(10).fill(null)
    : await Promise.all([
        getStep2(user_id),
        getStep3(user_id),
        getStep4(user_id),
        getStep5(user_id),
        getStep6(user_id),
        getTrainings(user_id),
        getTimeline(user_id),
        getStep9(user_id),
        getStep10(user_id),
        getStep11(user_id),
      ]);

  const user = {
    basic: step1?.data?.[0] ?? {},
    questions: step2?.data?.[0] ?? {},
    background: step3?.data?.[0] ?? {},
    health: step4?.data?.[0] ?? {},
    registration: step5?.data?.[0] ?? {},
    documents: step6?.data?.[0] ?? {},
    trainings: step7?.data ?? [],
    educations: Array.isArray(step8) ? step8 : [],
    experience: step9 ?? {},
    statement: step10?.data?.[0] ?? {},
    declaration: step11?.data?.[0] ?? {},
  };

  // Generate PDF buffer
  const pdfBuffer = await generatePDFBuffer(user);

  return {
    buffer: pdfBuffer,
    filename: `${(user.basic?.full_name || "user").replace(/\s+/g, "_")}_application.pdf`,
  };
}
