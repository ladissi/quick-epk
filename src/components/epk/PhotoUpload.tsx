'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';

interface PhotoUploadProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  userId: string;
  maxPhotos?: number;
}

export default function PhotoUpload({
  photos,
  onChange,
  userId,
  maxPhotos = 5,
}: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      if (photos.length + files.length > maxPhotos) {
        setError(`Maximum ${maxPhotos} photos allowed`);
        return;
      }

      setIsUploading(true);
      setError(null);

      const supabase = createClient();
      const newPhotos: string[] = [];

      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          setError('Only image files are allowed');
          continue;
        }

        if (file.size > 5 * 1024 * 1024) {
          setError('Images must be under 5MB');
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { data, error: uploadError } = await supabase.storage
          .from('epk-photos')
          .upload(fileName, file);

        if (uploadError) {
          setError(`Failed to upload ${file.name}`);
          continue;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from('epk-photos').getPublicUrl(data.path);

        newPhotos.push(publicUrl);
      }

      if (newPhotos.length > 0) {
        onChange([...photos, ...newPhotos]);
      }

      setIsUploading(false);
      e.target.value = '';
    },
    [photos, onChange, userId, maxPhotos]
  );

  const handleRemove = useCallback(
    async (photoUrl: string) => {
      const supabase = createClient();

      // Extract the path from the URL
      const urlParts = photoUrl.split('/epk-photos/');
      if (urlParts.length > 1) {
        await supabase.storage.from('epk-photos').remove([urlParts[1]]);
      }

      onChange(photos.filter((p) => p !== photoUrl));
    },
    [photos, onChange]
  );

  const handleReorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      const newPhotos = [...photos];
      const [removed] = newPhotos.splice(fromIndex, 1);
      newPhotos.splice(toIndex, 0, removed);
      onChange(newPhotos);
    },
    [photos, onChange]
  );

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {photos.map((photo, index) => (
          <div
            key={photo}
            className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
          >
            <img
              src={photo}
              alt={`Photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleReorder(index, index - 1)}
                  className="p-1 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                  title="Move left"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}
              <button
                type="button"
                onClick={() => handleRemove(photo)}
                className="p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                title="Remove"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              {index < photos.length - 1 && (
                <button
                  type="button"
                  onClick={() => handleReorder(index, index + 1)}
                  className="p-1 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                  title="Move right"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </div>
            {index === 0 && (
              <span className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                Main
              </span>
            )}
          </div>
        ))}

        {photos.length < maxPhotos && (
          <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
              disabled={isUploading}
            />
            {isUploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
            ) : (
              <>
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="text-sm text-gray-500 mt-2">Add Photo</span>
              </>
            )}
          </label>
        )}
      </div>

      <p className="text-sm text-gray-500">
        {photos.length}/{maxPhotos} photos. First photo will be your main image.
      </p>
    </div>
  );
}
