"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Link2, LayoutDashboard, ExternalLink } from "lucide-react";

interface PublicProfile {
  uid: string;
  displayName: string;
  username: string;
  photoURL: string;
  bio: string;
  createdAt: string;
}

interface LinkItem {
  id: string;
  title: string;
  url: string;
  faviconUrl: string;
  createdAt: string;
}

// Mock data for demo mode
const MOCK_PROFILE: PublicProfile = {
  uid: "mock-user-123",
  displayName: "yondrey",
  username: "욘드리 개발자",
  photoURL: "",
  bio: "안녕하세요! 바이브 코딩을 배우고 있는 욘드리입니다.",
  createdAt: new Date().toISOString(),
};

const MOCK_LINKS: LinkItem[] = [
  {
    id: "link-1",
    title: "나의 GitHub 저장소",
    url: "https://github.com/yondrey",
    faviconUrl: "https://www.google.com/s2/favicons?domain=github.com&sz=64",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "link-2",
    title: "개인 기술 블로그",
    url: "https://velog.io",
    faviconUrl: "https://www.google.com/s2/favicons?domain=velog.io&sz=64",
    createdAt: new Date().toISOString(),
  },
];

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user, profile: myProfile, isMockMode } = useAuth();
  const displayName = params?.displayName as string;

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const isOwner =
    user &&
    myProfile &&
    myProfile.displayName === decodeURIComponent(displayName);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      setLoading(true);
      const decodedName = decodeURIComponent(displayName);

      try {
        if (isMockMode) {
          // In mock mode, check localStorage for profile
          const savedProfile = localStorage.getItem("mock_profile");
          if (
            savedProfile &&
            JSON.parse(savedProfile).displayName === decodedName
          ) {
            const mockProfileData = JSON.parse(savedProfile);
            setProfile({
              uid: "mock-user-123",
              displayName: mockProfileData.displayName,
              username: mockProfileData.username,
              photoURL: mockProfileData.photoURL || "",
              bio: mockProfileData.bio,
              createdAt: mockProfileData.createdAt,
            });

            // Load links from localStorage
            const savedLinks = localStorage.getItem("mock_links");
            if (savedLinks) {
              setLinks(JSON.parse(savedLinks));
            } else {
              setLinks(MOCK_LINKS);
            }
          } else if (decodedName === MOCK_PROFILE.displayName) {
            setProfile(MOCK_PROFILE);
            setLinks(MOCK_LINKS);
          } else {
            setNotFound(true);
          }
        } else {
          // Real Firebase mode
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("displayName", "==", decodedName));
          const snap = await getDocs(q);

          if (snap.empty) {
            setNotFound(true);
          } else {
            const docData = snap.docs[0];
            const userData = docData.data() as Omit<PublicProfile, "uid">;
            setProfile({ uid: docData.id, ...userData });

            // Fetch links
            const linksQ = query(
              collection(db, "users", docData.id, "links"),
              orderBy("createdAt", "desc")
            );
            const linksSnap = await getDocs(linksQ);
            const fetchedLinks: LinkItem[] = [];
            linksSnap.forEach((d) => {
              fetchedLinks.push({ id: d.id, ...d.data() } as LinkItem);
            });
            setLinks(fetchedLinks);
          }
        }
      } catch (err) {
        console.error("프로필 로드 오류:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (displayName) {
      fetchPublicProfile();
    }
  }, [displayName, isMockMode]);

  // Handle link click with clickCount increment
  const handleLinkClick = async (link: LinkItem) => {
    // In real mode, increment clickCount here
    // For now just open the link
    window.open(link.url, "_blank", "noopener,noreferrer");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
          <p className="text-zinc-400 text-sm font-medium">프로필 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 404 Not Found state
  if (notFound || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white px-6 text-center">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[60%] h-[40%] rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />
        <div className="relative flex flex-col items-center gap-5 z-10">
          <div className="text-7xl font-black bg-gradient-to-b from-white to-zinc-600 bg-clip-text text-transparent">
            404
          </div>
          <h1 className="text-xl font-bold text-zinc-200">존재하지 않는 프로필 주소입니다</h1>
          <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
            <span className="font-mono text-violet-400">@{decodeURIComponent(displayName)}</span> 닉네임을 가진
            사용자를 찾을 수 없었습니다. 주소를 다시 확인해 주세요.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 font-bold text-sm transition active:scale-95"
          >
            홈으로 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans relative overflow-hidden selection:bg-violet-500/30">
      {/* Background ambient blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[50%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[40%] h-[40%] rounded-full bg-cyan-600/10 blur-[100px] pointer-events-none" />

      {/* Owner shortcut header */}
      {isOwner && (
        <div className="relative z-20 flex justify-center pt-5 px-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/15 hover:bg-white/10 backdrop-blur-md text-xs font-semibold transition text-zinc-300 hover:text-white"
          >
            <LayoutDashboard className="h-3.5 w-3.5 text-violet-400" />
            대시보드로 가기
          </button>
        </div>
      )}

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center px-5 pt-14 pb-20 max-w-lg mx-auto">
        {/* Avatar */}
        <div className="animate-float mb-6">
          <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-violet-500 to-cyan-400 p-0.5 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
            {profile.photoURL ? (
              <img
                src={profile.photoURL}
                alt={profile.username}
                className="h-full w-full rounded-full object-cover bg-zinc-900"
              />
            ) : (
              <div className="h-full w-full rounded-full bg-zinc-900 flex items-center justify-center font-black text-3xl text-white">
                {profile.username.slice(0, 1)}
              </div>
            )}
          </div>
        </div>

        {/* Username */}
        <h1 className="text-2xl font-extrabold tracking-tight text-white mb-1 text-center">
          {profile.username}
        </h1>

        {/* displayName slug */}
        <p className="text-sm font-semibold text-zinc-500 mb-4">
          @{profile.displayName}
        </p>

        {/* Bio */}
        {profile.bio && (
          <p className="text-sm text-zinc-400 text-center leading-relaxed max-w-xs mb-10">
            {profile.bio}
          </p>
        )}

        {/* Links */}
        <div className="w-full flex flex-col gap-3.5">
          {links.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-14 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center">
              <Link2 className="h-8 w-8 text-zinc-600 animate-pulse" />
              <p className="text-sm text-zinc-500">아직 등록된 링크가 없습니다.</p>
            </div>
          ) : (
            links.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link)}
                className="group w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/40 hover:bg-white/10 backdrop-blur-md transition-all duration-300 text-left hover:shadow-[0_0_20px_rgba(139,92,246,0.1)] active:scale-[0.98]"
              >
                {/* Favicon */}
                <div className="h-10 w-10 shrink-0 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-violet-500/30 transition">
                  {link.faviconUrl ? (
                    <img
                      src={link.faviconUrl}
                      alt={link.title}
                      className="h-6 w-6 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <Link2 className="h-4.5 w-4.5 text-zinc-500" />
                  )}
                </div>

                {/* Link Title */}
                <span className="flex-1 font-semibold text-sm text-zinc-200 group-hover:text-white transition truncate">
                  {link.title}
                </span>

                {/* Arrow Icon */}
                <ExternalLink className="h-4 w-4 text-zinc-600 group-hover:text-violet-400 shrink-0 transition" />
              </button>
            ))
          )}
        </div>

        {/* Powered by MyLink footer badge */}
        <div className="mt-14 flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="p-0.5 bg-gradient-to-tr from-violet-600 to-cyan-500 rounded">
            <Link2 className="h-3 w-3 text-white" />
          </div>
          <span className="text-xs text-zinc-500 font-semibold">
            Powered by{" "}
            <button
              onClick={() => router.push("/")}
              className="text-zinc-300 hover:text-white transition"
            >
              MyLink
            </button>
          </span>
        </div>
      </main>
    </div>
  );
}
