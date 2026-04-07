import axios from "axios";

export const checkApproval = async (userId: number | string |null) => {
  try {
    const { data } = await axios.get(`/api/users/check-approval?id=${userId}`);

    return data.isApproved;
  } catch (error) {
    return false;
  }
};

export const approveUser = async (id: number | string) => {
  try {
    const { data } = await axios.post("/api/users/approve-user", {
      id
    });

    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Error",
    };
  }
};

export const rejectUser = async (id: number| string) => {
  try {
    const { data } = await axios.post("/api/users/reject-user", {
      id
    });

    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Error",
    };
  }
};
