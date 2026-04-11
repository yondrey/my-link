export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#fafafa] dark:bg-[#050505] p-6 font-sans">
      
      {/* Background Blobs for Animation */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob dark:bg-purple-900 dark:mix-blend-screen" />
      <div 
        className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob dark:bg-blue-900 dark:mix-blend-screen" 
        style={{ animationDelay: "2s" }} 
      />
      <div 
        className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob dark:bg-pink-900 dark:mix-blend-screen" 
        style={{ animationDelay: "4s" }} 
      />

      {/* Main Container / Glassmorphism */}
      <main className="relative z-10 flex flex-col items-center gap-8 text-center bg-white/40 dark:bg-black/40 backdrop-blur-xl p-10 sm:p-14 rounded-3xl border border-white/20 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.05)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] w-full max-w-lg transition-transform duration-500 hover:scale-[1.02] animate-float">
        
        {/* Avatar Section */}
        <div className="relative group cursor-pointer mt-2">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 opacity-70 group-hover:opacity-100 blur transition duration-500 group-hover:duration-200 animate-glow"></div>
          <div className="relative flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-full bg-white dark:bg-zinc-900 border-2 border-white/50 dark:border-zinc-800 shadow-xl overflow-hidden">
            <span className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-purple-500 to-blue-500">
              Y/D
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 via-zinc-900 to-zinc-800 dark:from-white dark:via-zinc-200 dark:to-zinc-400 drop-shadow-sm">
            욘드리
          </h1>
          <p className="max-w-md text-lg font-medium leading-relaxed text-zinc-600 dark:text-zinc-300">
            안녕하세요! <br className="sm:hidden" />
            <span className="font-semibold text-purple-600 dark:text-purple-400">바이브 코딩</span>을 배우고 있는 욘드리입니다.
          </p>
        </div>

        {/* Badges / Skills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
          {["Next.js 15", "React 19", "Tailwind CSS 4", "Vibe Coding"].map((skill) => (
            <span 
              key={skill} 
              className="px-4 py-1.5 text-sm font-semibold rounded-full bg-white/60 dark:bg-white/10 text-zinc-700 dark:text-zinc-200 border border-zinc-200/50 dark:border-white/10 shadow-sm backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-md hover:bg-purple-50 dark:hover:bg-purple-900/30 cursor-default"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Action Button */}
        <button className="mt-4 mb-2 px-8 py-3 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold tracking-wide shadow-lg shadow-zinc-900/20 dark:shadow-white/10 transition-all hover:scale-105 hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-95">
          View Projects
        </button>
      </main>
    </div>
  );
}
