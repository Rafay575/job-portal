import axios from "axios";

// 🟢 Create or Update Step3
export const submitStep3 = async (formData: FormData) => {
  try {
    const { data } = await axios.post("/api/step3", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
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

// 🔵 Get Step3 Data
export const getStep3 = async (userId: number | string) => {
  try {
    const { data } = await axios.get(`/api/step3?userId=${userId}`);

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
        "Failed to fetch Step3 data",
    };
  }
};