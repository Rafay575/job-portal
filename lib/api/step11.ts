import axios from "axios";

// 🟡 Submit Step11
export const submitStep11 = async (payload: FormData) => {
  try {
    const { data } = await axios.post("/api/step11", payload);

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
        "Something went wrong",
    };
  }
};

// 🟢 Get Step11
export const getStep11 = async (userId: number | string) => {
  try {
    const { data } = await axios.get(`/api/step11?userId=${userId}`);

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
        "Failed to fetch",
    };
  }
};