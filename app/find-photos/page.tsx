'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SelfieUpload } from '@/components/selfie-upload';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { searchPhotos, ApiError } from '@/lib/api-client';

export default function FindPhotosPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleImageSelect = (file: File) => {
    setSelectedFile(file);
    setError(null);
  };

  const handleSearch = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

    try {
      const results = await searchPhotos(selectedFile);
      
      // Store results in sessionStorage for the results page
      sessionStorage.setItem('searchResults', JSON.stringify(results));
      
      router.push('/search-results');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-12 md:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 animated-gradient-bg opacity-20 blur-3xl"></div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 slide-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Find Your Photos</h1>
          <p className="text-lg text-muted-foreground">
            Upload a clear selfie or take a photo to search through our event photo collections instantly
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex gap-3 slide-up">
            <AlertCircle size={20} className="text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Upload Component */}
        <div className="mb-8 slide-up-delay-1">
          <SelfieUpload onImageSelect={handleImageSelect} />
        </div>

        {/* Search Button */}
        <div className="flex justify-center slide-up-delay-2">
          <Button
            onClick={handleSearch}
            disabled={!selectedFile || isLoading}
            size="lg"
            className="bg-linear-to-r from-primary to-accent hover:from-accent hover:to-primary text-primary-foreground disabled:opacity-50 smooth-transition hover-lift shadow-lg"
          >
            {isLoading && <Loader2 size={20} className="mr-2 animate-spin" />}
            {isLoading ? 'Searching Photos...' : 'Search Photos'}
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="mt-12 text-center">
            <div className="inline-block">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <Loader2 size={24} className="text-primary animate-spin" />
                  <span className="text-lg font-semibold">Searching through millions of photos...</span>
                </div>
                <p className="text-sm text-muted-foreground">This may take a moment</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
