'use client';

import { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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

export function EventUploadForm({ onSubmit }: EventUploadFormProps) {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventDescription, setEventDescription] = useState('');
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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFiles = (files: File[]) => {
    setError(null);
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      setError('Please upload valid image files');
      return;
    }

    const newFiles: UploadedFile[] = imageFiles.map((file) => ({
      name: file.name,
      size: file.size,
      id: Math.random().toString(36).substr(2, 9),
      file: file,
    }));

    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles(uploadedFiles.filter((file) => file.id !== id));
  };

  const handleSubmit = async () => {
    if (!eventName || uploadedFiles.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const files = uploadedFiles.map((f) => f.file);
      await uploadPhotos(
        eventName,
        eventDate || new Date().toISOString().split('T')[0],
        eventDescription,
        files
      );

      setIsSuccess(true);
      setTimeout(() => {
        setEventName('');
        setEventDate('');
        setEventDescription('');
        setUploadedFiles([]);
        setIsSuccess(false);
      }, 2000);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      setIsUploading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="p-8 border-0 text-center bg-background card-shadow">
        <CheckCircle size={64} className="mx-auto mb-4 text-primary" />
        <h3 className="text-2xl font-bold mb-2">Photos Uploaded Successfully!</h3>
        <p className="text-muted-foreground">
          Your event photos are being indexed and will be searchable in a few minutes.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-8 border-0 bg-background">
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex gap-3">
          <AlertCircle size={20} className="text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Event Name */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Event Name *</label>
        <Input
          type="text"
          placeholder="e.g., Summer Festival 2024"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Event Date */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Event Date</label>
        <Input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Event Description */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Event Description</label>
        <textarea
          placeholder="Add details about the event (optional)"
          value={eventDescription}
          onChange={(e) => setEventDescription(e.target.value)}
          className="w-full p-3 rounded-lg border border-border bg-muted resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          rows={4}
        />
      </div>

      {/* Photo Upload */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-3">Upload Event Photos *</label>
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary/60 bg-primary/5' : 'border-primary/30'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={32} className="mx-auto mb-2 text-primary" />
          <p className="font-semibold mb-1">Drag and drop photos here</p>
          <p className="text-sm text-muted-foreground">or click to browse</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3">
            Uploaded Files ({uploadedFiles.length})
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="text-lg">📷</div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1 hover:bg-background rounded transition-colors"
                  aria-label="Remove file"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!eventName || uploadedFiles.length === 0 || isUploading}
        size="lg"
        className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-primary-foreground disabled:opacity-50"
      >
        {isUploading ? 'Uploading...' : 'Upload Photos'}
      </Button>
    </Card>
  );
}
