"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Link2, ArrowRight, Shield, Zap, Sparkles } from "lucide-react";

export default function Home() {
  const { user, loading, isMockMode, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setError(null);
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
          <p className="text-zinc-400 font-medium">불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-zinc-950 text-white overflow-hidden font-sans selection:bg-violet-500/30">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/20 blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="p-1.5 bg-gradient-to-tr from-violet-600 to-cyan-500 rounded-lg">
            <Link2 className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">MyLink</span>
        </div>
        {isMockMode && (
          <span className="text-xs font-semibold px-3 py-1 bg-violet-950/50 text-violet-400 border border-violet-800/40 rounded-full flex items-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
            시뮬레이션 모드 작동 중
          </span>
        )}
      </header>

      {/* Main Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 z-10 text-center max-w-4xl mx-auto">
        <div className="animate-float flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 mb-6 backdrop-blur-sm">
            <Sparkles className="h-3 w-3 text-violet-400" />
            <span>단 1분만에 만드는 나만의 링크 페이지</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent leading-none">
            모든 활동과 포트폴리오를<br />
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              하나의 링크로 연결하세요
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed">
            흩어져 있는 기술 블로그, GitHub, SNS, 그리고 포트폴리오 프로젝트들을 
            깔끔한 멀티링크 프로필로 보기 쉽게 모아 방문자들과 나누어 보세요.
          </p>

          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-white text-zinc-950 hover:bg-zinc-100 font-bold rounded-full transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] disabled:opacity-75 disabled:cursor-not-allowed text-base overflow-hidden"
            >
              {isLoggingIn ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-950 border-t-transparent"></div>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#000000"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#000000"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#000000"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#000000"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              <span>Google 계정으로 시작하기</span>
              <ArrowRight className="h-4 w-4 text-zinc-950 group-hover:translate-x-1 transition-transform" />
            </button>

            {error && (
              <p className="text-red-400 text-xs font-semibold mt-2">{error}</p>
            )}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-24">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-left flex flex-col gap-3">
            <div className="p-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-lg w-fit">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg">인라인 즉시 편집</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              복잡한 새 창 이동이나 팝업창 없이, 대시보드 안에서 클릭 한 번으로 모든 프로필과 링크 정보를 인라인으로 빠르게 편집하세요.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-left flex flex-col gap-3">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg w-fit">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg">자동 파비콘 연동</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              링크 URL을 작성하기만 하면, Google Favicon API가 자동으로 사이트의 아이콘 이미지를 파싱해 보기 좋게 렌더링합니다.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-left flex flex-col gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg w-fit">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg">모바일 최적화 레이아웃</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              언제 어디서든 깔끔하게 열리는 모바일 친화형 글래스모피즘 랜딩 페이지를 통해 방문자들에게 강렬한 첫인상을 선사합니다.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full px-6 py-8 text-center text-xs text-zinc-600 border-t border-white/5 z-10">
        <p>© 2026 MyLink. Built for Developers & Creators.</p>
      </footer>
    </div>
  );
}
