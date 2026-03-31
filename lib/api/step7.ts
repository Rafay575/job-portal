import { Step7Type } from "@/types/Form";
import axios from "axios";

const API = "/api/step7";

/**
 * ================= GET TRAININGS =================
 */
export const getTrainings = async (userId: number | string) => {
  try {
    const res = await axios.get(`${API}?userId=${userId}`);
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
    const res = await axios.post(API, {
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