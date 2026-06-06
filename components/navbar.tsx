'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl gradient-text">
            <span className="bg-gradient-to-br from-primary to-accent rounded-lg p-2">
              <Search size={20} className="text-primary-foreground" />
            </span>
            Yena
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/find-photos" className="text-foreground hover:text-primary transition-colors">
              Find Photos
            </Link>
            <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors">
              Upload Photos
            </Link>
          </div>

          {/* Desktop CTA Button & Theme Toggle */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Button
              asChild
              className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-primary-foreground"
            >
              <Link href="/find-photos">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Theme Toggle & Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-border">
            <div className="pt-4 space-y-3">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                Home
              </Link>
              <Link
                href="/find-photos"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                Find Photos
              </Link>
              <Link
                href="/upload-photos"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                Upload Photos
              </Link>
              <Button
                asChild
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-primary-foreground"
              >
                <Link href="/find-photos" onClick={() => setIsMenuOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
