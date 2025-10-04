import { UploadCloud, X } from 'lucide-react';
import { useCallback, useEffect} from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { toast } from 'sonner';

// Tipe untuk setiap item gambar, bisa berupa file baru atau URL gambar yang sudah ada
export type ImageItem = {
  file?: File;
  url: string;
  id?: number; // ID dari database untuk gambar yang sudah ada
};

interface MultiImageDropzoneProps {
  value: ImageItem[];
  onChange: (items: ImageItem[]) => void;
  maxFiles?: number;
  readOnly?: boolean;
}

export function MultiImageDropzone({
  value,
  onChange,
  maxFiles = 10,
  readOnly = false,
}: MultiImageDropzoneProps) {
  // Callback untuk onDrop agar tidak dibuat ulang di setiap render
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        toast.error("Beberapa file ditolak karena tidak sesuai format atau ukuran.");
      }
      
      const newItems: ImageItem[] = acceptedFiles.map((file) => ({
        file: file,
        url: URL.createObjectURL(file),
      }));

      // Gabungkan gambar yang sudah ada dengan yang baru
      onChange([...value, ...newItems]);
    },
    [value, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.webp'] },
    maxSize: 4 * 1024 * 1024, // 4MB
    disabled: readOnly,
  });

  const handleRemove = (indexToRemove: number) => {
    // Buat array baru tanpa gambar yang ingin dihapus
    const newItems = value.filter((_, index) => index !== indexToRemove);
    onChange(newItems);
  };
  
  // Efek untuk membersihkan Object URL saat komponen unmount untuk mencegah memory leak
  useEffect(() => {
    return () => {
      value.forEach(item => {
        if (item.file) {
          URL.revokeObjectURL(item.url);
        }
      });
    };
  }, [value]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {/* 1. Render semua gambar yang ada di dalam 'value' */}
      {value.map((item, index) => (
        <div key={index} className="relative aspect-square rounded-md overflow-hidden group">
          <Image
            src={item.url}
            alt={`Preview ${index}`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover"
          />
          {!readOnly && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="rounded-full h-8 w-8"
                onClick={() => handleRemove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      ))}

      {/* 2. Selalu sediakan satu dropzone kosong di akhir jika belum mencapai limit */}
      {!readOnly && value.length < maxFiles && (
        <div
          {...getRootProps({
            className: cn(
              "relative aspect-square border-2 border-dashed rounded-md flex flex-col items-center justify-center text-center text-muted-foreground cursor-pointer transition-colors",
              isDragActive ? "border-primary bg-primary/10" : "hover:border-primary/50"
            ),
          })}
        >
          <input {...getInputProps()} />
          <UploadCloud className="w-8 h-8 mb-2" />
          <p className="text-sm">Seret & lepas</p>
          <p className="text-xs">atau klik untuk upload</p>
        </div>
      )}
    </div>
  );
}