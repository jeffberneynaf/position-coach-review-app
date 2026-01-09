'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import Button from './Button';

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
  currentImage?: string | null;
  error?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MIN_WIDTH = 200;
const MIN_HEIGHT = 200;

export default function ImageUpload({ onImageSelect, currentImage, error }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [validationError, setValidationError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateImage = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setValidationError('File size must be less than 5MB');
        resolve(false);
        return;
      }

      // Check file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        setValidationError('File must be JPEG, PNG, or WebP');
        resolve(false);
        return;
      }

      // Check image dimensions
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        
        if (img.width < MIN_WIDTH || img.height < MIN_HEIGHT) {
          setValidationError(`Image must be at least ${MIN_WIDTH}x${MIN_HEIGHT} pixels`);
          resolve(false);
          return;
        }
        
        setValidationError('');
        resolve(true);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        setValidationError('Failed to load image');
        resolve(false);
      };
      
      img.src = objectUrl;
    });
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      return;
    }

    const isValid = await validateImage(file);
    
    if (isValid) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        onImageSelect(file);
      };
      reader.readAsDataURL(file);
    } else {
      onImageSelect(null);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setValidationError('');
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) {
      return;
    }

    const isValid = await validateImage(file);
    
    if (isValid) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        onImageSelect(file);
      };
      reader.readAsDataURL(file);

      // Update file input
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }
    } else {
      onImageSelect(null);
    }
  };

  const displayError = error || validationError;

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
        id="photo-upload"
      />
      
      {!preview ? (
        <label
          htmlFor="photo-upload"
          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            isDragging
              ? 'border-[#f91942] bg-red-50'
              : 'border-gray-300 hover:border-[#f91942] bg-gray-50 hover:bg-gray-100'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-12 h-12 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">JPEG, PNG or WebP (max 5MB)</p>
            <p className="text-xs text-gray-500">Minimum 200x200 pixels</p>
          </div>
        </label>
      ) : (
        <div className="relative w-full">
          <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            aria-label="Remove image"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full mt-2"
          >
            Change Photo
          </Button>
        </div>
      )}

      {displayError && (
        <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{displayError}</span>
        </div>
      )}
    </div>
  );
}
