'use client';

import { Button } from '@/components/ui/button';

interface FilterBarProps {
  selectedFilter: 'all' | 'high' | 'medium';
  onFilterChange: (filter: 'all' | 'high' | 'medium') => void;
}

export function FilterBar({ selectedFilter, onFilterChange }: FilterBarProps) {
  const filters = [
    { value: 'all' as const, label: 'All' },
    { value: 'high' as const, label: 'High Confidence' },
    { value: 'medium' as const, label: 'Medium Confidence' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          variant={selectedFilter === filter.value ? 'default' : 'outline'}
          className={
            selectedFilter === filter.value
              ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
              : ''
          }
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}
