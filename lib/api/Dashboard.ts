import axios from "axios";

export const getDashboard = async () => {
  try {
    const { data } = await axios.get("/api/dashboard");
    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to fetch employees",
      data: [],
    };
  }
};

export const getLatestUsers = async () => {
  try {
    const { data } = await axios.post("/api/dashboard");

    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      data: [],
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to fetch latest users",
    };
  }
};