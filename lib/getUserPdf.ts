import { generatePDFBuffer } from "@/lib/pdf/generatePDF";
import { getStep1DB } from "@/lib/server/step1";
import { getStep2DB } from "@/lib/server/step2";
import { getStep3DB } from "@/lib/server/step3";
import { getStep4DB } from "@/lib/server/step4";
import { getStep5DB } from "@/lib/server/step5";
import { getStep6DB } from "@/lib/server/step6";
import { getStep7DB } from "@/lib/server/step7";
import { getStep8DB } from "@/lib/server/step8";
import { getStep9DB } from "@/lib/server/step9";
import { getStep10DB } from "@/lib/server/step10";
import { getStep11DB } from "@/lib/server/step11";

async function safeFetch<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    const res = await fn();
    return res ?? fallback;
  } catch {
    return fallback;
  }
}
export async function getUserPDF(user_id: string | number) {
  const step1 = await safeFetch(() => getStep1DB(user_id), {
    success: false,
    data: [],
  });
  const isPermanent = step1?.data?.[0]?.type === "permanent";
  const empty = { success: false, data: [] };
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
    ? Array(10).fill(empty)
    : await Promise.all([
        getStep2DB(user_id),
        getStep3DB(user_id),
        getStep4DB(user_id),
        getStep5DB(user_id),
        getStep6DB(user_id),
        getStep7DB(user_id),
        getStep8DB(user_id),
        getStep9DB(user_id),
        getStep10DB(user_id),
        getStep11DB(user_id),
      ]);

  const user = {
    basic: step1?.data?.[0] ?? {},
    questions: step2?.data?.[0] ?? {},
    background: step3?.data?.[0] ?? {},
    health: step4?.data?.[0] ?? {},
    registration: step5?.data?.[0] ?? {},
    documents: step6?.data?.[0] ?? {},
    trainings: step7?.data ?? [],
    educations: step8?.data ?? [],
    experience: step9.data ?? {},
    statement: step10?.data?.[0] ?? {},
    declaration: step11?.data?.[0] ?? {},
  };

console.log(user);

  // Generate PDF buffer
  const pdfBuffer = await generatePDFBuffer(user);

  return {
    buffer: pdfBuffer,
    filename: `${(user.basic?.full_name || "user").replace(/\s+/g, "_")}_application.pdf`,
  };
}
