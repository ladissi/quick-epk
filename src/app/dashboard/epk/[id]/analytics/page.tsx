import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import AnalyticsCharts from '@/components/dashboard/AnalyticsCharts';
import { formatDateTime } from '@/lib/utils';

interface AnalyticsPageProps {
  params: Promise<{ id: string }>;
}

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: epk } = await supabase
    .from('epks')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!epk) {
    notFound();
  }

  // Get all views for this EPK
  const { data: views } = await supabase
    .from('epk_views')
    .select('*')
    .eq('epk_id', id)
    .order('viewed_at', { ascending: false });

  // Get all clicks for this EPK
  const { data: clicks } = await supabase
    .from('epk_clicks')
    .select('*')
    .eq('epk_id', id)
    .order('clicked_at', { ascending: false });

  const totalViews = views?.length || 0;
  const uniqueViews = new Set(views?.map((v) => v.viewer_ip)).size;
  const totalClicks = clicks?.length || 0;

  // Views by date (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const viewsByDate: Record<string, number> = {};
  views?.forEach((view) => {
    const date = new Date(view.viewed_at).toISOString().split('T')[0];
    viewsByDate[date] = (viewsByDate[date] || 0) + 1;
  });

  const viewsChartData = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    viewsChartData.push({
      date: dateStr,
      count: viewsByDate[dateStr] || 0,
    });
  }

  // Clicks by type
  const clicksByType: Record<string, number> = {};
  clicks?.forEach((click) => {
    clicksByType[click.element_type] = (clicksByType[click.element_type] || 0) + 1;
  });

  const clicksChartData = Object.entries(clicksByType).map(([type, count]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    count,
  }));

  // Top referrers
  const referrerCounts: Record<string, number> = {};
  views?.forEach((view) => {
    const referrer = view.referrer || 'Direct';
    try {
      const url = view.referrer ? new URL(view.referrer).hostname : 'Direct';
      referrerCounts[url] = (referrerCounts[url] || 0) + 1;
    } catch {
      referrerCounts[referrer] = (referrerCounts[referrer] || 0) + 1;
    }
  });

  const topReferrers = Object.entries(referrerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([referrer, count]) => ({ referrer, count }));

  // Recent views
  const recentViews = views?.slice(0, 10) || [];

  // Average time on page
  const timesOnPage = views?.filter((v) => v.time_on_page).map((v) => v.time_on_page!) || [];
  const avgTimeOnPage =
    timesOnPage.length > 0
      ? Math.round(timesOnPage.reduce((a, b) => a + b, 0) / timesOnPage.length)
      : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics: {epk.artist_name}
          </h1>
          <p className="text-gray-600 mt-1">
            Track how bookers engage with your press kit
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/epk/${id}/edit`}>
            <Button variant="outline">Edit EPK</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="py-6">
            <p className="text-sm text-gray-600">Total Views</p>
            <p className="text-3xl font-bold text-purple-600">{totalViews}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <p className="text-sm text-gray-600">Unique Visitors</p>
            <p className="text-3xl font-bold text-purple-600">{uniqueViews}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <p className="text-sm text-gray-600">Total Clicks</p>
            <p className="text-3xl font-bold text-purple-600">{totalClicks}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <p className="text-sm text-gray-600">Avg. Time on Page</p>
            <p className="text-3xl font-bold text-purple-600">
              {avgTimeOnPage > 0 ? `${Math.floor(avgTimeOnPage / 60)}:${(avgTimeOnPage % 60).toString().padStart(2, '0')}` : '-'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <AnalyticsCharts
        viewsData={viewsChartData}
        clicksData={clicksChartData}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Top Referrers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Referrers</CardTitle>
          </CardHeader>
          <CardContent>
            {topReferrers.length === 0 ? (
              <p className="text-gray-500 text-sm">No referrer data yet</p>
            ) : (
              <div className="space-y-3">
                {topReferrers.map((ref, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-700">{ref.referrer}</span>
                    <span className="text-purple-600 font-medium">{ref.count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Clicks by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Clicks by Type</CardTitle>
          </CardHeader>
          <CardContent>
            {clicksChartData.length === 0 ? (
              <p className="text-gray-500 text-sm">No click data yet</p>
            ) : (
              <div className="space-y-3">
                {clicksChartData.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-700">{item.type}</span>
                    <span className="text-purple-600 font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Views */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Views</CardTitle>
        </CardHeader>
        <CardContent>
          {recentViews.length === 0 ? (
            <p className="text-gray-500 text-sm">No views yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b">
                    <th className="pb-2 font-medium">Time</th>
                    <th className="pb-2 font-medium">Location</th>
                    <th className="pb-2 font-medium">Referrer</th>
                    <th className="pb-2 font-medium">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recentViews.map((view) => (
                    <tr key={view.id} className="text-sm">
                      <td className="py-3 text-gray-700">
                        {formatDateTime(view.viewed_at)}
                      </td>
                      <td className="py-3 text-gray-600">
                        {view.viewer_location || 'Unknown'}
                      </td>
                      <td className="py-3 text-gray-600">
                        {view.referrer ? (
                          <span className="truncate max-w-[200px] block">
                            {(() => {
                              try {
                                return new URL(view.referrer).hostname;
                              } catch {
                                return view.referrer;
                              }
                            })()}
                          </span>
                        ) : (
                          'Direct'
                        )}
                      </td>
                      <td className="py-3 text-gray-600">
                        {view.time_on_page
                          ? `${Math.floor(view.time_on_page / 60)}:${(view.time_on_page % 60).toString().padStart(2, '0')}`
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
