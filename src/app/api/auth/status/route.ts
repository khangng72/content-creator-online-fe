import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
  const token = cookies().get("token")?.value;

  if (token) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false });
};
