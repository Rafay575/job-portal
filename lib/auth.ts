import { jwtVerify } from "jose";
import { NextRequest } from "next/server";
import axios from "axios";
import { toast } from "react-hot-toast";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

// checking token and verify it
export async function verifyToken(token?: string) {
  if (!token) {
    console.log("no token");
    return null;
  }
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}
export async function ResendOTP(token?: string) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function getUserFromRequest(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    console.log("no token");
  }
  return verifyToken(token);
}



// Auth APIS ----------------------------
// ✅ Check Authentication
export const checkAuth = async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/check`, {
    headers: { "Cache-Control": "no-cache" },
  });

  return res.data; 
};

// ✅ Login
export const loginUser = async (email: string, password: string) => {
  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
    email,
    password,
  });

  return res.data; 
};
// ✅ Logout


export const logoutUser = async () => {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {}, {
      withCredentials: true,
    });

    // ✅ Use API message if exists, else fallback
    const message = res?.data?.message || "Logout successful";

    toast.success(message);

    return res.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || "Logout failed";

    toast.error(message);
    throw error;
  }
};
