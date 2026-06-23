import axios from "axios";


// Create or Edit Step1 
export const submitStep1 = async (formData: FormData) => {
  try {
    
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/step1`, formData, {
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
// Create or Edit Step1 Admin 
export const submitStep1Admin = async (formData: FormData) => {
  try {
    
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/step1-admin`, formData, {
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

// Get Step1 
export const getStep1 = async (userId: any) => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/step1?userId=${userId}`);    
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

// Get Step1 Admin
export const getStep1Admin = async (userId: number | string | null) => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/step1-admin?userId=${userId}`);    
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
// Get Step1 Admin
export const getDetails= async (userId: number | string | null) => {
  try {
    const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/step1-admin?userId=${userId}`);    
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

