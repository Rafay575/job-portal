"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import { setUser } from "@/lib/userSlice";

const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least 1 uppercase letter")
      .regex(/[a-z]/, "Must contain at least 1 lowercase letter")
      .regex(/[0-9]/, "Must contain at least 1 number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least 1 special character"),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

type Step = "register" | "otp" ;

export default function RegisterPage() {
  const [registerData, setRegisterData] = useState<RegisterForm | null>(null);
  const [step, setStep] = useState<Step>("register");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [rules, setRules] = useState(false);

  // Keep email in state to send with OTP verify
  const [emailForOtp, setEmailForOtp] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));

  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const { register, handleSubmit, formState, watch } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });
  const router = useRouter();
  const dispatch = useDispatch();

  const { errors } = formState;
  const password = watch("password") || "";

  const passwordRules = useMemo(() => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  const inputBase =
    "h-12 rounded-full px-4 pr-12 border-2 border-primary focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary";

  // --- Mutations ---
  const signupMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/api/register", payload);
      return res.data;
    },

    onSuccess: (_data, variables) => {
      setRegisterData(variables); // 🔥 SAVE NAME + EMAIL + PASSWORD
      setEmailForOtp(variables.email);

      toast.success("OTP sent to your email.");
      setStep("otp");

      setTimeout(() => otpRefs.current?.[0]?.focus(), 50);
    },

    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Signup failed";
      toast.error(msg);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (payload: {
      email: string;
      otp: string;
      name: string;
      password: string;
    }) => {
      const res = await api.post("/api/auth/verify-otp", payload, {
        withCredentials: true,
      });
      return res.data;
    },

    onSuccess: (data) => {
      toast.success("User verified successfully!");

      dispatch(
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          loggedIn: true,
        }),
      );

      router.push("/user/dashboard");
    },

    onError: (err: any) => {
      const msg = err?.response?.data?.message || "OTP verification failed";
      toast.error(msg);
    },
  });

  const onSubmit = (values: RegisterForm) => {
    const result = registerSchema.safeParse(values);

    if (!result.success) {
      setRules(true);
      return;
    }

    signupMutation.mutate({
      ...values,
      name: `${values.firstName} ${values.lastName}`,
    });
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

  const handleOtpKeyDown = (
    idx: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
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

    if (!registerData) {
      toast.error("Missing registration data. Please register again.");
      setStep("register");
      return;
    }

    verifyOtpMutation.mutate({
      email: emailForOtp,
      otp: otpValue,
      name: `${registerData.firstName} ${registerData.lastName}`,
      password: registerData.password,
    });
  };

  const apiUrl = useMemo(() => process.env.NEXT_PUBLIC_API_URL, []);
  const resendMutation = useMutation({
    mutationFn: async (payload: { email: string }) => {
      console.log("making request");
      const res = await api.post("/api/auth/resend-otp", payload);
      console.log("request Sent");
      return res.data;
    },
    onSuccess: () => {
      toast.success("OTP resent successfully");
    },
    onError: (err: any) => {
      console.log("request error");
      toast.error(err?.response?.data?.message || "Failed to resend OTP");
    },
  });
  const [cooldown, setCooldown] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startCooldown = () => {
    setCooldown(20);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  useEffect(() => {
    if (
      passwordRules.length &&
      passwordRules.uppercase &&
      passwordRules.lowercase &&
      passwordRules.number &&
      passwordRules.special
    ) {
      setRules(false);
    }
  }, [password]);

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
              <h1 className="text-[34px] leading-9.5 font-bold text-black">
                Register
              </h1>
            </div>

            <div className="mb-3">
              <p className="text-sm font-semibold text-gray-800">
                Register with email
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              {/* First + Last Name */}
              <div className="grid grid-cols-2 gap-3">
                {/* First Name */}
                <div>
                  <Input
                    type="text"
                    autoComplete="given-name"
                    placeholder="First name"
                    className={`${inputBase} ${
                      errors.firstName ? "border-red-400" : ""
                    }`}
                    {...register("firstName")}
                  />

                  {errors.firstName?.message && (
                    <p className="mt-1 text-xs text-red-500 px-2">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <Input
                    type="text"
                    autoComplete="family-name"
                    placeholder="Last name"
                    className={`${inputBase} ${
                      errors.lastName ? "border-red-400" : ""
                    }`}
                    {...register("lastName")}
                  />

                  {errors.lastName?.message && (
                    <p className="mt-1 text-xs text-red-500 px-2">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
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
                  <p className="mt-1 text-xs text-red-500 px-2">
                    {errors.email.message}
                  </p>
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
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password?.message && (
                  <p className="mt-1 text-xs text-red-500 px-2">
                    {errors.password.message}
                  </p>
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
                    aria-label={
                      showConfirm
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword?.message && (
                  <p className="mt-1 text-xs text-red-500 px-2">
                    {errors.confirmPassword.message}
                  </p>
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
            {/*<div className="flex items-center gap-2 my-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-sm text-gray-500">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>*/}

            {/* Social buttons */}
            {/*<div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 rounded-full border-gray-300 gap-2 font-medium"
                onClick={() => {
                  // window.location.href = `${apiUrl}/auth/google`;
                  toast.success("Google register click");
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
                  toast.success("Apple register click");
                }}
              >
                <FaApple className="text-[20px] text-black" />
                Continue with Apple
              </Button>
            </div>*/}

            {/* Terms */}
            <p className="mt-5 text-[11px] leading-4 text-gray-500">
              By clicking next, you agree to Hayabiu Talent&apos;s{" "}
              <Link href={"/terms-and-conditions"} className="text-primary underline">
                Terms &amp; Conditions{" "}
              </Link>
              and you acknowledge that you have read Hayabiu Talent&apos;s{" "}
              <Link href={"/privacy-policy"} className="text-primary underline">Privacy Policy</Link>{" "}
              which will apply to the processing of your personal data in the
              provision of our services
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
                We sent a 6-digit code to{" "}
                <span className="font-semibold">{emailForOtp}</span>
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
                disabled={cooldown > 0}
                onClick={() => {
                  if (!emailForOtp) return;

                  resendMutation.mutate({ email: emailForOtp });
                  startCooldown();
                }}
                className="text-sm text-gray-600 hover:underline disabled:opacity-50"
              >
                {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
