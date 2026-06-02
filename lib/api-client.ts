const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface EventItem {
  id: string;
  name: string;
  event_date: string;
  description?: string | null;
  cover_photo?: string | null;
  cover_photo_data?: string | null;
  created_at: string;
  photoCount?: number;
}

export async function getEvents(): Promise<EventItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/events`);
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorBody.message || 'Failed to load events.');
  }

  const data = await response.json();
  return data?.events ?? [];
}

export interface SearchResult {
  photo_id: string;
  similarity: number;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  photos?: {
    id: string;
    eventName: string;
    uploadedAt: string;
  }[];
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Upload photos for an event
 */
export async function uploadPhotos(
  id: string,
  files: File[]
): Promise<UploadResponse> {
  // Convert files to base64 strings and send JSON payload
  const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // result is like data:<type>;base64,<base64data>
        const base64 = result.split(',')[1] || result;
        resolve(base64);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

  try {
    const imagesBase64 = await Promise.all(files.map((f) => toBase64(f)));

    const response = await fetch(`${API_BASE_URL}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
         id:id,
        images: imagesBase64,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.message || 'Failed to upload photos. Please try again.'
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      0,
      'Unable to connect to the service. Please check your internet connection.'
    );
  }
}

/**
 * Search for photos by selfie
 */
export async function searchPhotos(selfieFile: File): Promise<SearchResult[]> {
  const formData = new FormData();
  formData.append('image', selfieFile);

  try {
    const response = await fetch(`${API_BASE_URL}/search`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle specific error cases
      if (response.status === 404 || errorData.message?.includes('face')) {
        throw new ApiError(
          response.status,
          "We couldn't detect a face in your photo. Try a clearer image."
        );
      }
      
      throw new ApiError(
        response.status,
        errorData.message || 'Search failed. Please try again.'
      );
    }

    const data = await response.json();
    return data|| [];
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      0,
      'Unable to connect to the service. Please check your internet connection.'
    );
  }
}

/**
 * Get image URL for a photo by ID
 */
export function getImageUrl(photoId: string): string {
  return `${API_BASE_URL}/image/${photoId}`;
}

/**
 * Fetch image blob (useful for downloading)
 */
export async function getImageBlob(photoId: string): Promise<Blob> {
  try {
    const response = await fetch(getImageUrl(photoId));
    if (!response.ok) {
      throw new ApiError(
        response.status,
        'Failed to load image. Please try again.'
      );
    } 
    return await response.blob();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      0,
      'Unable to load image. Please check your internet connection.'
    );
  }
}
