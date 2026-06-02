import { DashboardLayout } from '@/components/dashboard-layout';
import { DashboardCard } from '@/components/dashboard-card';
import { Card } from '@/components/ui/card';
import { Images, Sparkles, Search } from 'lucide-react';

const recentUploads = [
  { id: 1, event: 'Summer Festival 2024', photos: 342, date: '2024-05-28' },
  { id: 2, event: 'Wedding Reception', photos: 156, date: '2024-05-25' },
  { id: 3, event: 'Corporate Gala', photos: 289, date: '2024-05-20' },
  { id: 4, event: 'Birthday Party', photos: 87, date: '2024-05-18' },
  { id: 5, event: 'Beach Event', photos: 201, date: '2024-05-15' },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s your account overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Total Photos"
            value="5,430"
            icon={<Images size={24} className="text-primary" />}
            trend={{ value: 12, isPositive: true }}
          />
          <DashboardCard
            title="Total Faces Indexed"
            value="12,780"
            icon={<Sparkles size={24} className="text-accent" />}
            trend={{ value: 8, isPositive: true }}
          />
          <DashboardCard
            title="Total Searches"
            value="2,340"
            icon={<Search size={24} className="text-primary" />}
            trend={{ value: 23, isPositive: true }}
          />
        </div>

        {/* Recent Uploads */}
        <Card className="border-0 bg-background card-shadow">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Recent Uploads</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-sm">Event</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Photos</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUploads.map((upload) => (
                    <tr key={upload.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 text-sm">{upload.event}</td>
                      <td className="py-3 px-4 text-sm">{upload.photos}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {new Date(upload.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
