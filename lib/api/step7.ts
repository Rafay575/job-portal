import { Step7Type } from "@/types/Form";
import axios from "axios";



/**
 * ================= GET TRAININGS =================
 */
export const getTrainings = async (userId: number | string) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/step7?userId=${userId}`);
    return res.data;
  } catch (err: any) {
    return {
      success: false,
      message: "Failed to fetch trainings",
    };
  }
};

/**
 * ================= CREATE / UPDATE (UPSERT) =================
 * Same API handles both insert + edit
 */
export const saveTrainings = async (
  userId: number | string,
  trainings: Step7Type[]
) => {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/step7`, {
      userId,
      trainings,
    });

    return res.data;
  } catch (err: any) {
    return {
      success: false,
      message: "Failed to save trainings",
    };
  }
};