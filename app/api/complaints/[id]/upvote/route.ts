import axios from "axios";
import { NextResponse } from "next/server";
import { BACKEND_API_URL } from "@/utils/env";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const response = await upvoteBackendComplaint(id);

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
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
}

async function upvoteBackendComplaint(id: string) {
  const encodedId = encodeURIComponent(id);
  const attempts = [
    {
      method: "patch",
      url: `${BACKEND_API_URL}/complaints/${encodedId}/upvote`,
    },
    {
      method: "post",
      url: `${BACKEND_API_URL}/complaints/${encodedId}/upvote`,
    },
    {
      method: "put",
      url: `${BACKEND_API_URL}/complaints/${encodedId}/upvote`,
    },
    {
      method: "patch",
      url: `${BACKEND_API_URL}/complaints/upvote/${encodedId}`,
    },
    {
      method: "post",
      url: `${BACKEND_API_URL}/complaints/upvote/${encodedId}`,
    },
    {
      method: "put",
      url: `${BACKEND_API_URL}/complaints/upvote/${encodedId}`,
    },
  ] as const;

  let lastError: unknown;

  for (const attempt of attempts) {
    try {
      return await axios.request({
        method: attempt.method,
        url: attempt.url,
      });
    } catch (error) {
      lastError = error;

      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status !== 404 &&
        error.response.status !== 405
      ) {
        throw error;
      }
    }
  }

  throw lastError;
}
