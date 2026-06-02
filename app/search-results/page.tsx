'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FilterBar } from '@/components/filter-bar';
import { PhotoCard } from '@/components/photo-card';
import { PhotoViewerModal } from '@/components/photo-viewer-modal';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { SearchResult, getImageBlob } from '@/lib/api-client';

export default function SearchResultsPage() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'high' | 'medium'>('all');
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    // Load search results from sessionStorage
    try {
      const stored = sessionStorage.getItem('searchResults');
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log(parsed);
        setResults(parsed);
        sessionStorage.removeItem('searchResults');
      }
    } catch (err) {
      console.error('[v0] Failed to load search results:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filteredResults = results.filter((photo) => {
    if (selectedFilter === 'high') return photo.similarity >= 85;
    if (selectedFilter === 'medium') return photo.similarity >= 70 && photo.similarity < 85;
    return true;
  });

  const handleViewPhoto = (id: string) => {
    setSelectedPhoto(id);
    setViewerOpen(true);
  };

  const handleDownload = async () => {
    if (!selectedPhoto) return;
    try {
      const blob = await getImageBlob(selectedPhoto);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `photo-${selectedPhoto}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('[v0] Download failed:', err);
    }
  };

  const selectedPhotoData = results.find((p) => p.photo_id === selectedPhoto);

  if (isLoading) {
    return (
      <main className="min-h-screen py-12 md:py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="text-primary animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold">Loading your search results...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-12 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <Link href="/find-photos">
                <ArrowLeft size={16} />
                Back
              </Link>
            </Button>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2 gradient-text">Your Matches</h1>
          <p className="text-lg text-muted-foreground">
            Found <span className="font-bold text-primary">{results.length}</span> matching photos
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-8">
          <FilterBar selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />
        </div>

        {/* Results Grid */}
        {filteredResults.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredResults.map((photo) => (
              <PhotoCard
                key={photo.photo_id}
                id={photo.photo_id}
                confidence={photo.similarity}
                onView={() => handleViewPhoto(photo.photo_id)}
                onDownload={handleDownload}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-block">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold mb-2">No matching photos found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your filter or upload a different photo</p>
              <Button
                asChild
                className="bg-linear-to-r from-primary to-accent hover:from-accent hover:to-primary text-primary-foreground"
              >
                <Link href="/find-photos">Try Another Photo</Link>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Photo Viewer Modal */}
      <PhotoViewerModal
        isOpen={viewerOpen}
        confidence={selectedPhotoData?.similarity}
        photoId={selectedPhoto || undefined}
        onClose={() => setViewerOpen(false)}
        onDownload={handleDownload}
      />
    </main>
  );
}
