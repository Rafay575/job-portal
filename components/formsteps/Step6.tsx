import React, { useMemo, useRef, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { UploadCloud, Trash2, Eye } from "lucide-react";
import { Step6Type } from "@/types/Form";
import { submitStep6, getStep6 } from "@/lib/api/step6";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { FullPageLoader } from "../Loading";
import { useRouter } from "next/navigation";
import { checkApproval } from "@/lib/users";
import { IoRefresh } from "react-icons/io5";
import Link from "next/link";

type NavProps = {
  onNext: () => void;
  onBack: () => void;
  disableBack?: boolean;
};

type Props = {
  next: () => void;
  back: () => void;
};

type DocCardProps = {
  title: string;
  fieldKey: keyof Step6Type;
  hint?: string;
  file: File | string | null;
  onUpdate: (key: keyof Step6Type, file: File | string | null) => void;
};

const MAX_MB = 5;
const MAX_BYTES = MAX_MB * 1024 * 1024;
const ACCEPTED = [".pdf", ".jpg", ".jpeg", ".png", ".docx", ".doc"];

function formatBytes(bytes: number) {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
}

function isImageFile(file: File) {
  return file.type.startsWith("image/");
}

function isPdfFile(file: File) {
  return file.type === "application/pdf";
}

function isImageUrl(url: string) {
  return /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url);
}

function checkFile(file: File): boolean {
  const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
  if (!ACCEPTED.includes(ext)) {
    toast.error(`Invalid file type. Allowed: ${ACCEPTED.join(", ")}`);
    return false;
  }
  if (file.size > MAX_BYTES) {
    toast.error(`File must be less than ${MAX_MB}MB`);
    return false;
  }
  return true;
}

// ✅ DocCard is defined OUTSIDE the parent component to avoid remounting on every render
function DocCard({ title, fieldKey, hint, file, onUpdate }: DocCardProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const previewUrl = useMemo(() => {
    if (!file) return null;
    if (typeof file === "string") return file; // from DB
    return URL.createObjectURL(file); // new local file
  }, [file]);

  useEffect(() => {
    return () => {
      // Only revoke object URLs we created (not DB string URLs)
      if (file instanceof File && previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, file]);

  const onPick = () => inputRef.current?.click();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!checkFile(f)) return;
    onUpdate(fieldKey, f);
    e.target.value = ""; // allow re-selecting the same file
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    if (!checkFile(f)) return;
    onUpdate(fieldKey, f);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const remove = () => onUpdate(fieldKey, null);

  const openPreview = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent triggering the drop zone click
    if (!previewUrl) return;
    window.open(previewUrl, "_blank", "noopener,noreferrer");
  };

  // Determine display states
  const isExistingUrl = typeof file === "string";
  const isNewFile = file instanceof File;
  const showInlineImagePreview =
    previewUrl &&
    ((isNewFile && isImageFile(file as File)) ||
      (isExistingUrl && isImageUrl(file as string)));
  const showPdfNote =
    previewUrl &&
    ((isNewFile && isPdfFile(file as File)) ||
      (isExistingUrl && (file as string).toLowerCase().includes(".pdf")));

  return (
    <div className="rounded-lg md:rounded-2xl bg-white p-4 border !max-w-full !overflow-x-hidden ">
      <div className="flex items-start justify-between gap-2">
        <div>
          <Label className="text-md font-semibold text-primary">
            {title} <span className="text-red-500">*</span>
          </Label>
          {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
        </div>

        {file && (
          <Button
            type="button"
            variant="ghost"
            onClick={remove}
            className="gap-2 text-destructive hover:text-destructive shrink-0"
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </Button>
        )}
      </div>

      {/* Drop zone */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onClick={onPick}
        className={[
          "mt-3 rounded-xl border border-dashed p-4 cursor-pointer",
          "hover:bg-muted/30 transition",
          file ? "bg-muted/20" : "bg-white",
        ].join(" ")}
      >
        {!file ? (
          <div className="flex items-center gap-3">
            <div className=" rounded-xl border flex items-center justify-center">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">
                Drag & drop your file here, or click to upload
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col xl:flex-row items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">
                {isExistingUrl ? "Uploaded document" : (file as File).name}
              </p>

              {isNewFile && (
                <p className="text-xs text-muted-foreground mt-1">
                  {formatBytes((file as File).size)} •{" "}
                  {(file as File).type || "file"}
                </p>
              )}

              {/* ✅ "Saved" badge for existing DB documents */}
              {isExistingUrl && (
                <p className="text-xs text-primary font-medium mt-1">
                  ✓ Previously uploaded
                </p>
              )}
            </div>

            <div
              className="flex gap-2 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onPick}
                className="text-primary border !border-primary "
              >
                Replace
              </Button>
              {/* ✅ View button always shown when a file/URL exists */}
              {previewUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={openPreview}
                  className="gap-1.5 text-primary border !border-primary "
                >
                  <Eye className="h-4 w-4" />
                  View
                </Button>
              )}
            </div>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,application/pdf,.docx,.doc"
          className="hidden"
          onChange={onChange}
        />
      </div>

      {/* Inline image preview — works for both new File and existing string URL */}
      {showInlineImagePreview && (
        <div className="mt-3">
          <div className="rounded-xl border overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl!}
              alt={`${title} preview`}
              className="w-full h-48 object-cover"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Image preview shown above. Click "View" to open full size.
          </p>
        </div>
      )}
    </div>
  );
}

function SignupNavButtons({ onNext, onBack, disableBack }: NavProps) {
  return (
    <div className="flex gap-2 mt-3 justify-between">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        disabled={disableBack}
      >
        <IoIosArrowBack />
        Back
      </Button>

      <Button type="button" onClick={onNext}>
        Next
        <IoIosArrowForward />
      </Button>
    </div>
  );
}

export default function Step6({ next, back }: Props) {
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const [blur, setBlur] = useState(false);

  const [documents, setDocuments] = useState<Step6Type>({
    passport: null,
    drivingLicenceFront: null,
    drivingLicenceBack: null,
    proofId1: null,
    proofId2: null,
  });

  const router = useRouter();
  useEffect(() => {
    const verifyUser = async () => {
      if (!user.id) {
        toast.error("Id not found  ");
        router.push("/");
        return;
      }
      const isApproved = await checkApproval(user.id);

      if (!isApproved) {
        setBlur(true);
      }
    };

    verifyUser();
    const fetchStep6 = async () => {
      if (!user.id) {
        toast.error("Id not found in useEffect");
        return;
      }
      setLoading(true);
      const res = await getStep6(user.id);
      if (res.success && res.data?.[0]) {
        const d = res.data[0];
        setDocuments({
          passport: d.passport || null,
          drivingLicenceFront: d.driving_licence_front || null,
          drivingLicenceBack: d.driving_licence_back || null,
          proofId1: d.proof_id1 || null,
          proofId2: d.proof_id2 || null,
        });
      }
      setLoading(false);
    };
    fetchStep6();
  }, []);

  const updateDoc = (key: keyof Step6Type, file: File | string | null) => {
    setDocuments((prev) => ({ ...prev, [key]: file }));
  };

  const validateStep = (): boolean => {
    if (
      !documents.passport ||
      !documents.drivingLicenceFront ||
      !documents.drivingLicenceBack ||
      !documents.proofId1 ||
      !documents.proofId2
    ) {
      toast.error("Please upload all required documents");
      return false;
    }
    return true;
  };

  const handleSubmitStep6 = async () => {
    if (!validateStep()) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("userId", String(user.id));

      if (documents.passport instanceof File)
        formData.append("passport", documents.passport);

      if (documents.drivingLicenceFront instanceof File)
        formData.append("drivingLicenceFront", documents.drivingLicenceFront);

      if (documents.drivingLicenceBack instanceof File)
        formData.append("drivingLicenceBack", documents.drivingLicenceBack);

      if (documents.proofId1 instanceof File)
        formData.append("proofId1", documents.proofId1);

      if (documents.proofId2 instanceof File)
        formData.append("proofId2", documents.proofId2);

      const res = await submitStep6(formData);

      if (res.success) {
        toast.success(res.data?.message || "Step 6 saved");
        next();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <FullPageLoader />;
  return (
    <div className="relative  max-w-full pb-4">
      <div
        className={blur ? "blur-[3px] pointer-events-none select-none " : ""}
      >
        <div className="min-w-full space-y-4 flex flex-col">
          <div className="rounded-2xl border bg-white p-3 md:p-5">
            <h2 className="text-lg font-semibold mb-3 text-primary">
              Identity & Verification Documents
            </h2>

            <div className="grid lg:grid-cols-6 gap-4 max-w-full">
              <div className="md:col-span-2 ">
                <DocCard
                  title="Passport"
                  fieldKey="passport"
                  hint="Upload your passport bio page. "
                  file={documents.passport}
                  onUpdate={updateDoc}
                />
              </div>
              <div className="md:col-span-2">
                <DocCard
                  title="Driving Licence (Front)"
                  fieldKey="drivingLicenceFront"
                  hint="Upload front side of your driving licence"
                  file={documents.drivingLicenceFront}
                  onUpdate={updateDoc}
                />
              </div>
              <div className="md:col-span-2">
                <DocCard
                  title="Driving Licence (Back)"
                  fieldKey="drivingLicenceBack"
                  hint="Upload back side of your driving licence"
                  file={documents.drivingLicenceBack}
                  onUpdate={updateDoc}
                />
              </div>
              <div className="md:col-span-3">
                <DocCard
                  title="Proof of ID 1"
                  fieldKey="proofId1"
                  hint="Any valid proof of ID "
                  file={documents.proofId1}
                  onUpdate={updateDoc}
                />
              </div>
              <div className="md:col-span-3">
                <DocCard
                  title="Proof of ID 2"
                  fieldKey="proofId2"
                  hint="Second proof of ID "
                  file={documents.proofId2}
                  onUpdate={updateDoc}
                />
              </div>
            </div>
          </div>

          <SignupNavButtons onBack={back} onNext={handleSubmitStep6} />
        </div>
      </div>

      {/* Overlay */}
      {blur && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm">
            <h2 className="text-lg font-semibold mb-2">
              Appliaction Submitted Successfully.
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              One of our representative will get back to you with in 24 to 48
              hours.
            </p>

            {/* Optional action */}
            <div className="flex justify-evenly items-center">
              <Link href={"/"}>
                <button className="px-6 py-1 bg-primary text-white rounded text-[15px] flex gap-1 items-center">
                  Done
                  {/* <IoMdCheckmark className="size-5 mb-0.5"/> */}
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
