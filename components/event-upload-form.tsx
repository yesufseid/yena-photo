'use client';

import { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { uploadPhotos, ApiError } from '@/lib/api-client';

interface UploadedFile {
  name: string;
  size: number;
  id: string;
  file: File;
}

interface EventUploadFormProps {
  onSubmit?: (data: any) => void;
}

export function EventUploadForm({ onSubmit,id }: EventUploadFormProps & { id: string }) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const readDirectory = async (
    directoryEntry: any,
    files: File[]
  ): Promise<void> => {
    const reader = directoryEntry.createReader();

    const entries: any[] = await new Promise((resolve) => {
      reader.readEntries(resolve);
    });

    for (const entry of entries) {
      if (entry.isFile) {
        const file = await new Promise<File>((resolve) => {
          entry.file(resolve);
        });

        files.push(file);
      } else if (entry.isDirectory) {
        await readDirectory(entry, files);
      }
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files: File[] = [];

    const items = Array.from(e.dataTransfer.items);

    for (const item of items) {
      const entry = (item as any).webkitGetAsEntry?.();

      if (entry?.isDirectory) {
        await readDirectory(entry, files);
      } else {
        const file = item.getAsFile();
        if (file) {
          files.push(file);
        }
      }
    }

    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    setError(null);

    const imageFiles = files.filter((file) =>
      file.type.startsWith('image/')
    );

    if (imageFiles.length === 0) {
      setError('Please upload image files only');
      return;
    }

    const existingFiles = new Set(
      uploadedFiles.map((f) => `${f.name}-${f.size}`)
    );

    const newFiles: UploadedFile[] = imageFiles
      .filter(
        (file) => !existingFiles.has(`${file.name}-${file.size}`)
      )
      .map((file) => ({
        name: file.name,
        size: file.size,
        id: crypto.randomUUID(),
        file,
      }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleFileInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) =>
      prev.filter((file) => file.id !== id)
    );
  };

  const handleSubmit = async () => {
 

    setIsUploading(true);
    setError(null);

    try {
      const files = uploadedFiles.map((f) => f.file);

      for (const file of files) {
           await uploadPhotos(id, file);
}

      onSubmit?.({
        files,
      });

      setIsSuccess(true);

      setTimeout(() => {
        setUploadedFiles([]);
        setIsSuccess(false);
      }, 2000);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'An unexpected error occurred';

      setError(message);
    } finally {
      setIsUploading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="p-8 border-0 text-center bg-background card-shadow">
        <CheckCircle
          size={64}
          className="mx-auto mb-4 text-primary"
        />
        <h3 className="text-2xl font-bold mb-2">
          Photos Uploaded Successfully!
        </h3>
        <p className="text-muted-foreground">
          Your event photos are being indexed and will be searchable
          in a few minutes.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-8 border-0 bg-background">
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex gap-3">
          <AlertCircle
            size={20}
            className="text-destructive shrink-0 mt-0.5"
          />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-3">
          Upload Photos *
        </label>

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-primary/30'
          }`}
        >
          <Upload
            size={32}
            className="mx-auto mb-3 text-primary"
          />

          <p className="font-semibold mb-1">
            Drag & drop photos or folders
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Upload summary will only show the total number of photos selected.
          </p>

          <p className="text-sm text-muted-foreground">
            Click to select images or an entire folder
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          {...({
            webkitdirectory: '',
            directory: '',
          } as any)}
        />
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mb-6 rounded-xl border border-border/70 bg-muted/40 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Ready to upload</p>
              <p className="text-xs text-muted-foreground">
                {uploadedFiles.length} photo{uploadedFiles.length === 1 ? '' : 's'} selected for this event.
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setUploadedFiles([])}
              className="text-destructive hover:bg-destructive/10"
            >
              Clear selection
            </Button>
          </div>
        </div>
      )}

      <Button
        size="lg"
        onClick={handleSubmit}
        disabled={
          uploadedFiles.length === 0 ||
          isUploading
        }
        className="w-full bg-linear-to-r from-primary to-accent hover:from-accent hover:to-primary"
      >
        {isUploading ? 'Uploading...' : 'Upload Photos'}
      </Button>
    </Card>
  );
}