import axios from "axios";


// Create or Edit Step1 
export const submitStep1 = async (formData: FormData) => {
  try {
    console.log("formData: ",formData)
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

// Get Step1 
export const getStep1 = async (userId: number | string | null) => {
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

