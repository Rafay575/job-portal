import axios from "axios";

// 🟡 Create or Edit Step2
export const submitStep2 = async (payload: any) => {
  try {
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/step2`, payload, {
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


// 🟢 Get Step2
export const getStep2 = async (userId: number | string ) => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/step2?userId=${userId}`);

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