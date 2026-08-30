import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Trash2,
  Upload,
} from 'lucide-react';
import type { ImageUploadFieldProps } from '../../types/image';


export function ImageUploadField({
  label,
  value,
  onChange,
  hint,
  aspect = 'standard',
}: ImageUploadFieldProps) {
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] =
    useState<string | undefined>(undefined);

  useEffect(() => {
    if (!value) {
      setPreviewUrl(undefined);
      return;
    }

    if (value instanceof File) {
      const url = URL.createObjectURL(value);

      setPreviewUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }

    setPreviewUrl(value);
  }, [value]);

  const handleFile = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        'Format gambar harus PNG, JPG/JPEG, atau WebP.',
      );

      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB.');

      e.target.value = '';
      return;
    }

    onChange(file);
  };

  const handleRemove = () => {
    onChange(undefined);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const heightClass =
    aspect === 'stamp'
      ? 'h-24'
      : 'h-20';

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {label}
        </label>

        {value && (
          <button
            type="button"
            onClick={handleRemove}
            className="flex items-center gap-1 text-[10px] font-semibold text-rose-600 hover:text-rose-700"
          >
            <Trash2 size={11} />
            Hapus
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFile}
        className="hidden"
      />

      {previewUrl ? (
        <div
          onClick={() =>
            fileInputRef.current?.click()
          }
          className={`relative group cursor-pointer border border-slate-200 bg-slate-50 rounded-lg p-2 flex items-center justify-center hover:border-slate-400 hover:bg-slate-100 transition-all ${heightClass}`}
        >
          <img
            src={previewUrl}
            alt={label}
            className="max-h-full max-w-full object-contain"
          />

          <div className="absolute inset-0 flex items-center justify-center gap-1 text-xs font-semibold text-white transition-opacity bg-slate-950/50 opacity-0 group-hover:opacity-100 rounded-lg">
            <Upload size={13} />
            Ganti File
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() =>
            fileInputRef.current?.click()
          }
          className="flex flex-col items-center justify-center w-full gap-1 p-3 transition-all border border-dashed border-slate-300 hover:border-slate-400 bg-slate-50/70 hover:bg-slate-50 rounded-lg text-slate-500"
        >
          <div className="flex items-center justify-center w-6 h-6 bg-white border rounded-md border-slate-200 text-slate-600">
            <Upload size={12} />
          </div>

          <span className="text-xs font-semibold text-slate-700">
            Unggah Berkas
          </span>

          <span className="text-[10px] text-slate-400">
            {hint}
          </span>
        </button>
      )}
    </div>
  );
}