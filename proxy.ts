import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import toast from "react-hot-toast";


export async function proxy(req: NextRequest) {
  const user = await getUserFromRequest(req);

  if (!user) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // If logged in → allow access
  return NextResponse.next();
}

export const config = {
  matcher: ["/user/dashboard/:path*"], 
};