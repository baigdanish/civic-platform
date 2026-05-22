import axios from "axios";
import { NextResponse } from "next/server";
import { BACKEND_API_URL } from "@/utils/env";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const response = await axios.get(`${BACKEND_API_URL}/complaints`, {
      params: Object.fromEntries(searchParams.entries()),
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await axios.post(`${BACKEND_API_URL}/complaints`, body);

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    return handleApiError(error);
  }
}

function handleApiError(error: unknown) {
  if (axios.isAxiosError(error)) {
    return NextResponse.json(
      error.response?.data || { success: false, message: error.message },
      { status: error.response?.status || 500 }
    );
  }

  return NextResponse.json(
    { success: false, message: "Unexpected server error." },
    { status: 500 }
  );
}
