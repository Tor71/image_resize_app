'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as Slider from '@radix-ui/react-slider';
import { Upload, Image as ImageIcon, RefreshCcw } from 'lucide-react';
interface ImageDimensions {
  width: number;
  height: number;
}

export default function ImageResizer() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [dimensions, setDimensions] = useState<ImageDimensions>({ width: 0, height: 0 });
  const [scale, setScale] = useState<number>(100);
  const [processing, setProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Get image dimensions
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        setDimensions({
          width: img.width,
          height: img.height
        });
      };
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1
  });

  const handleResize = async () => {
    if (!image || !dimensions.width || !dimensions.height) return;

    setProcessing(true);
    try {
      // Create a canvas element to resize the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // Calculate new dimensions
      const newWidth = Math.round(dimensions.width * (scale / 100));
      const newHeight = Math.round(dimensions.height * (scale / 100));

      // Set canvas size
      canvas.width = newWidth;
      canvas.height = newHeight;

      // Create a temporary image element
      const img = new Image();
      img.src = preview;

      // Wait for image to load
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Draw the image at the new size
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      // Convert to blob and download
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `resized-${image.name}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        },
        image.type,
        0.9
      );
    } catch (error) {
      console.error('Error resizing image:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4">
          <Upload className="w-12 h-12 text-gray-400" />
          {isDragActive ? (
            <p className="text-lg text-blue-500">Drop the image here...</p>
          ) : (
            <p className="text-lg text-gray-500">
              Drag & drop an image here, or click to select
            </p>
          )}
        </div>
      </div>

      {preview && (
        <div className="space-y-6">
          <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
            <img
              src={preview}
              alt="Preview"
              className="object-contain w-full h-full"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Resize Scale: {scale}%
              </label>
              <span className="text-sm text-gray-500">
                {Math.round(dimensions.width * (scale / 100))} x {Math.round(dimensions.height * (scale / 100))} px
              </span>
            </div>
            
            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-5"
              value={[scale]}
              onValueChange={(value) => setScale(value[0])}
              max={100}
              min={10}
              step={1}
            >
              <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
                <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb
                className="block w-5 h-5 bg-white shadow-lg rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Scale"
              />
            </Slider.Root>

            <button
              onClick={handleResize}
              disabled={processing}
              className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-white ${processing ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} transition-colors`}
            >
              {processing ? (
                <>
                  <RefreshCcw className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-5 h-5" />
                  <span>Download Resized Image</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}