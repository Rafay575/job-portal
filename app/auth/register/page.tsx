"use client";

import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

type Step = "register" | "otp" | "done";

export default function RegisterPage() {
  const [step, setStep] = useState<Step>("register");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Keep email in state to send with OTP verify
  const [emailForOtp, setEmailForOtp] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));

  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const { register, handleSubmit, formState } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    mode: "onSubmit",
  });

  const { errors } = formState;

  const inputBase =
    "h-12 rounded-full px-4 pr-12 border-2 border-primary focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary";

  // --- Mutations ---
  const signupMutation = useMutation({
    mutationFn: async (payload: RegisterForm) => {
      const res = await api.post("/auth/signup", payload);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      setEmailForOtp(variables.email);
      toast.success("OTP sent to your email.");
      setStep("otp");
      // focus first otp box
      setTimeout(() => otpRefs.current?.[0]?.focus(), 50);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || "Signup failed";
      toast.error(msg);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (payload: { email: string; otp: string }) => {
      const res = await api.post("/auth/verify-otp", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Verified! 🎉");
      setStep("done");
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || "OTP verification failed";
      toast.error(msg);
    },
  });

  const onSubmit = (values: RegisterForm) => {
    console.log("Register submit:", values);
    signupMutation.mutate(values);
  };

  // --- OTP helpers ---
  const otpValue = otp.join("");

  const setOtpAt = (idx: number, val: string) => {
    setOtp((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  };

  const handleOtpChange = (idx: number, raw: string) => {
    const v = raw.replace(/\D/g, ""); // digits only
    if (!v) {
      setOtpAt(idx, "");
      return;
    }

    // If user pastes multiple digits into one box
    const chars = v.split("").slice(0, 6 - idx);
    setOtp((prev) => {
      const next = [...prev];
      for (let i = 0; i < chars.length; i++) next[idx + i] = chars[i];
      return next;
    });

    const nextIndex = Math.min(idx + chars.length, 5);
    setTimeout(() => otpRefs.current?.[nextIndex]?.focus(), 0);
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (otp[idx]) {
        setOtpAt(idx, "");
        return;
      }
      if (idx > 0) {
        otpRefs.current?.[idx - 1]?.focus();
        setOtpAt(idx - 1, "");
      }
    }

    if (e.key === "ArrowLeft" && idx > 0) otpRefs.current?.[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < 5) otpRefs.current?.[idx + 1]?.focus();
  };

  const submitOtp = () => {
    if (otpValue.length !== 6) {
      toast.error("Please enter 6-digit OTP");
      return;
    }
    verifyOtpMutation.mutate({ email: emailForOtp, otp: otpValue });
  };

  const apiUrl = useMemo(() => process.env.NEXT_PUBLIC_API_URL, []);

  return (
    <div className="relative z-10 w-[95%] max-w-2xl mx-auto px-5.5 py-7 overflow-hidden">
      <AnimatePresence mode="wait">
        {/* STEP 1: REGISTER */}
        {step === "register" && (
          <motion.div
            key="register"
            initial={{ x: 0, opacity: 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -80, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {/* Top pills */}
            <div className="flex items-center gap-3 mb-7">
              <Link
                href="/auth/login"
                className="flex-1 rounded-full border border-gray-300 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Sign in
              </Link>

              <div className="flex-1 rounded-full bg-primary py-2 text-center text-sm font-medium text-white">
                Register
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-5">
              <h1 className="text-[34px] leading-9.5 font-bold text-black">Register</h1>
            </div>

            <div className="mb-3">
              <p className="text-sm font-semibold text-gray-800">Register with email</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              {/* Name */}
              <div>
                <Input
                  type="text"
                  autoComplete="name"
                  placeholder="Full name"
                  className={`${inputBase} ${errors.name ? "border-red-400" : ""}`}
                  {...register("name")}
                />
                {errors.name?.message && (
                  <p className="mt-1 text-xs text-red-500 px-2">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="Email address"
                  className={`${inputBase} ${errors.email ? "border-red-400" : ""}`}
                  {...register("email")}
                />
                {errors.email?.message && (
                  <p className="mt-1 text-xs text-red-500 px-2">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Password"
                    className={`${inputBase} ${errors.password ? "border-red-400" : ""}`}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password?.message && (
                  <p className="mt-1 text-xs text-red-500 px-2">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <div className="relative">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Confirm password"
                    className={`${inputBase} ${errors.confirmPassword ? "border-red-400" : ""}`}
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                    aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword?.message && (
                  <p className="mt-1 text-xs text-red-500 px-2">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={signupMutation.isPending}
                className="w-full h-12 rounded-full bg-primary hover:bg-primary/90"
              >
                {signupMutation.isPending ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Please wait...
                  </span>
                ) : (
                  "Next"
                )}
              </Button>
            </form>

            {/* Or */}
            <div className="flex items-center gap-2 my-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-sm text-gray-500">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Social buttons */}
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 rounded-full border-gray-300 gap-2 font-medium"
                onClick={() => {
                  // window.location.href = `${apiUrl}/auth/google`;
                  toast.info("Google register click");
                }}
              >
                <FcGoogle className="text-[20px]" />
                Continue with Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 rounded-full border-gray-300 gap-2 font-medium"
                onClick={() => {
                  toast.info("Apple register click");
                }}
              >
                <FaApple className="text-[20px] text-black" />
                Continue with Apple
              </Button>
            </div>

            {/* Terms */}
            <p className="mt-5 text-[11px] leading-4 text-gray-500">
              By clicking next, you agree to Hayabiu Talent&apos;s{" "}
              <Link href="/terms" className="text-primary underline">
                Terms &amp; Conditions
              </Link>{" "}
              and you acknowledge that you have read Hayabiu Talent&apos;s{" "}
              <Link href="/privacy" className="text-primary underline">
                Privacy Policy
              </Link>{" "}
              which will apply to the processing of your personal data in the provision of our services
            </p>
          </motion.div>
        )}

        {/* STEP 2: OTP */}
        {step === "otp" && (
          <motion.div
            key="otp"
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -80, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-[28px] leading-9 font-bold text-black text-center">
                Verify OTP
              </h2>
              <p className="text-center text-sm text-gray-600 mt-2">
                We sent a 6-digit code to <span className="font-semibold">{emailForOtp}</span>
              </p>
            </div>

            {/* OTP Inputs */}
            <div className="flex justify-center gap-2 mb-5">
              {otp.map((digit, idx) => (
                <Input
                  key={idx}
                  ref={(el) => {
                    otpRefs.current[idx] = el;
                  }}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  inputMode="numeric"
                  maxLength={6}
                  className="h-12 w-12 text-center text-lg font-semibold rounded-xl border-2 border-primary focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary"
                />
              ))}
            </div>

            {/* Verify button */}
            <Button
              type="button"
              onClick={submitOtp}
              disabled={verifyOtpMutation.isPending}
              className="w-full h-12 rounded-full bg-primary hover:bg-primary/90"
            >
              {verifyOtpMutation.isPending ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying...
                </span>
              ) : (
                "Verify"
              )}
            </Button>

            {/* Back */}
            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={() => setStep("register")}
                className="text-sm text-primary hover:underline"
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => {
                  setOtp(Array(6).fill(""));
                  setTimeout(() => otpRefs.current?.[0]?.focus(), 50);
                  toast.info("Please check your email for the latest OTP.");
                }}
                className="text-sm text-gray-600 hover:underline"
              >
                Didn’t get code?
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: DONE */}
        {step === "done" && (
          <motion.div
            key="done"
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="text-center"
          >
            <h2 className="text-[28px] leading-9 font-bold text-black">
              Thank you for registering
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Your email is verified and your account is ready.
            </p>

            <Button
              className="mt-6 w-full h-12 rounded-full bg-primary hover:bg-primary/90"
              onClick={() => {
                // go to login or dashboard
                // router.push("/auth/login");
                window.location.href = "/auth/login";
              }}
            >
              Go to Sign in
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
