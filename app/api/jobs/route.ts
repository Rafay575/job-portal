import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const response = await axios.get(
      `${process.env.SALES_API}/api/sales/open`,
      {
        headers: {
          Authorization: `Bearer ${process.env.SALES_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Sales API Error:", error.response?.data);

      return NextResponse.json(
        {
          success: false,
          message:
            error.response?.data || "Failed to fetch sales data",
        },
        {
          status: error.response?.status || 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}