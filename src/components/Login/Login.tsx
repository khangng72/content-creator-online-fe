"use client";

import Image from "next/image";
import vn_sample_image from "$/public/sample-4.jpg";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { Link, useRouter } from "@/i18n/routing";
import { Input } from "../ui/input";
import { FormEvent, useEffect, useState } from "react";

import axios from "axios";
import { useSearchParams } from "next/navigation";

const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();
  const t = useTranslations("Login");

  useEffect(() => {
    // Check if the 'error' query parameter is present in the URL
    if (searchParams.get("error") === "true") {
      setError(true);
    }
  }, [searchParams]);

  const randomQuote = {
    author: "Ho Chi Minh",
    quote: "Nothing is more important than independence and freedom",
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      console.log(response);

      if (response.status !== 200) {
        console.log("ERROR LOGIN");
        router.push("/auth/login?error=true");
      }

      router.push("/");
    } catch (error) {
      console.log("Error: ", error);
      router.push("/auth/login?error=true");
    }
  };

  return (
    <main className="bg-background">
      <section className="min-h-screen flex items-center justify-center">
        <div className="bg-card flex rounded-2xl shadow-lg max-w-3xl p-5 items-center ">
          <div className="md:w-1/2 px-5 md:px-16 space-y-4">
            <h2 className="font-bold text-2xl text-foreground">{t("title")}</h2>
            <p className="text-sm mt-4 text-foreground italic font-serif">
              {t("about")}
            </p>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <Input
                className="p-2"
                type="email"
                name="email"
                placeholder={t("email")}
                required
              />
              <div className="relative">
                <Input
                  className="p-2"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder={t("password")}
                  required
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <Eye className="text-red-500" />
                  ) : (
                    <EyeOff className="text-green-500" />
                  )}
                </button>
              </div>
              {error && (
                <span className="text-sm text-red-500">{t("loginFailed")}</span>
              )}
              <Button>{t("loginButton")}</Button>
            </form>

            <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
              <hr className="border-gray-400" />
              <p className="text-center text-sm">{t("or")}</p>
              <hr className="border-gray-400" />
            </div>

            <Button className="w-full mt-5 flex justify-center items-center">
              <svg
                className="mr-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="25px"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
              {t("loginButtonWithGoogle")}
            </Button>

            <div className="mt-5 text-sm border-b border-foreground py-4 text-foreground">
              <Link href="#" className="hover:underline">
                {t("forgotPassword")}
              </Link>
            </div>

            <div className="mt-3 gap-2 text-sm flex justify-between items-center text-foreground">
              <p>{t("notHaveAccount")}</p>
              <Button className="py-2 px-5 bg-rainbow hover:scale-110 duration-300">
                <Link href="/register">{t("registerButton")}</Link>
              </Button>
            </div>
          </div>

          <div className="md:block hidden w-1/2 relative">
            <Image
              className="rounded-2xl h-[600px] opacity-90 backdrop-blur-lg bg-white bg-opacity-30 shadow-lg"
              src={vn_sample_image}
              alt="Login Image"
            />

            <div className="absolute top-2/3 ml-[70px] mr-[30px] text-right bg-secondary px-5 py-2 rounded-tl-3xl rounded-br-3xl">
              <p className="italic font-bold font-serif">
                &quot;
                {randomQuote.quote}
                &quot;
              </p>
              <p className="mt-2 font-serif">- {randomQuote.author}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
