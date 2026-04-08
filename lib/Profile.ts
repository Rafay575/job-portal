import axios from "axios";
import { toast } from "react-hot-toast";
// ✅ Get User by ID
export const getUserById = async (id: number|string|null) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
      { id }
    );
    return res.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || "Failed to fetch user";
    toast.error(message);
    throw error;
  }
};
// ✅ Update Profile (name / email / password)
export const updateProfile = async ({
  userId,
  type,
  value,
  email,
}: {
  userId: number| string | null;
  type: "name" | "email" | "password";
  value: string;
  email?: string;
}) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/update-profile`,
      { userId, type, value, email },
      { withCredentials: true }
    );

    const message = res?.data?.message || "Updated successfully";

    toast.success(message);

    return res.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || "Update failed";

    toast.error(message);
    throw error;
  }
};

// ✅ Verify OTP for email/password update
export const verifyUpdateOtp = async ({
  email,
  otp,
  type,
  userId,
}: {
  email: string;
  otp: string;
  type: "email" | "password";
  userId: number| string | null;
}) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/verify-update-otp`,
      { email, otp, type, userId },
      { withCredentials: true }
    );

    const message = res?.data?.message || "Updated successfully";

    toast.success(message);

    return res.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || "OTP verification failed";

    toast.error(message);
    throw error;
  }
};