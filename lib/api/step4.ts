import axios from "axios";

// 🟡 Create or Edit Step4 (employee_health)
export const submitStep4 = async (payload: any) => {
  try {
    const { data } = await axios.post("/api/step4", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

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

// 🟢 Get Step4
export const getStep4 = async (userId: number | string) => {
  try {
    const { data } = await axios.get(`/api/step4?userId=${userId}`);

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
        "Failed to fetch data",
    };
  }
};