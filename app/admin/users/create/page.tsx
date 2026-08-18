"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  isApproved: z.enum(["approved", "pending", "rejected"]),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
});

type FormData = z.infer<typeof schema>;

export default function CreateUserPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      isApproved: "approved",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const res = await axios.post("/api/users/create-user", data);
      toast.success(res.data.message);
      router.push("/admin/users");
    } catch (error: any) {
      console.error(error);

      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl p-6">
      <h1 className="text-2xl font-bold mb-6 text-primary">Create User</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1">Full Name</label>
          <input
            {...register("name")}
            className="w-full border rounded px-3 py-1"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full border rounded px-3 py-1"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1">Approval Status</label>

          <select
            {...register("isApproved")}
            className="w-full border rounded px-3 py-2 focus-visible:outline-0"
          >
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>

          {errors.isApproved && (
            <p className="text-red-500 text-sm mt-1">
              {errors.isApproved.message}
            </p>
          )}
        </div>
        {/* Password */}
        <div>
          <label className="block mb-1">Password</label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className="w-full border rounded px-3 py-1 pr-10"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}

          <div className="text-xs text-gray-500 mt-2">
            Password must contain:
            <ul className="list-disc ml-5">
              <li>At least 8 characters</li>
              <li>One uppercase letter (A-Z)</li>
              <li>One lowercase letter (a-z)</li>
              <li>One number (0-9)</li>
              <li>One special character</li>
            </ul>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white px-5 py-2 rounded"
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
}