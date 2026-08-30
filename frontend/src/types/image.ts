export type ImageValue = string | File | undefined;

export interface ImageUploadFieldProps {
  label: string;
  value?: ImageValue;
  onChange: (value: ImageValue) => void;
  hint: string;
  aspect?: 'logo' | 'sign' | 'stamp' | 'standard';
}