import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Search Analytics</h1>
          <p className="text-muted-foreground">Track search trends and user behavior.</p>
        </div>

        <Card className="p-8 text-center border-0 bg-background card-shadow">
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
          <p className="text-muted-foreground">
            Advanced analytics dashboard with search trends, user insights, and performance metrics.
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
