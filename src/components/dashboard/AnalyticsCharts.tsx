'use client';

interface ViewsData {
  date: string;
  count: number;
}

interface ClicksData {
  type: string;
  count: number;
}

interface AnalyticsChartsProps {
  viewsData: ViewsData[];
  clicksData: ClicksData[];
}

export default function AnalyticsCharts({
  viewsData,
  clicksData,
}: AnalyticsChartsProps) {
  const maxViews = Math.max(...viewsData.map((d) => d.count), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Views Over Time Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Views (Last 30 Days)
        </h3>
        <div className="h-48 flex items-end gap-1">
          {viewsData.map((day, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center group"
            >
              <div className="relative w-full">
                <div
                  className="w-full bg-purple-500 rounded-t transition-all hover:bg-purple-600"
                  style={{
                    height: `${(day.count / maxViews) * 160}px`,
                    minHeight: day.count > 0 ? '4px' : '0',
                  }}
                />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {day.count} views
                  <br />
                  {new Date(day.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>30 days ago</span>
          <span>Today</span>
        </div>
      </div>

      {/* Clicks Distribution */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Click Distribution
        </h3>
        {clicksData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-gray-500">
            No clicks recorded yet
          </div>
        ) : (
          <div className="space-y-4">
            {clicksData.map((item, index) => {
              const totalClicks = clicksData.reduce((sum, d) => sum + d.count, 0);
              const percentage = (item.count / totalClicks) * 100;

              const colors = [
                'bg-purple-500',
                'bg-blue-500',
                'bg-green-500',
                'bg-orange-500',
                'bg-pink-500',
              ];

              return (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{item.type}</span>
                    <span className="text-gray-500">
                      {item.count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${colors[index % colors.length]} h-3 rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
