import React from 'react';

export default function Home() {
  const skills = [
    { name: "Next.js 16", color: "bg-neo-yellow" },
    { name: "React 19", color: "bg-neo-pink" },
    { name: "Tailwind 4", color: "bg-neo-blue" },
    { name: "Vibe Coding", color: "bg-neo-green" },
    { name: "TypeScript", color: "bg-neo-yellow" },
    { name: "AI Prompting", color: "bg-neo-pink" },
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-black selection:bg-neo-yellow">
      {/* Top Banner / Marquee */}
      <div className="border-b-4 border-black bg-white overflow-hidden py-2">
        <div className="animate-marquee whitespace-nowrap">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-xl font-black mx-4">
              VIBE CODING • MODERN WEB • RAPID PROTOTYPING • NEXT.JS 16 • REACT 19 • 
            </span>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="px-6 py-12 md:py-24 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6">
          <div className="inline-block self-start px-4 py-1 bg-neo-pink neo-border font-bold -rotate-2">
            HELLO WORLD!
          </div>
          <h1 className="text-6xl md:text-8xl font-black leading-tight">
            I&apos;M <br />
            <span className="bg-neo-yellow px-2 neo-border inline-block rotate-1">YONDREY</span>
          </h1>
          <p className="text-xl md:text-2xl font-bold leading-relaxed max-w-xl">
            AI와 함께 호흡하며 새로운 가치를 만드는 <br />
            <span className="underline decoration-4 decoration-neo-blue">Vibe Coder</span>입니다.
            단순한 코딩을 넘어 바이브를 전달합니다.
          </p>
          <div className="flex gap-4 mt-4">
            <button className="neo-btn bg-black text-white px-8 py-4 text-xl font-black">
              VIEW PROJECTS
            </button>
            <button className="neo-btn bg-neo-green px-8 py-4 text-xl font-black">
              CONTACT ME
            </button>
          </div>
        </div>

        {/* Decorative Graphic instead of Profile image */}
        <div className="relative">
          <div className="w-full aspect-square neo-card bg-neo-blue flex items-center justify-center -rotate-3">
             <div className="text-[12rem] font-black leading-none select-none">;)</div>
          </div>
          <div className="absolute -top-6 -right-6 w-32 h-32 neo-card bg-neo-pink rotate-12 flex items-center justify-center">
            <span className="text-4xl font-black">1996</span>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="bg-white border-y-4 border-black py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black mb-12 uppercase italic">My Arsenal</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skill) => (
              <div key={skill.name} className={`neo-card ${skill.color} hover:translate-x-1 hover:translate-y-1 hover:shadow-neo-hover transition-all`}>
                <h3 className="text-2xl font-black mb-2">{skill.name}</h3>
                <p className="font-bold opacity-80">
                  최신 기술 스택을 활용한 <br /> 고성능 웹 애플리케이션 개발
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="neo-card bg-neo-green rotate-2">
            <h2 className="text-4xl font-black mb-6">Who is Yondrey?</h2>
            <p className="text-lg font-bold leading-relaxed space-y-4">
              욘드리는 인공지능과 개발자의 경계에서 최적의 &apos;바이브&apos;를 찾는 탐험가입니다. 
              복잡한 로직을 AI와 함께 풀어나가며, 사용자에게는 즐거운 경험을, 
              개발자에게는 효율적인 워크플로우를 제안합니다.
            </p>
          </div>
          <div className="flex flex-col gap-8">
            <div className="neo-card bg-white -rotate-1">
              <h3 className="text-2xl font-black mb-4 underline">Vibe Coding?</h3>
              <p className="font-bold">
                단순한 타이핑이 아닌, 의도(Intent)와 맥락(Context)을 전달하여 <br />
                창의적인 결과물을 빠르게 도출하는 혁신적인 개발 방식입니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-black text-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <span className="text-4xl font-black bg-neo-yellow text-black px-4 neo-border">Y/D</span>
          </div>
          <div className="flex gap-8 font-black text-xl">
            <a href="mailto:yondrey96@gmail.com" className="hover:text-neo-blue transition-colors">EMAIL</a>
            <a href="#" className="hover:text-neo-pink transition-colors">GITHUB</a>
            <a href="#" className="hover:text-neo-green transition-colors">LINKEDIN</a>
          </div>
          <p className="font-bold opacity-60">
            © 2026 YONDREY. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
}

