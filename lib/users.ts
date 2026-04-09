import axios from "axios";


export const checkApproval = async (userId: any) => {
  try {
    const { data } = await axios.get(
      `/api/users/check-approval?id=${userId}`
    );

    return {
      status: data.status as "pending" | "approved" | "rejected",
      isApproved: data.status === "approved",
    };
  } catch (error) {
    return {
      status: "pending" as "pending",
      isApproved: false,
    };
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

export const deleteUser = async (id: number | string) => {
  try {
    const { data } = await axios.delete("/api/users/delete-user", {
      data: { id },
    });

    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong",
    };
  }
};


export const bulkApproveUsers = async (ids: (number | string)[]) => {
  try {
    const { data } = await axios.patch("/api/users/approve-user", {
      ids,
    });

    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong",
    };
  }
};

export const bulkRejectUsers = async (ids: (number | string)[]) => {
  try {
    const { data } = await axios.patch("/api/users/reject-user", {
      ids,
    });

    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong",
    };
  }
};

export const bulkDeleteUsers = async (ids: (number | string)[]) => {
  try {
    const { data } = await axios.patch("/api/users/delete-user", {
      ids,
    });

    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong",
    };
  }
};
