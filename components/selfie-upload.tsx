'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Camera as CameraIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SelfieUploadProps {
  onImageSelect: (file: File) => void;
}

export function SelfieUpload({ onImageSelect }: SelfieUploadProps) {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (
      cameraActive &&
      streamRef.current &&
      videoRef.current
    ) {
      videoRef.current.srcObject = streamRef.current;

      videoRef.current
        .play()
        .catch((err) => console.error('Video play failed:', err));
    }
  }, [cameraActive]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setCameraActive(true);
    } catch (error) {
      console.error('Camera error:', error);

      setCameraError(
        error instanceof Error
          ? error.message
          : 'Unable to access camera'
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraActive(false);
    setCameraError(null);
  };

  const capturePhoto = () => {
    if (
      !videoRef.current ||
      !canvasRef.current
    ) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');

    if (!context) return;

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const file = new File(
          [blob],
          'selfie.jpg',
          {
            type: 'image/jpeg',
          }
        );

        const imageUrl = URL.createObjectURL(blob);

        setImage(imageUrl);
        setFileName('selfie.jpg');

        onImageSelect(file);

        stopCamera();
      },
      'image/jpeg',
      0.95
    );
  };

  const removeImage = () => {
    if (image?.startsWith('blob:')) {
      URL.revokeObjectURL(image);
    }

    setImage(null);
    setFileName('');
  };

return (
  <Card className="overflow-hidden border-0 bg-transparent shadow-none">
    {!image ? (
      <div className="flex justify-center">
        {!cameraActive ? (
          <div className="w-full max-w-sm">
            <div className="rounded-3xl border bg-card p-8 shadow-xl text-center">
              <CameraIcon
                size={64}
                className="mx-auto mb-4 text-primary"
              />

              <h2 className="mb-2 text-2xl font-bold">
                Take a Selfie
              </h2>

              <p className="mb-8 text-muted-foreground">
                Position your face in the frame and capture a photo.
              </p>

              {cameraError && (
                <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-500">
                  {cameraError}
                </div>
              )}

              <Button
                onClick={startCamera}
                size="lg"
                className="w-full"
              >
                <CameraIcon
                  size={18}
                  className="mr-2"
                />
                Open Camera
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-sm">
            <div className="relative overflow-hidden rounded-[2rem] bg-black shadow-2xl aspect-[9/16]">
              {/* Camera Feed */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 h-full w-full object-cover scale-x-[-1]"
              />

              {/* Top Gradient */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/70 to-transparent z-10" />

              {/* Bottom Gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/80 to-transparent z-10" />

              {/* Header */}
              <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-5">
                <span className="text-white font-semibold">
                  Selfie Camera
                </span>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={stopCamera}
                  className="text-white hover:bg-white/20"
                >
                  <X size={20} />
                </Button>
              </div>

              {/* Face Guide */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="h-64 w-64 rounded-full border-4 border-white/70" />
              </div>

              {/* Capture Button */}
              <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2">
                <button
                  onClick={capturePhoto}
                  className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-white/20 backdrop-blur-md transition-transform hover:scale-105 active:scale-95"
                >
                  <div className="h-16 w-16 rounded-full bg-white" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    ) : (
      <div className="flex justify-center">
        <div className="w-full max-w-sm">
          <div className="relative overflow-hidden rounded-[2rem] shadow-2xl aspect-[9/16]">
            <img
              src={image}
              alt="Captured selfie"
              className="h-full w-full object-cover"
            />

            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 to-transparent">
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={removeImage}
                >
                  Retake
                </Button>
              </div>
            </div>
          </div>

          <p className="mt-3 text-center text-sm text-muted-foreground">
            {fileName}
          </p>
        </div>
      </div>
    )}

    <canvas
      ref={canvasRef}
      className="hidden"
    />
  </Card>
);

}