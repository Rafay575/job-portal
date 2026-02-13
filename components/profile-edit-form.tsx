"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Briefcase,
  Target,
  DollarSign,
  MapPinned,
  Mail,
  Hash,
  MapPin,
  Lock,
} from "lucide-react";
import { FaGlobe, FaCity } from "react-icons/fa";
import { MdOutlineLocalPhone } from "react-icons/md";
import { LuUserPen } from "react-icons/lu";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
export default function ProfileEditForm() {
  const [firstName, setFirstName] = useState("Abdullah");
  const [lastName, setLastName] = useState("Khan");
  const [email, setEmail] = useState("abdullah@gmail.com");
  const [phone, setPhone] = useState("+923144644174");

  const [country, setCountry] = useState("UK");
  const [city, setCity] = useState("London");
  const [street, setStreet] = useState("Oxford Street");
  const [postal, setPostal] = useState("E1 6AN");

  const [jobTitle, setJobTitle] = useState("Frontend Dev");
  const [desiredJob, setDesiredJob] = useState("React Developer");
  const [salary, setSalary] = useState("50000");
  const [preferedLocation, setPreferedLocation] = useState("Remote");

  const [rightToWork, setRightToWork] = useState("citizenship");

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSave = () => {
    const payload = {
      firstName,
      lastName,
      email,
      phone,
      country,
      city,
      street,
      postal,
      jobTitle,
      desiredJob,
      salary,
      preferedLocation,
      rightToWork,
      currentPassword,
      newPassword,
      confirmPassword,
    };

    console.log(payload);
    toast.success("Profile Updated Successfully");
  };

  return (
    <div className="w-full bg-white rounded-xl p-6 space-y-8">
      <Section title="Personal Information">
        <ThreeCol>
          <Field
            label="First Name"
            icon={<LuUserPen className="text-[20px]" />}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Field
            label="Last Name"
            icon={<LuUserPen className="text-[20px]" />}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <Field
            label="Email"
            icon={<Mail />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Field
            label="Phone"
            icon={<MdOutlineLocalPhone className="text-[20px]" />}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </ThreeCol>
      </Section>
      <hr />

      <Section title="Address">
        <ThreeCol>
          <Field
            label="Country"
            icon={<FaGlobe className="text-[20px]" />}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <Field
            label="City"
            icon={<FaCity className="text-[20px]" />}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <Field
            label="Street"
            icon={<MapPin />}
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
          <Field
            label="Postal Code"
            icon={<Hash />}
            value={postal}
            onChange={(e) => setPostal(e.target.value)}
          />
        </ThreeCol>
      </Section>
      <hr />

      <Section title="Job Preferences">
        <ThreeCol>
          <Field
            label="Current Job"
            icon={<Briefcase />}
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
          <Field
            label="Desired Job"
            icon={<Target />}
            value={desiredJob}
            onChange={(e) => setDesiredJob(e.target.value)}
          />
          <Field
            label="Salary"
            icon={<DollarSign />}
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
          <Field
            label="Preferred Location"
            icon={<MapPinned />}
            value={preferedLocation}
            onChange={(e) => setPreferedLocation(e.target.value)}
          />
        </ThreeCol>
      </Section>
      <hr />

      <Section title="Right to Work">
        <div>
          <Label>Do you have the right to work in the UK?</Label>

          <RadioGroup
            value={rightToWork}
            onValueChange={setRightToWork}
            defaultValue="no"
            className="mt-2"
          >
            <div className="flex items-center gap-3 border py-2 px-3 rounded-[7px] shadow ">
              <RadioGroupItem value="citizenship" id="r1"></RadioGroupItem>
              <Label
                htmlFor="r1"
                className="font-normal leading-snug -mt-0.5 border-l-2 pl-2"
              >
                Yes, I have via UK/Irish citizenship, EU settlement scheme /
                indefinite leave to remain
              </Label>
            </div>

            <div className="flex items-center gap-3 border py-2 px-3 rounded-[7px] shadow">
              <RadioGroupItem value="visa" id="r2" />
              <Label
                htmlFor="r2"
                className="font-normal leading-snug -mt-0.5 border-l-2 pl-2 "
              >
                Yes, I hold a valid visa with the right to work in the UK
              </Label>
            </div>

            <div className="inline-flex items-center gap-3 border py-2 px-3 rounded-[7px] shadow ">
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
      </Section>

      <Button onClick={handleSave}>Save Changes</Button>
      <hr />

      {/* Change Password Section */}
      <Section title="Change Password">
        <ThreeCol>
          <PasswordField
            label="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            show={showCurrent}
            toggleShow={() => setShowCurrent(!showCurrent)}
          />
          <PasswordField
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            show={showNew}
            toggleShow={() => setShowNew(!showNew)}
          />
          <PasswordField
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            show={showConfirm}
            toggleShow={() => setShowConfirm(!showConfirm)}
          />
        </ThreeCol>
      </Section>

      <Button onClick={handleSave}>Save Password</Button>
    </div>
  );
}

/* helpers */

function Section({ title, children }: any) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-6">{title}</h2>
      {children}
    </div>
  );
}

function ThreeCol({ children }: any) {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">{children}</div>
  );
}

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
}

function Field({ label, icon, ...props }: FieldProps) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative mt-1">
        <span className="absolute left-3 top-2.5 text-primary">{icon}</span>
        <Input className="pl-10 py-5" {...props} />
      </div>
    </div>
  );
}
interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  show: boolean;
  toggleShow: () => void;
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  toggleShow,
}: PasswordFieldProps) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative mt-1">
        <button type="button" className="absolute left-3 top-2.5 text-primary">
          <Lock />
        </button>
        <Input
          type={show ? "text" : "password"}
          placeholder="•••••••••••••••"
          className="px-10 py-5"
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          onClick={toggleShow}
          className="absolute right-3 top-2.5 text-primary"
        >
          {show ? <EyeOff /> : <Eye />}
        </button>
      </div>
    </div>
  );
}
