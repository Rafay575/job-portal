"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Briefcase, Target, DollarSign, MapPinned } from "lucide-react";
import { MapPin, Hash } from "lucide-react";
import { FaGlobe, FaCity } from "react-icons/fa";
import { MdOutlineLocalPhone } from "react-icons/md";
import { LuUserPen } from "react-icons/lu";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

export default function SignUpPage() {
  const [step, setStep] = useState(1);

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [postal, setPostal] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [desiredJob, setDesiredJob] = useState("");
  const [salary, setSalary] = useState("");
  const [salaryType, setSalaryType] = useState("per-annum");
  const [preferedLocation, setPreferedLocation] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [rightToWork, setRightToWork] = useState("no");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation function for all steps
  const validateStep = (): boolean => {
    switch (step) {
      case 1:
        if (!cvFile) {
          toast.error("Please upload your CV");
          return false;
        }
        return true;

      case 2:
        if (!firstName || !lastName || !email || !phone) {
          toast.error("Please enter all the feilds");
          return false;
        }
        if (firstName.length < 2) {
          toast.error("First name must be at least 2 characters");
          return false;
        }
        if (lastName.length < 2) {
          toast.error("Last name must be at least 2 characters");
          return false;
        }
        if (!isValidEmail(email)) {
          toast.error("Please enter a valid email address");
          return false;
        }
        if (!isValidPhone(phone)) {
          toast.error("Please enter a valid phone number");
          return false;
        }
        return true;

      case 3:
        if (!country || !city || !street || !postal) {
          toast.error("Please enter all the feilds");
          return false;
        }
        if (country.length < 2) {
          toast.error("Please enter a valid country");
          return false;
        }
        if (city.length < 2) {
          toast.error("Please enter a valid city");
          return false;
        }
        if (street.length < 3) {
          toast.error("Please enter a valid street address");
          return false;
        }
        if (postal.length < 3) {
          toast.error("Please enter a valid postal code");
          return false;
        }
        return true;

      case 4:
        if (!jobTitle || !desiredJob || !preferedLocation || !salary) {
          toast.error("Please enter all the feilds");
          return false;
        }
        if (jobTitle.length < 2) {
          toast.error("Please enter a valid current job title");
          return false;
        }
        if (desiredJob.length < 2) {
          toast.error("Please enter a valid desired job");
          return false;
        }
        if (preferedLocation.length < 2) {
          toast.error("Please enter a valid preferred location");
          return false;
        }
        if (!isOnlyNumbers(salary)) {
          toast.error("Salary should contain only numbers");
          return false;
        }
        if (!salaryType) {
          toast.error("Please select salary type");
          return false;
        }
        return true;

      case 5:
        if (!password || !confirm) {
          toast.error("Please enter all the feilds");
          return false;
        }
        if (password.length < 8 ) {
          toast.error("Password must be at least 8 characters");
          return false;
        }
        if (password !== confirm) {
          toast.error("Confirm password must match the password");
          return false;
        }
        return true;

      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep()) setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep()) toast.success("Account Created Successfully!");
  };

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone: string) => /^[0-9+]{7,15}$/.test(phone);
  const isOnlyNumbers = (value: string) => /^\d+$/.test(value);

  return (
   
      <div className="relative z-10 w-[95%] max-w-xl  mx-auto  bg-[#faf9ff] shadow-lg px-[30px] md:px-[50px] py-[30px] md:py-[50px] ">
        <h1 className="text-3xl font-bold text-center mb-1 text-primary">Create Account</h1>
        <p className="text-center mb-6">Step {step} of 5</p>

        <form onSubmit={handleSubmit}>
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 "
              style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
            >
              {/* STEP 1 */}
              <div className="min-w-full space-y-3 p-1 flex flex-col grow">
                <Label>
                  Upload CV<span className="text-red-800">*</span>
                </Label>
                <label className="border-2 border-dotted p-6 rounded-lg flex justify-center items-center border-primary gap-2 cursor-pointer grow">
                  <Upload />
                  {cvFile ? cvFile.name : "Upload your CV here"}
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                  />
                </label>

                {/* Or  */}
                <div className="flex items-center gap-2 my-3">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-sm text-gray-500">or</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                {/* Social */}
                <div className="flex flex-col sm:flex-row  gap-1 ">
                  <Button
                    variant="outline"
                    type="button"
                    className="flex-1 gap-2 sm:py-5 cursor-pointer font-[400]"
                  >
                    <FcGoogle className="text-[20px]" />
                    Continue with Google
                  </Button>

                  <Button
                    variant="outline"
                    type="button"
                    className="flex-1 gap-2 sm:py-5  cursor-pointer font-[400]"
                  >
                    <FaApple className="text-[20px]" />
                    Continue with Apple
                  </Button>
                </div>
                <Button
                  type="button"
                  disabled={!handleNext} // only empty check
                  onClick={() => {
                    if (validateStep()) setStep(step + 1); // only go next if valid
                  }}
                >
                  Next
                </Button>
                <p className="text-center text-sm text-gray-600 mt-6">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="text-[var(--primary)] font-[400]"
                  >
                    Login
                  </Link>
                </p>
              </div>

              {/* STEP 2 */}
              <div className="min-w-full space-y-3 p-1 flex flex-col grow">
                <div>
                  <Label>
                    Full Name<span className="text-red-800">*</span>
                  </Label>
                  <div>
                    <div className="relative mt-[5px]">
                      <LuUserPen className="absolute left-3 top-2.5 w-5 h-5 color" />
                      <Input
                        type="text"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="pl-10 py-5"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Label>
                    Last Name<span className="text-red-800">*</span>
                  </Label>
                  <div>
                    <div className="relative mt-[5px]">
                      <LuUserPen className="absolute left-3 top-2.5 w-5 h-5 color" />
                      <Input
                        type="text"
                        placeholder="Richard"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="pl-10 py-5"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Label>
                    Email<span className="text-red-800">*</span>
                  </Label>
                  <div>
                    <div className="relative mt-[5px]">
                      <Mail className="absolute left-3 top-2.5 w-5 h-5 color" />
                      <Input
                        type="email"
                        placeholder="example@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 py-5"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Label>
                    Phone<span className="text-red-800">*</span>
                  </Label>
                  <div>
                    <div className="relative mt-[5px]">
                      <MdOutlineLocalPhone className="absolute left-3 top-2.5 w-5 h-5 color" />
                      <Input
                        type="text"
                        placeholder="+923144644174"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10 py-5"
                      />
                    </div>
                  </div>
                </div>

                <NavButtons />
              </div>

              {/* STEP 3 */}
              <div className="min-w-full space-y-3 p-1 flex flex-col grow">
                {/* Country */}
                <div>
                  <Label>
                    Country<span className="text-red-800">*</span>
                  </Label>

                  <div className="relative mt-[5px]">
                    <FaGlobe className="absolute left-3 top-2.5 w-5 h-5 color" />
                    <Input
                      placeholder="Country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="pl-10 py-5"
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <Label>
                    City<span className="text-red-800">*</span>
                  </Label>

                  <div className="relative mt-[5px]">
                    <FaCity className="absolute left-3 top-2.5 w-5 h-5 color" />
                    <Input
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="pl-10 py-5"
                    />
                  </div>
                </div>

                {/* Street Address */}
                <div>
                  <Label>
                    Street Address<span className="text-red-800">*</span>
                  </Label>

                  <div className="relative mt-[5px]">
                    <MapPin className="absolute left-3 top-2.5 w-5 h-5 color" />
                    <Input
                      placeholder="Street / Area"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="pl-10 py-5"
                    />
                  </div>
                </div>

                {/* Postal Code */}
                <div>
                  <Label>
                    Postal Code<span className="text-red-800">*</span>
                  </Label>

                  <div className="relative mt-[5px]">
                    <Hash className="absolute left-3 top-2.5 w-5 h-5 color" />
                    <Input
                      placeholder="ZIP / Postal Code"
                      value={postal}
                      onChange={(e) => setPostal(e.target.value)}
                      className="pl-10 py-5"
                    />
                  </div>
                </div>

                <NavButtons />
              </div>

              {/* STEP 4 */}
              <div className="min-w-full space-y-3 p-1 flex flex-col grow">
                {/* Current Job */}
                <div>
                  <Label>
                    Current Job<span className="text-red-800">*</span>
                  </Label>

                  <div className="relative mt-[5px]">
                    <Briefcase className="absolute left-3 top-2.5 w-5 h-5 color" />

                    <Input
                      placeholder="Current Job Title"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="pl-10 py-5"
                    />
                  </div>
                </div>

                {/* Desired Job */}
                <div>
                  <Label>
                    Desired Job<span className="text-red-800">*</span>
                  </Label>

                  <div className="relative mt-[5px]">
                    <Target className="absolute left-3 top-2.5 w-5 h-5 color" />

                    <Input
                      placeholder="Desired Job Title"
                      value={desiredJob}
                      onChange={(e) => setDesiredJob(e.target.value)}
                      className="pl-10 py-5"
                    />
                  </div>
                </div>

                {/* Salary */}
                <div>
                  <Label>
                    Salary<span className="text-red-800">*</span>
                  </Label>

                  <div className="flex gap-2 mt-[5px]">
                    {/* Salary Input */}
                    <div className="relative w-2/3">
                      <DollarSign className="absolute left-3 top-2.5 w-5 h-5 color" />

                      <Input
                        placeholder="Expected Salary"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        className="pl-10 py-5"
                      />
                    </div>

                    {/* Salary Type */}
                    <Select value={salaryType} onValueChange={setSalaryType}>
                      <SelectTrigger className="w-1/3 py-5">
                        <SelectValue placeholder="Per annum" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="per-annum">Per Annum</SelectItem>
                        <SelectItem value="per-hour">Per Hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Preferred Location */}
                <div>
                  <Label>
                    Preferred Location<span className="text-red-800">*</span>
                  </Label>

                  <div className="relative mt-[5px]">
                    <MapPinned className="absolute left-3 top-2.5 w-5 h-5 color" />

                    <Input
                      placeholder="Preferred Work Location"
                      value={preferedLocation}
                      onChange={(e) => setPreferedLocation(e.target.value)}
                      className="pl-10 py-5"
                    />
                  </div>
                </div>

                <NavButtons />
              </div>

              {/* STEP 5 */}
              <div className="min-w-full space-y-3 p-1 flex flex-col grow">
                {/* Password */}
                <div>
                  <Label>
                    Password<span className="text-red-800">*</span>
                  </Label>
                  <div className="relative mt-[5px]">
                    <Lock className="absolute left-3 top-2.5 w-5 h-5 color" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="•••••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 py-5"
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
                {/* Confirm Password */}
                <div>
                  <Label>
                    Confirm Password<span className="text-red-800">*</span>
                  </Label>
                  <div className="relative mt-[5px]">
                    <Lock className="absolute left-3 top-2.5 w-5 h-5 color" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="•••••••••••••••"
                      autoComplete="new-password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className="pl-10 pr-10 py-5"
                      onPaste={(e) => e.preventDefault()}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-2.5"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="color" />
                      ) : (
                        <Eye className="color" />
                      )}
                    </button>
                  </div>
                </div>
                {/* Right to work */}
                <div>
                  <Label>
                    Do you have the right to work in the UK?
                    <span className="text-red-800">*</span>
                  </Label>

                  <RadioGroup
                    value={rightToWork}
                    onValueChange={setRightToWork}
                    defaultValue="no"
                    className="mt-2"
                  >
                    <div className="flex items-center gap-3 border py-2 px-3 rounded-[7px] shadow ">
                      <RadioGroupItem value="citizenship" id="r1" />
                      <Label
                        htmlFor="r1"
                        className="font-normal leading-snug -mt-0.5 border-l-2 pl-2"
                      >
                        Yes, I have via UK/Irish citizenship, EU settlement
                        scheme / indefinite leave to remain
                      </Label>
                    </div>

                    <div className="flex items-center gap-3 border py-2 px-3 rounded-[7px] shadow">
                      <RadioGroupItem value="visa" id="r2" />
                      <Label
                        htmlFor="r2"
                        className="font-normal leading-snug -mt-0.5 border-l-2 pl-2 "
                      >
                        Yes, I hold a valid visa with the right to work in the
                        UK
                      </Label>
                    </div>

                    <div className="flex items-center gap-3 border py-2 px-3 rounded-[7px] shadow ">
                      <RadioGroupItem value="no" id="r3" />
                      <Label
                        htmlFor="r3"
                        className="font-normal leading-snug-mt-0.5 border-l-2 pl-2"
                      >
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex gap-2 mt-auto">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setStep(step - 1)}
                  >
                    Back
                  </Button>
                  <Button
                    disabled={!handleNext}
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      if (validateStep()) handleSubmit(e);
                    }}
                  >
                    Create Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
  
  );

  function NavButtons() {
    return (
      <div className="flex gap-2 mt-auto">
        {/* Back button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={step === 1} // Prevent going back on Step 1
        >
          Back
        </Button>

        {/* Next button */}
        <Button
          type="button"
          disabled={!handleNext} // Basic check to enable button
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    );
  }
}
