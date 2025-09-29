'use client';

import { useState, useEffect } from 'react';
import { Surah } from '@/types/quran';
import { getChapters } from '@/lib/quran-api';
// import { LoadingSpinner } from './ui/loading-spinner';
// import { ErrorBoundary } from './ui/error-boundary';
import Link from 'next/link';
import { BookOpen, MapPin } from 'lucide-react';
import { ErrorBoundary } from '@/components/ui/error-boundary';

export function SurahList() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSurahs() {
      try {
        setLoading(true);
        const response = await getChapters();
        setSurahs(response.chapters);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load chapters');
      } finally {
        setLoading(false);
      }
    }

    fetchSurahs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        {/* <LoadingSpinner size={32} /> */}
        <span className="ml-2 text-gray-600">Loading Surahs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-00 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {surahs.map((surah) => (
          <Link
            key={surah.id}
            href={`/surah/${surah.id}`}
            className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-500 transition-colors">
                  {surah.id}. {surah.name_simple}
                </h3>
                <p className="text-gray-600 text-sm mt-1">{surah.translated_name.name}</p>
              </div>
              <div className="text-right text-2xl font-arabic text-gray-900 group-hover:text-green-500 transition-colors">
                {surah.name_arabic}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <BookOpen size={16} className="mr-1" />
                <span>{surah.verses_count} verses</span>
              </div>
              <div className="flex items-center">
                <MapPin size={16} className="mr-1" />
                <span className="capitalize">{surah.revelation_place}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </ErrorBoundary>
  );
}