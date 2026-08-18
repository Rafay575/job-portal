"use client";

import { useEffect, useState } from "react";
import { getUserById, updateProfile, verifyUpdateOtp } from "@/lib/Profile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Loader2, Pencil, Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { setUser } from "@/lib/userSlice";

const validatePassword = (password: string) => {
  const errors: string[] = [];
  if (password.length < 8) {
    errors.push("At least 8 characters required");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("At least 1 uppercase letter required");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("At least 1 lowercase letter required");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("At least 1 number required");
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("At least 1 special character required");
  }

  return errors;
};

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [editType, setEditType] = useState<
    "name" | "email" | "password" | null
  >(null);

  const [value, setValue] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"edit" | "otp">("edit");
  const [submitting, setSubmitting] = useState(false);
  // fetch user
  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await getUserById(user.id);
      if (res.success) setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchUser();
  }, [user]);

  const syncUser = async () => {
    const res = await getUserById(user.id);
    if (res.success) {
      setData(res.data);
      dispatch(
        setUser({
          ...user,
          name: res.data.name,
          email: res.data.email,
        }),
      );
    }
    return res;
  };

  const handleUpdate = async () => {
    if (!editType) return;

    // ❌ validate password before API call
    if (editType === "password") {
      const errors = validatePassword(value);
      if (errors.length > 0) {
        setPasswordErrors(errors);
        return;
      }
    }

    setSubmitting(true);

    try {
      await updateProfile({
        userId: user.id,
        type: editType,
        value,
        email: data.email,
      });

      if (editType === "name") {
        await syncUser();
        setEditType(null);
        setValue("");
      } else {
        setStep("otp");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // verify otp
  const handleVerify = async () => {
    setSubmitting(true);

    try {
      await verifyUpdateOtp({
        userId: user.id,
        email: data.email,
        otp,
        type: editType as "email" | "password",
      });

      setStep("edit");
      setEditType(null);
      setOtp("");
      setValue("");
     await syncUser();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Profile
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage your account information
        </p>
      </div>

      {/* PROFILE CARD */}
      <div className="rounded-2xl border bg-white shadow-sm p-5 space-y-4">
        {/* NAME */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-muted-foreground">Name</p>
            <p className="font-semibold">{data?.name}</p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditType("name");
              setValue(data.name);
              setStep("edit");
            }}
          >
            <Pencil size={16} />
          </Button>
        </div>

        {/* EMAIL */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="font-semibold">{data?.email}</p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditType("email");
              setValue("");
              setStep("edit");
            }}
          >
            <Pencil size={16} />
          </Button>
        </div>

        {/* PASSWORD */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-muted-foreground">Password</p>
            <p className="font-semibold">••••••••</p>
          </div>
          <div className="flex gap-2 items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditType("password");
                setValue("");
                setStep("edit");
              }}
            >
              <Pencil size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* EDIT CARD */}
      {editType && (
        <div className="rounded-2xl border bg-white shadow-sm p-5 space-y-4">
          <div>
            <p className="text-sm font-medium">Update {editType}</p>
            <p className="text-xs text-muted-foreground">
              Enter new {editType} below
            </p>
          </div>

          {/* EDIT STEP */}
          {step === "edit" && (
            <div className="space-y-3">
              <Input
                type={editType === "password" ? "password" : "text"}
                placeholder={`New ${editType}`}
                value={value}
                onChange={(e) => {
                  const val = e.target.value;
                  setValue(val);

                  if (editType === "password") {
                    setPasswordErrors(validatePassword(val));
                  }
                }}
              />
              {editType === "password" && passwordErrors.length > 0 && (
                <div className="text-sm text-red-500 space-y-1">
                  {passwordErrors.map((err, i) => (
                    <p key={i}>• {err}</p>
                  ))}
                </div>
              )}

              <Button
                className="w-full"
                onClick={handleUpdate}
                disabled={
                  submitting ||
                  (editType === "password" && passwordErrors.length > 0)
                }
              >
                {submitting ? "Processing..." : "Continue"}
              </Button>
            </div>
          )}

          {/* OTP STEP */}
          {step === "otp" && (
            <div className="space-y-3">
              <Input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <Button
                className="w-full"
                onClick={handleVerify}
                disabled={submitting}
              >
                {submitting ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
