'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Upload, BarChart3, Settings, Search, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const sidebarItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutGrid,
  },
  {
    name: 'Events',
    href: '/events',
    icon: Upload,
  },
  {
    name: 'Search Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl gradient-text">
          <span className="bg-gradient-to-br from-primary to-accent rounded-lg p-2">
            <Search size={20} className="text-primary-foreground" />
          </span>
          Yena
        </Link>
      </div>

      <nav className="px-4 py-6 space-y-2 flex-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-gradient-to-r from-primary/20 to-accent/20 text-primary font-semibold'
                  : 'text-foreground hover:bg-muted'
              )}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        {user && (
          <>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">Signed in as</p>
              <p className="text-sm font-medium truncate">{user.email}</p>
            </div>
            <Separator className="mb-4" />
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={signOut}
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          </>
        )}
      </div>
    </aside>
  );
}
