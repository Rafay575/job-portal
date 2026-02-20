"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { api, setAuthToken } from "@/lib/axios";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// -------------------- Schemas --------------------
const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
type SignInForm = z.infer<typeof signInSchema>;

const forgotSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});
type ForgotForm = z.infer<typeof forgotSchema>;

const resetSchema = z
  .object({
    otp: z
      .string()
      .min(6, "OTP must be 6 digits")
      .max(6, "OTP must be 6 digits"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type ResetForm = z.infer<typeof resetSchema>;

type Mode = "signin" | "forgot_email" | "forgot_reset" | "forgot_done";

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // store email for forgot flow
  const [forgotEmail, setForgotEmail] = useState("");

  const loginMutation = useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const res = await api.post("/auth/login", payload);
      return res.data;
    },
    onSuccess: (data) => {
      // backend token key can be: token, accessToken, data.token etc.
      const token =
        data?.token ||
        data?.accessToken ||
        data?.data?.token ||
        data?.data?.accessToken;

      if (!token) {
        toast.error("Login success but token not found in response.");
        return;
      }

      // Store token
      localStorage.setItem("token", token);

      // Set axios header for future requests
      setAuthToken(token);

      toast.success("Login successful!");
      router.push("/admin/dashboard");
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message || err?.message || "Login failed";
      toast.error(msg);
    },
  });

  const inputBase =
    "h-12 rounded-full px-4 pr-12 border-2 border-primary focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary";

  // -------------------- Forms --------------------
  const signInForm = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const forgotForm = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
    mode: "onSubmit",
  });

  const resetForm = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
    defaultValues: { otp: "", password: "", confirmPassword: "" },
    mode: "onSubmit",
  });

  // -------------------- Mutations --------------------
  const forgotMutation = useMutation({
    mutationFn: async (payload: { email: string }) => {
      const res = await api.post("/auth/forgot-password", payload);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      setForgotEmail(variables.email);
      toast.success("If the email exists, an OTP has been sent.");
      setMode("forgot_reset");
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to send OTP";
      toast.error(msg);
    },
  });

  const resetMutation = useMutation({
    mutationFn: async (payload: {
      email: string;
      otp: string;
      password: string;
      confirmPassword: string;
    }) => {
      const res = await api.post("/auth/reset-password", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Password reset successful!");
      setMode("forgot_done");
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message || err?.message || "Reset password failed";
      toast.error(msg);
    },
  });

  // -------------------- Handlers --------------------
  const onSignIn = async (values: SignInForm) => {
    console.log("Sign In:", values);
    loginMutation.mutate(values);
  };

  const onForgotEmail = async (values: ForgotForm) => {
    console.log("Forgot Password (email):", values);
    forgotMutation.mutate(values);
  };

  const onResetPassword = async (values: ResetForm) => {
    const payload = {
      email: forgotEmail,
      otp: values.otp,
      password: values.password,
      confirmPassword: values.confirmPassword,
    };
    console.log("Reset Password:", payload);
    resetMutation.mutate(payload);
  };

  // -------------------- UI --------------------
  return (
    <div className="relative z-10 w-[95%] max-w-2xl mx-auto px-5.5 py-7 overflow-hidden">
      <AnimatePresence mode="wait">
        {/* ===================== SIGN IN ===================== */}
        {mode === "signin" && (
          <motion.div
            key="signin"
            initial={{ x: 0, opacity: 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -80, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {/* Top pills */}
            <div className="flex items-center gap-3 mb-7">
              <div className="flex-1 rounded-full bg-primary py-2 text-center text-sm font-medium text-white">
                Sign in
              </div>

              <Link
                href="/auth/register"
                className="flex-1 rounded-full border border-gray-300 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Register
              </Link>
            </div>

            {/* Title */}
            <div className="text-center mb-5">
              <h1 className="text-[34px] leading-9.5 font-bold text-black">
                Sign in
              </h1>
            </div>

            <div className="mb-3">
              <p className="text-sm font-semibold text-gray-800">
                Sign in with email
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={signInForm.handleSubmit(onSignIn)}
              className="space-y-3"
            >
              {/* Email */}
              <div>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="Email address"
                  className={`${inputBase} ${signInForm.formState.errors.email ? "border-red-400" : ""}`}
                  {...signInForm.register("email")}
                />
                {signInForm.formState.errors.email?.message && (
                  <p className="mt-1 text-xs text-red-500 px-2">
                    {signInForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Password"
                    className={`${inputBase} ${signInForm.formState.errors.password ? "border-red-400" : ""}`}
                    {...signInForm.register("password")}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {signInForm.formState.errors.password?.message && (
                  <p className="mt-1 text-xs text-red-500 px-2">
                    {signInForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Forgot Password */}
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => {
                    forgotForm.reset();
                    setMode("forgot_email");
                  }}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full h-12 rounded-full bg-primary hover:bg-primary/90"
              >
                {loginMutation.isPending ? (
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
                  toast.info("Google sign in click");
                }}
              >
                <FcGoogle className="text-[20px]" />
                Sign in with Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 rounded-full border-gray-300 gap-2 font-medium"
                onClick={() => {
                  toast.info("Apple sign in click");
                }}
              >
                <FaApple className="text-[20px] text-black" />
                Sign in with Apple
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
              which will apply to the processing of your personal data in the
              provision of our services
            </p>
          </motion.div>
        )}

        {/* ===================== FORGOT: EMAIL ===================== */}
        {mode === "forgot_email" && (
          <motion.div
            key="forgot_email"
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -80, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <div className="mb-6 text-center">
              <h2 className="text-[28px] leading-9 font-bold text-black">
                Forgot Password
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Enter your email to receive an OTP
              </p>
            </div>

            <form
              onSubmit={forgotForm.handleSubmit(onForgotEmail)}
              className="space-y-3"
            >
              <div>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="Email address"
                  className={`${inputBase} ${forgotForm.formState.errors.email ? "border-red-400" : ""}`}
                  {...forgotForm.register("email")}
                />
                {forgotForm.formState.errors.email?.message && (
                  <p className="mt-1 text-xs text-red-500 px-2">
                    {forgotForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={forgotMutation.isPending}
                className="w-full h-12 rounded-full bg-primary hover:bg-primary/90"
              >
                {forgotMutation.isPending ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </form>

            <div className="mt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="text-sm text-primary hover:underline"
              >
                Back
              </button>
            </div>
          </motion.div>
        )}

        {/* ===================== FORGOT: OTP + NEW PASS ===================== */}
        {mode === "forgot_reset" && (
          <motion.div
            key="forgot_reset"
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -80, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <div className="mb-6 text-center">
              <h2 className="text-[28px] leading-9 font-bold text-black">
                Reset Password
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Enter the OTP sent to{" "}
                <span className="font-semibold">{forgotEmail}</span>
              </p>
            </div>

            <form
              onSubmit={resetForm.handleSubmit(onResetPassword)}
              className="space-y-3"
            >
              {/* OTP */}
              <div>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="6-digit OTP"
                  className={`${inputBase} ${resetForm.formState.errors.otp ? "border-red-400" : ""}`}
                  {...resetForm.register("otp")}
                />
                {resetForm.formState.errors.otp?.message && (
                  <p className="mt-1 text-xs text-red-500 px-2">
                    {resetForm.formState.errors.otp.message}
                  </p>
                )}
              </div>

              {/* New password */}
              <div>
                <div className="relative">
                  <Input
                    type={showNewPass ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="New password"
                    className={`${inputBase} ${resetForm.formState.errors.password ? "border-red-400" : ""}`}
                    {...resetForm.register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                    aria-label={showNewPass ? "Hide password" : "Show password"}
                  >
                    {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {resetForm.formState.errors.password?.message && (
                  <p className="mt-1 text-xs text-red-500 px-2">
                    {resetForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <div className="relative">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Confirm password"
                    className={`${inputBase} ${resetForm.formState.errors.confirmPassword ? "border-red-400" : ""}`}
                    {...resetForm.register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                    aria-label={
                      showConfirm
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {resetForm.formState.errors.confirmPassword?.message && (
                  <p className="mt-1 text-xs text-red-500 px-2">
                    {resetForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={resetMutation.isPending}
                className="w-full h-12 rounded-full bg-primary hover:bg-primary/90"
              >
                {resetMutation.isPending ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>

            <div className="mt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setMode("forgot_email")}
                className="text-sm text-primary hover:underline"
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!forgotEmail) return;
                  forgotMutation.mutate({ email: forgotEmail });
                }}
                className="text-sm text-gray-600 hover:underline"
              >
                Resend OTP
              </button>
            </div>
          </motion.div>
        )}

        {/* ===================== DONE ===================== */}
        {mode === "forgot_done" && (
          <motion.div
            key="forgot_done"
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="text-center"
          >
            <h2 className="text-[28px] leading-9 font-bold text-black">
              Password Updated
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Your password has been reset successfully.
            </p>

            <Button
              className="mt-6 w-full h-12 rounded-full bg-primary hover:bg-primary/90"
              onClick={() => {
                setMode("signin");
                resetForm.reset();
                forgotForm.reset();
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
