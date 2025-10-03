import { SurahList } from "@/components/surah-list";
import { BookOpen, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative w-full overflow-hidden bg-gradient-to-br from-green-100 to-green-50">
        <div className="absolute inset-0 bg-grid-green-500/[0.05] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />

        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">
                  Test Your Memory
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
                Select a simple surah below to begin your memorization practice
              </p>
            </div>

            <div className="flex items-center justify-center gap-8 pt-4">
              <div className="flex items-center gap-2 text-green-700">
                <BookOpen className="w-5 h-5" />
                <span className="text-sm font-medium">Easy to Learn</span>
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-medium">Interactive Practice</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Surah List */}
      <section className="max-w-6xl mx-auto pt-12 pb-8">
        <SurahList />
      </section>

      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-500 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Taddabur</h3>
            </div>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              A modern web application designed to help the Ummah memorize and understand
              the Holy Quran through interactive learnings. Built with love for the Muslim
              Ummah.
            </p>
            <div className="text-sm text-gray-500 space-y-2">
              <p className="italic">
                "And We have certainly made the Quran easy to remember. So is there anyone
                who will be mindful? "
              </p>
              <p className="text-xs">- Quran 54:17</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
