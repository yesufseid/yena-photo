"use client";
import { DashboardLayout } from '@/components/dashboard-layout';
import { DashboardCard } from '@/components/dashboard-card';
import { Card } from '@/components/ui/card';
import { Images, Sparkles, Search, ArrowLeft } from 'lucide-react';
import { useEvents } from '@/hooks/use-events';
import Link from 'next/link';

export default function DashboardPage() {
  const { events, loading } = useEvents();
  const totalPhotos = events.reduce((sum, event) => sum + (event.photoCount ?? 1), 0);
  const recentUploads = events.slice(0, 5).map((event) => ({
    id: event.id,
    event: event.name,
    photos: event.photoCount ?? 1,
    date: event.event_date || event.created_at,
  }));

  return (
    <DashboardLayout>
      <Link href="/">
                      <ArrowLeft size={26} />
                    
                    </Link>
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
            value={loading ? 'Loading...' : totalPhotos.toLocaleString()}
            icon={<Images size={24} className="text-primary" />}
            trend={{ value: 12, isPositive: true }}
          />
          <DashboardCard
            title="Total Events"
            value={loading ? 'Loading...' : events.length.toString()}
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
                  {loading ? (
                    <tr>
                      <td className="py-6 px-4 text-center text-sm text-muted-foreground" colSpan={3}>
                        Loading event data...
                      </td>
                    </tr>
                  ) : recentUploads.length === 0 ? (
                    <tr>
                      <td className="py-6 px-4 text-center text-sm text-muted-foreground" colSpan={3}>
                        No recent uploads found.
                      </td>
                    </tr>
                  ) : (
                    recentUploads.map((upload) => (
                      <tr key={upload.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 text-sm">{upload.event}</td>
                        <td className="py-3 px-4 text-sm">{upload.photos}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {upload.date ? new Date(upload.date).toLocaleDateString() : 'Unknown'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
