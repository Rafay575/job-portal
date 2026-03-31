import axios from "axios";

// 🟡 Submit Step6 (FILES)
export const submitStep6 = async (payload: FormData) => {
  try {
    const { data } = await axios.post("/api/step6", payload);

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Upload failed",
    };
  }
};

// 🟢 Get Step6
export const getStep6 = async (userId: number | string) => {
  try {
    const { data } = await axios.get(`/api/step6?userId=${userId}`);

    return {
      success: true,
      ...data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Fetch failed",
    };
  }
};