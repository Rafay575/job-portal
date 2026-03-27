"use client";

import React, { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { UploadCloud, Trash2, Eye } from "lucide-react";
import { Step6Type } from "@/types/Form";

type Props = {
  next: () => void;
  back: () => void;
};

const MAX_MB = 5;
const MAX_BYTES = MAX_MB * 1024 * 1024;
const ACCEPTED = [".pdf", ".jpg", ".jpeg", ".png"];

function formatBytes(bytes: number) {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
}

function isImage(file: File) {
  return file.type.startsWith("image/");
}

function isPdf(file: File) {
  return file.type === "application/pdf";
}

export default function Step6({ next, back }: Props) {
  const [documents, setDocuments] = useState<Step6Type>({
    passport: null,
    drivingLicence: null,
    proofId1: null,
    proofId2: null,
  });

  const validateStep = (): boolean => {
    if (
      !documents.passport ||
      !documents.drivingLicence ||
      !documents.proofId1 ||
      !documents.proofId2
    ) {
      toast.error("Please upload all required documents");
      return false;
    }
    return true;
  };

  const updateDoc = (key: keyof Step6Type, file: File | null) => {
    setDocuments((prev) => ({ ...prev, [key]: file }));
  };

  const checkFile = (file: File) => {
    const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
    const okExt = ACCEPTED.includes(ext);

    if (!okExt) {
      toast.error(`Invalid file type. Allowed: ${ACCEPTED.join(", ")}`);
      return false;
    }

    if (file.size > MAX_BYTES) {
      toast.error(`File must be less than ${MAX_MB}MB`);
      return false;
    }

    return true;
  };

  const DocCard = ({
    title,
    fieldKey,
    hint,
  }: {
    title: string;
    fieldKey: keyof Step6Type;
    hint?: string;
  }) => {
    const file = documents[fieldKey];
    const inputRef = useRef<HTMLInputElement | null>(null);

    const previewUrl = useMemo(() => {
      if (!file) return null;
      return URL.createObjectURL(file);
    }, [file]);

    // Clean up blob URL
    React.useEffect(() => {
      return () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
      };
    }, [previewUrl]);

    const onPick = () => inputRef.current?.click();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (!f) return;
      if (!checkFile(f)) return;

      updateDoc(fieldKey, f);
      // allow re-selecting same file later
      e.target.value = "";
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const f = e.dataTransfer.files?.[0];
      if (!f) return;
      if (!checkFile(f)) return;

      updateDoc(fieldKey, f);
    };

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const remove = () => updateDoc(fieldKey, null);

    const openPreview = () => {
      if (!file || !previewUrl) return;

      // For PDFs/images, open blob url in new tab
      window.open(previewUrl, "_blank", "noopener,noreferrer");
    };

    return (
      <div className="rounded-2xl border bg-white p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Label className="text-sm font-semibold">{title} *</Label>
            {hint ? (
              <p className="text-xs text-muted-foreground mt-1">{hint}</p>
            ) : null}
          </div>

          {file ? (
            <Button
              type="button"
              variant="ghost"
              onClick={remove}
              className="gap-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </Button>
          ) : null}
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
              <div className="h-10 w-10 rounded-xl border flex items-center justify-center">
                <UploadCloud className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Drag & drop your file here, or click to upload
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {ACCEPTED.join(", ")} • Max {MAX_MB}MB
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatBytes(file.size)} • {file.type || "file"}
                </p>
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onPick}>
                  Replace
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={openPreview}
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
              </div>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED.join(",")}
            className="hidden"
            onChange={onChange}
          />
        </div>

        {/* Inline image preview */}
        {file && previewUrl && isImage(file) ? (
          <div className="mt-3">
            <div className="rounded-xl border overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={`${title} preview`}
                className="w-full h-48 object-cover"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Image preview shown above. You can also open full preview.
            </p>
          </div>
        ) : null}

        {/* PDF note */}
        {file && isPdf(file) ? (
          <p className="text-xs text-muted-foreground mt-3">
            PDF preview will open in a new tab.
          </p>
        ) : null}
      </div>
    );
  };

  return (
    <div className="min-w-full space-y-4 p-2 flex flex-col">
      <div className="rounded-2xl border bg-white p-5">
        <h2 className="text-lg font-semibold mb-1">
          Identity & Verification Documents
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Upload clear copies. Supported: {ACCEPTED.join(", ")} (Max {MAX_MB}MB
          each).
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <DocCard
            title="Passport"
            fieldKey="passport"
            hint="Upload your passport bio page (clear and readable)."
          />
          <DocCard
            title="Driving Licence"
            fieldKey="drivingLicence"
            hint="Front side is usually enough, unless you want to upload both sides."
          />
          <DocCard
            title="Proof of ID 1"
            fieldKey="proofId1"
            hint="Any valid proof of ID (e.g., national ID, residence card, etc.)."
          />
          <DocCard
            title="Proof of ID 2"
            fieldKey="proofId2"
            hint="Second proof of ID (can be different from Proof of ID 1)."
          />
        </div>
      </div>

      <div className="flex gap-2 mt-3 justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={back}
          className="gap-2"
        >
          <IoIosArrowBack />
          Back
        </Button>

        <Button
          type="button"
          onClick={() => {
            if (validateStep()) {
               console.log("Step6 Data:", documents); // ✅ log here
              next();
            }
          }}
          className="gap-2"
        >
          Next
          <IoIosArrowForward />
        </Button>
      </div>
    </div>
  );
}
