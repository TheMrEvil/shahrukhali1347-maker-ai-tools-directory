'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Star, Bookmark, TrendingUp, CheckCircle, ExternalLink, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { AITool } from '@/types';
import { getPricingLabel } from '@/lib/utils';

interface ToolCardProps {
  tool: AITool;
}

// Returns a relative-time label for a listing's dateUpdated, but only if the
// listing was reviewed within the last 60 days. The `fresh` flag turns the
// badge a stronger green when the review is within 14 days.
function formatReviewed(iso: string): { label: string; fresh: boolean } | null {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (days > 60) return null;
  const label =
    days <= 0
      ? 'today'
      : days === 1
      ? '1 day ago'
      : days < 30
      ? `${days} days ago`
      : `${Math.round(days / 7)} weeks ago`;
  return { label, fresh: days <= 14 };
}

export default function ToolCard({ tool }: ToolCardProps) {
  const pricingLabel = getPricingLabel(tool.pricing);
  const [imgError, setImgError] = useState(false);
  const reviewed = formatReviewed(tool.dateUpdated);

  // Get initials for fallback
  const getInitials = (name: string) => {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800/90 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700/50 flex flex-col h-full backdrop-blur-sm">
      {/* Gradient border effect on hover */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />

      {/* Clean Image Container */}
      <div className="relative p-4 pb-0">
        <div className="relative h-36 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
          {/* Logo Container - clean white background */}
          <div className="absolute inset-0 flex items-center justify-center p-6">
            {!imgError ? (
              <img
                src={tool.logo}
                alt={`${tool.name} AI tool logo`}
                className="max-w-full max-h-full w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-500"
                onError={() => setImgError(true)}
                loading="lazy"
                decoding="async"
              />
            ) : (
              /* Clean text fallback - no gradient */
              <span className="text-3xl font-bold text-gray-400 dark:text-gray-500">
                {getInitials(tool.name)}
              </span>
            )}
          </div>

          {/* Floating badges */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1.5 z-10">
            <div className={`px-2.5 py-1 text-xs font-bold rounded-lg backdrop-blur-md shadow-lg ${
              pricingLabel === 'Free'
                ? 'bg-emerald-500/90 text-white'
                : pricingLabel === 'Freemium'
                ? 'bg-blue-500/90 text-white'
                : 'bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white'
            }`}>
              {pricingLabel}
            </div>
          </div>


          {/* Quick visit button on hover */}
          <div className="absolute bottom-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <a
              href={tool.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-lg text-xs font-semibold text-gray-900 dark:text-white shadow-lg hover:scale-105 transition-transform"
            >
              Visit
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Tool Info */}
      <div className="p-4 pt-3 flex flex-col flex-1">
        {/* Header with name and rating */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link href={`/tools/${tool.slug}`} className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors truncate">
              {tool.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex-shrink-0">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
              {tool.rating.average}
            </span>
          </div>
        </div>

        {/* Badges row */}
        {(tool.verified || tool.trending || reviewed) && (
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {tool.verified && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-md">
                <CheckCircle className="w-3 h-3" />
                Verified
              </div>
            )}
            {tool.trending && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-semibold rounded-md">
                <TrendingUp className="w-3 h-3" />
                Hot
              </div>
            )}
            {reviewed && (
              <div
                title={`Listing reviewed by editors on ${tool.dateUpdated}`}
                className={`flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md ${
                  reviewed.fresh
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-300'
                }`}
              >
                <ShieldCheck className="w-3 h-3" />
                Reviewed {reviewed.label}
              </div>
            )}
          </div>
        )}

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed">
          {tool.tagline}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tool.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-lg font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto">
          <Link
            href={`/tools/${tool.slug}`}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 text-sm font-semibold text-center"
          >
            View Details
          </Link>

          <button
            className="p-2.5 bg-gray-100 dark:bg-gray-700/50 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group/btn"
            aria-label="Bookmark tool"
          >
            <Bookmark className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover/btn:text-purple-600 dark:group-hover/btn:text-purple-400 transition-colors" />
          </button>

          <a
            href={tool.website}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-gray-100 dark:bg-gray-700/50 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group/btn"
            aria-label="Visit website"
          >
            <ExternalLink className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover/btn:text-purple-600 dark:group-hover/btn:text-purple-400 transition-colors" />
          </a>
        </div>
      </div>
    </div>
  );
}
