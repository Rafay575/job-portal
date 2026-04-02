import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({
      message: "Logout successful",
    });

    // ❌ Remove cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0), // expire immediately
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Logout failed" },
      { status: 500 }
    );
  }
}