import { jwtVerify } from "jose";
import { NextRequest } from "next/server";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { clearUser } from "./userSlice";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

// checking token and verify it
export async function verifyToken(token?: string) {
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
  return verifyToken(token);
}

// Auth APIS ----------------------------
// ✅ Check Authentication
export const checkAuth = async () => {
  const res = await axios.get("/api/check", {
    headers: { "Cache-Control": "no-cache" },
  });

  return res.data; 
};

// ✅ Login
export const loginUser = async (email: string, password: string) => {
  const res = await axios.post("/api/login", {
    email,
    password,
  });

  return res.data; 
};
// ✅ Logout


export const logoutUser = async () => {
  try {
    const res = await axios.post("/api/logout", {}, {
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