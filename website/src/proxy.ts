import { NextResponse } from "next/server";
import { getIndexingHeaders } from "@/lib/deployment-environment";

export function proxy() {
  const response = NextResponse.next();
  for (const { key, value } of getIndexingHeaders()) {
    response.headers.set(key, value);
  }
  return response;
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
