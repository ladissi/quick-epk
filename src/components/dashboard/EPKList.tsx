'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { EPK } from '@/types';
import { formatDate } from '@/lib/utils';

interface EPKListProps {
  epks: EPK[];
  viewCounts: Record<string, number>;
}

export default function EPKList({ epks, viewCounts }: EPKListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (epkId: string) => {
    if (!confirm('Are you sure you want to delete this EPK? This cannot be undone.')) {
      return;
    }

    setDeletingId(epkId);
    const supabase = createClient();

    await supabase.from('epks').delete().eq('id', epkId);

    router.refresh();
    setDeletingId(null);
  };

  const handleTogglePublish = async (epk: EPK) => {
    const supabase = createClient();

    await supabase
      .from('epks')
      .update({ is_published: !epk.is_published })
      .eq('id', epk.id);

    router.refresh();
  };

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="grid gap-4">
      {epks.map((epk) => (
        <Card key={epk.id} className="hover:shadow-md transition-shadow">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {epk.photos && epk.photos.length > 0 ? (
                  <img
                    src={epk.photos[0]}
                    alt={epk.artist_name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-purple-100 flex items-center justify-center">
                    <span className="text-2xl text-purple-600">
                      {epk.artist_name.charAt(0)}
                    </span>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-gray-900">{epk.artist_name}</h3>
                  <p className="text-sm text-gray-500">
                    /{epk.slug} • {epk.genre || 'No genre'}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        epk.is_published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {epk.is_published ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-xs text-gray-500">
                      Created {formatDate(epk.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {viewCounts[epk.id] || 0}
                  </p>
                  <p className="text-xs text-gray-500">Views</p>
                </div>

                <div className="flex items-center gap-2">
                  {epk.is_published && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyLink(epk.slug)}
                      >
                        Copy Link
                      </Button>
                      <Link href={`/${epk.slug}`} target="_blank">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </>
                  )}
                  <Link href={`/dashboard/epk/${epk.id}/analytics`}>
                    <Button variant="outline" size="sm">
                      Analytics
                    </Button>
                  </Link>
                  <Link href={`/dashboard/epk/${epk.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTogglePublish(epk)}
                  >
                    {epk.is_published ? 'Unpublish' : 'Publish'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(epk.id)}
                    disabled={deletingId === epk.id}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {deletingId === epk.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
