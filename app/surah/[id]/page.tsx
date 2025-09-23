import { getChapter, getVerses } from '@/lib/quran-api';
// import { ErrorBoundary } from '@/components/ui/error-boundary';
import { notFound } from 'next/navigation';
import { MemorizationInterface } from '@/components/memorization-interface';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SurahPage({ params }: PageProps) {
  const resolvedParams = await params;
  const surahId = parseInt(resolvedParams.id);

  if (isNaN(surahId) || surahId < 1 || surahId > 114) {
    notFound();
  }

  try {
    const [chapterResponse, versesResponse] = await Promise.all([
      getChapter(surahId),
      getVerses(surahId)
    ]);

    const chapter = chapterResponse.chapter;
    const verses = versesResponse.verses;

    if (!verses || verses.length === 0) {
      throw new Error('No verses found for this Surah');
    }

    return (
      // <ErrorBoundary>
        <MemorizationInterface
          verses={verses}
          surahId={surahId}
          surahName={chapter.name_simple}
        />
      // </ErrorBoundary>
    );
  } catch (error) {
    console.error('Error loading Surah:', error);

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Surah</h1>
          <p className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : 'Failed to load Surah data'}
          </p>
          <a
            href="/"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }
}