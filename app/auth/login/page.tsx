"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!password) {
      toast.error("Please enter your password");
      return;
    }
    if (password.length < 8) {
      toast.error("Please enter your valid password");
      return;
    }

    // If all validations pass
    toast.success("Login successful!");
    console.log({ email, password });
    router.push("/");
  };


  return (
      <div className="relative z-10 w-[95%] max-w-xl  mx-auto  bg-[#faf9ff] shadow-lg px-[30px] md:px-[50px] py-[30px] md:py-[50px] ">
        <div className="text-center mb-5">
          <h1 className="text-3xl font-bold mb-1 color">Log In</h1>
          <p className="text-gray-600">Continue with your email address</p>
        </div>

        {/* Social */}
        <div className="flex flex-col sm:flex-row  gap-1 ">
          <Button
            type="button"
            variant="outline"
            className="flex-1 gap-2 sm:py-5 cursor-pointer font-[400]"
          >
            <FcGoogle className="text-[20px]" />
            Continue with Google
          </Button>

          <Button
            type="button"
            variant="outline"
            className="flex-1 gap-2 sm:py-5  cursor-pointer font-[400]"
          >
            <FaApple className="text-[20px]" />
            Continue with Apple
          </Button>
        </div>

        <div className="flex items-center gap-2 my-3">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-sm text-gray-500">or</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <form onSubmit={handleSignIn} className="space-y-3">
          {/* Email */}
          <div>
            <Label>Email:</Label>
            <div>
              <div className="relative mt-[5px]">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="example@gmail.com"
                  className=" py-5"
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <div>
            <Label>Password:</Label>
            <div className="relative mt-[5px]">
              <Input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="•••••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className=" pr-10 py-5"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5"
              >
                {showPassword ? (
                  <EyeOff className="color" />
                ) : (
                  <Eye className="color" />
                )}
              </button>
            </div>
          </div>

          {/* Remember */}
          <div className="flex items-center justify-between text-sm">
            <Link
              href="/forgot-password"
              className="text-[var(--primary)] font-medium"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}

          <Button
            type="submit"
            className="w-full py-6 bg-[var(--primary)] mt-[10px]"
          >
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-[var(--primary)] font-[400]"
          >
            Sign Up
          </Link>
        </p>
      </div>
    
  );
}
