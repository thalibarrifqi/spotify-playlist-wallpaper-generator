"use client";

import Image from "next/image";

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Full-page Background Image (LCP element) */}
      <Image
        src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819"
        alt=""
        fill
        preload
        sizes="100vw"
        className="object-cover"
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/75 to-black/85" />

      {/* Centered content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-8 sm:py-16">
        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-5xl md:text-6xl font-bold text-white mb-2 sm:mb-4 animate-fade-in">
            Spotify Wallpaper Generator
          </h1>
          <p className="text-sm sm:text-xl text-zinc-300 mb-5 sm:mb-8 animate-fade-in-delay-1">
            Transform your favorite playlists into stunning wallpapers for your
            phone or desktop
          </p>
          <button
            type="button"
            onClick={onGetStarted}
            className="px-6 py-3 sm:px-8 sm:py-4 bg-[#11853a] hover:bg-[#12883b] text-white font-semibold text-base sm:text-lg rounded-full transition-all duration-200 sm:hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 active:scale-95 animate-fade-in-delay-2"
          >
            Get Started
          </button>
        </div>

        {/* Features */}
        <div className="w-full max-w-4xl mx-auto mt-8 sm:mt-16">
          <div className="grid grid-cols-3 gap-2 sm:gap-8">
            {/* Feature 1 */}
            <div className="text-center p-3 sm:p-6 rounded-xl bg-zinc-800/70 border border-zinc-700/50 animate-fade-in-delay-1">
              <div className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-4 rounded-full bg-[#11853a]/20 flex items-center justify-center">
                <svg
                  className="w-4 h-4 sm:w-6 sm:h-6 text-[#11853a]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 mt-1 sm:mt-2">
                Paste a Spotify URL to fetch album artwork
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-3 sm:p-6 rounded-xl bg-zinc-800/70 border border-zinc-700/50 animate-fade-in-delay-2">
              <div className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-4 rounded-full bg-[#11853a]/20 flex items-center justify-center">
                <svg
                  className="w-4 h-4 sm:w-6 sm:h-6 text-[#11853a]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 mt-1 sm:mt-2">
                Customize themes, effects, and more
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-3 sm:p-6 rounded-xl bg-zinc-800/70 border border-zinc-700/50 animate-fade-in-delay-3">
              <div className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-4 rounded-full bg-[#11853a]/20 flex items-center justify-center">
                <svg
                  className="w-4 h-4 sm:w-6 sm:h-6 text-[#11853a]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 mt-1 sm:mt-2">
                Export up to print quality
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
