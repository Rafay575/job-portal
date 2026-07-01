import { useEffect, useMemo, useRef } from "react";
import toast from "react-hot-toast";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Eye, Trash2, UploadCloud } from "lucide-react";

const MAX_MB = 5;
const MAX_BYTES = MAX_MB * 1024 * 1024;
const ACCEPTED = [".pdf", ".jpg", ".jpeg", ".png", ".docx", ".doc"];

type DocCardProps<T extends Record<string, any>> = {
  title: string;
  hint?: string;
  fieldKey: keyof T;
  file: File | string | null;
  onUpdate: <K extends keyof T>(key: K, value: T[K]) => void;
  acceptedTypes?: string[]; // e.g. [".pdf", ".jpg"] — defaults to ACCEPTED
};

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

function checkFile(file: File, allowed: string[]): boolean {
  const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
  if (!allowed.includes(ext)) {
    toast.error(`Invalid file type. Allowed: ${allowed.join(", ")}`);
    return false;
  }
  if (file.size > MAX_BYTES) {
    toast.error(`File must be less than ${MAX_MB}MB`);
    return false;
  }
  return true;
}

export function DocCard<T extends Record<string, any>>({
  title,
  fieldKey,
  hint,
  file,
  onUpdate,
  acceptedTypes = ACCEPTED,
}: DocCardProps<T>) {
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
    if (!checkFile(f, acceptedTypes)) return;
    onUpdate(fieldKey, f as T[keyof T]);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    if (!checkFile(f, acceptedTypes)) return;
    onUpdate(fieldKey, f as T[keyof T]);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const remove = () => onUpdate(fieldKey, null as T[keyof T]);

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

  const MIME_MAP: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };

  const nativeAccept = acceptedTypes
    .map((ext) => `${MIME_MAP[ext] ?? ""},${ext}`)
    .join(",");

  return (
    <div className="rounded-lg md:rounded-lg bg-white p-4 border !max-w-full !overflow-x-hidden mt-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <Label className="text-md font-semibold text-primary">{title}</Label>
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
          accept={nativeAccept}
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
