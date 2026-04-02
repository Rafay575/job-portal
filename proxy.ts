import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";





export async function proxy(req: NextRequest) {
  const user = await getUserFromRequest(req);

  // If user NOT logged in → redirect
  if (!user) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // If logged in → allow access
  return NextResponse.next();
}

export const config = {
  matcher: ["/user/dashboard/:path*"], 
};