import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import EPKList from '@/components/dashboard/EPKList';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: epks } = await supabase
    .from('epks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Get view counts for each EPK
  const epkIds = epks?.map((e) => e.id) || [];
  const { data: viewCounts } = await supabase
    .from('epk_views')
    .select('epk_id')
    .in('epk_id', epkIds);

  const viewCountMap: Record<string, number> = {};
  viewCounts?.forEach((v) => {
    viewCountMap[v.epk_id] = (viewCountMap[v.epk_id] || 0) + 1;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Press Kits</h1>
          <p className="text-gray-600 mt-1">
            Create and manage your electronic press kits
          </p>
        </div>
        <Link href="/dashboard/epk/new">
          <Button>Create New EPK</Button>
        </Link>
      </div>

      {!epks || epks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No press kits yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first EPK to start sharing your music with bookers.
            </p>
            <Link href="/dashboard/epk/new">
              <Button>Create Your First EPK</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <EPKList epks={epks} viewCounts={viewCountMap} />
      )}
    </div>
  );
}
