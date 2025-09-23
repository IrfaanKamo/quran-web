import { SurahList } from "@/components/surah-list";
import { BookOpen } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          QuranMind
        </div>
      </div>

      {/* Surah List */}
      <section className="max-w-6xl mx-auto pt-12 pb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Select a Surah to Memorize
        </h2>
        <SurahList />
      </section>

      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-500 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">QuranMind</h3>
            </div>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              A modern web application designed to help Muslims memorize and understand the Holy Quran
              through interactive learnings. Built with love for the Muslim ummah worldwide.
            </p>
            <div className="text-sm text-gray-500 space-y-2">
              <p className="italic">
                "And We have certainly made the Quran easy for remembrance, so is there any who will remember?"
              </p>
              <p className="text-xs">- Quran 54:17</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
