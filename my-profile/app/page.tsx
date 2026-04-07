export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-8 font-sans dark:bg-black">
      <main className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white sm:text-5xl">
          욘드리
        </h1>
        <p className="max-w-md text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          안녕하세요! 바이브 코딩을 배우고 있는 욘드리입니다.
        </p>
      </main>
    </div>
  );
}
