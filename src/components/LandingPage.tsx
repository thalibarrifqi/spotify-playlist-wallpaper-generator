"use client";

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&q=80')",
          }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
            Spotify Wallpaper Generator
          </h1>
          <p className="text-lg sm:text-xl text-zinc-300 mb-8 animate-fade-in-delay-1">
            Transform your favorite playlists into stunning wallpapers for your
            phone or desktop
          </p>
          <button
            onClick={onGetStarted}
            className="px-8 py-4 bg-[#1db954] hover:bg-[#1ed760] text-white font-semibold text-lg rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 active:scale-95 animate-fade-in-delay-2"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 bg-zinc-900/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-xl bg-zinc-800/50 border border-zinc-700/50 animate-fade-in-delay-1">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#1db954]/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-[#1db954]"
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
              <h3 className="text-white font-semibold mb-2">Fetch Playlist</h3>
              <p className="text-zinc-400 text-sm">
                Paste any Spotify playlist URL and we&apos;ll fetch the album
                artwork
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 rounded-xl bg-zinc-800/50 border border-zinc-700/50 animate-fade-in-delay-2">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#1db954]/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-[#1db954]"
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
              <h3 className="text-white font-semibold mb-2">Customize</h3>
              <p className="text-zinc-400 text-sm">
                Choose themes, gradients, blur effects, spacing, and more
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 rounded-xl bg-zinc-800/50 border border-zinc-700/50 animate-fade-in-delay-3">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#1db954]/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-[#1db954]"
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
              <h3 className="text-white font-semibold mb-2">Download</h3>
              <p className="text-zinc-400 text-sm">
                Export in screen or print quality (up to 3x DPI)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
