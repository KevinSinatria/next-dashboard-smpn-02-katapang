import { useState, useRef, useEffect, DragEvent } from "react";
import { UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImageDropzoneProps {
  onChange: (file: File | null) => void;
  className?: string;
  initialPreviewUrl?: string | null;
  readOnly?: boolean
}

export function ImageDropzone({
  onChange,
  className,
  initialPreviewUrl,
  readOnly
}: ImageDropzoneProps) {
  const [preview, setPreview] = useState<string | null>(
    initialPreviewUrl || null
  );
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Efek untuk handle initial preview dari data yang sudah ada
  useEffect(() => {
    setPreview(initialPreviewUrl || null);
  }, [initialPreviewUrl]);

  const handleFileSelect = (file: File | null) => {
    if (file) {
      const newPreviewUrl = URL.createObjectURL(file);
      setPreview(newPreviewUrl);
      onChange(file);
    } else {
      setPreview(null);
      onChange(null);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className={cn(
        "relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-colors duration-200 ease-in-out",
        !readOnly && "hover:border-primary hover:bg-primary/5",
        isDragging && "border-primary bg-primary/10",
        preview && "border-solid p-0", // Hilangkan padding jika ada preview
        className
      )}
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) =>
          handleFileSelect(e.target.files ? e.target.files[0] : null)
        }
        className="hidden"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        disabled={readOnly}
      />

      {preview ? (
        <>
          <Image
            src={preview}
            alt="Image preview"
            className="w-full h-full object-cover rounded-lg"
            width={256}
            height={256}
          />
          {!readOnly && <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 rounded-full h-8 w-8"
            onClick={(e) => {
              e.stopPropagation(); // Hentikan event klik agar dialog file tidak terbuka
              handleRemoveImage();
            }}
          >
            <X className="h-4 w-4" />
          </Button>}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-2 text-gray-500">
          <UploadCloud className="w-12 h-12" />
          <span className="font-semibold">
            Klik untuk mengunggah atau seret file
          </span>
          <span className="text-xs">PNG, JPG, JPEG, atau WEBP (Maks. 4MB)</span>
        </div>
      )}
    </div>
  );
}
