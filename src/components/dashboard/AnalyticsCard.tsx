import { Card, CardContent } from '@/components/ui/Card';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function AnalyticsCard({
  title,
  value,
  subtitle,
  trend,
}: AnalyticsCardProps) {
  return (
    <Card>
      <CardContent className="py-6">
        <p className="text-sm text-gray-600">{title}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <p className="text-3xl font-bold text-purple-600">{value}</p>
          {trend && (
            <span
              className={`text-sm font-medium ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trend.isPositive ? '+' : ''}
              {trend.value}%
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}
