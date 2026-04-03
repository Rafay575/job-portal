import axios from "axios";

// 🟡 Create or Edit Step5 (employee_registration)
export const submitStep5 = async (payload: any) => {
  try {
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/step5`, payload, {
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

// 🟢 Get Step5
export const getStep5 = async (userId: number | string) => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/step5?userId=${userId}`);

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