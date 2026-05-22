import axios from "axios";
import { NextResponse } from "next/server";
import { BACKEND_API_URL } from "@/utils/env";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const response = await axios.get(
      `${BACKEND_API_URL}/complaints/${encodeURIComponent(id)}`,
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data || { success: false, message: error.message },
        { status: error.response?.status || 500 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Unexpected server error." },
      { status: 500 },
    );
  }
}
