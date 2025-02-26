import { API_AUTH_LOGIN, generateApi } from "@/constants/api";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const { email, password } = await request.json();
    const response = await axios.post(generateApi(API_AUTH_LOGIN), {
      email,
      password,
    });

    const { token } = response.data;

    if (response.status !== 200) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    cookies().set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("ERROR LOGIN: ", error);
    return NextResponse.json({ error: "Login failed" }, { status: 401 });
  }
};
