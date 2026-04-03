import axios from "axios";

// 🟡 Submit Step10
export const submitStep10 = async (payload: any) => {
  try {
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/step10`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return { success: true, data };
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

// 🟢 Get Step10
export const getStep10 = async (userId: number | string) => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/step10?userId=${userId}`);

    return { success: true, ...data };
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