import { Metadata } from 'next';
import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Page Not Found | Best AI Tools',
  description: 'The page you are looking for could not be found. Browse our directory of 2100+ AI tools or return to the homepage.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[var(--paper-2)]">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-[var(--ink)] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-[var(--ink-soft)] mb-4">
          Page Not Found
        </h2>
        <p className="text-[var(--ink-soft)] mb-8 max-w-md">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been
          moved or doesn&apos;t exist.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button>
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Link href="/tools">
            <Button variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Browse Tools
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
