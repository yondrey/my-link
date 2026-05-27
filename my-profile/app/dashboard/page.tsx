"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth, UserProfile } from "@/context/AuthContext";
import { 
  LogOut, 
  Globe, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  ExternalLink, 
  AlertCircle, 
  Link2,
  FileText,
  User,
  Activity
} from "lucide-react";
import { doc, setDoc, collection, addDoc, updateDoc, deleteDoc, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface LinkItem {
  id: string;
  title: string;
  url: string;
  faviconUrl: string;
  createdAt: string;
}

export default function Dashboard() {
  const { user, profile, loading, isMockMode, logout, updateLocalProfile } = useAuth();
  const router = useRouter();

  // Redirect to login if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Links state
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [linksLoading, setLinksLoading] = useState(true);

  // Profile Inline editing state
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingDisplayName, setIsEditingDisplayName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);

  const [usernameInput, setUsernameInput] = useState("");
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [bioInput, setBioInput] = useState("");

  const [displayNameError, setDisplayNameError] = useState<string | null>(null);

  // Input refs for clicking outside (blur) or ESC
  const usernameRef = useRef<HTMLInputElement>(null);
  const displayNameRef = useRef<HTMLInputElement>(null);
  const bioRef = useRef<HTMLTextAreaElement>(null);

  // Fetch Links
  const fetchLinks = async () => {
    if (!user) return;
    setLinksLoading(true);
    try {
      if (isMockMode) {
        const saved = localStorage.getItem("mock_links");
        if (saved) {
          setLinks(JSON.parse(saved));
        } else {
          const initialMockLinks: LinkItem[] = [
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
            }
          ];
          localStorage.setItem("mock_links", JSON.stringify(initialMockLinks));
          setLinks(initialMockLinks);
        }
      } else {
        const q = query(collection(db, "users", user.uid, "links"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const fetched: LinkItem[] = [];
        snap.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() } as LinkItem);
        });
        setLinks(fetched);
      }
    } catch (err) {
      console.error("Error fetching links:", err);
    } finally {
      setLinksLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchLinks();
      if (profile) {
        setUsernameInput(profile.username);
        setDisplayNameInput(profile.displayName);
        setBioInput(profile.bio);
      }
    }
  }, [user, profile]);

  // Sync state inputs when profile is loaded
  useEffect(() => {
    if (profile) {
      setUsernameInput(profile.username);
      setDisplayNameInput(profile.displayName);
      setBioInput(profile.bio);
    }
  }, [profile]);

  // Check DisplayName uniqueness
  const checkDisplayNameTaken = async (name: string) => {
    if (!user) return false;
    const formattedName = name.trim().toLowerCase();
    
    // Validation regex
    const regex = /^[a-z0-9-_ㄱ-ㅎㅏ-ㅣ가-힣]+$/;
    if (!regex.test(formattedName)) {
      setDisplayNameError("영문 소문자, 숫자, 하이픈(-), 언더바(_), 한글만 입력 가능합니다.");
      return true;
    }

    if (isMockMode) {
      // Mock validation
      const takenNames = ["admin", "root", "mylink", "taken"];
      const isTaken = takenNames.includes(formattedName) && formattedName !== profile?.displayName;
      if (isTaken) {
        setDisplayNameError("이미 사용 중인 닉네임입니다.");
      } else {
        setDisplayNameError(null);
      }
      return isTaken;
    } else {
      try {
        const q = query(collection(db, "users"), where("displayName", "==", formattedName));
        const snap = await getDocs(q);
        let taken = false;
        snap.forEach((doc) => {
          if (doc.id !== user.uid) {
            taken = true;
          }
        });
        if (taken) {
          setDisplayNameError("이미 사용 중인 닉네임입니다.");
        } else {
          setDisplayNameError(null);
        }
        return taken;
      } catch (err) {
        console.error("중복 체크 에러:", err);
        return false;
      }
    }
  };

  // Save Profile fields
  const saveProfileField = async (field: keyof UserProfile, value: string) => {
    if (!user || !profile) return;
    const trimmed = value.trim();

    // Prevent saving if empty
    if (!trimmed && field !== "bio") return;

    const updatedProfile = { ...profile, [field]: trimmed };

    if (isMockMode) {
      updateLocalProfile(updatedProfile);
      localStorage.setItem("mock_profile", JSON.stringify(updatedProfile));
    } else {
      try {
        await setDoc(doc(db, "users", user.uid), updatedProfile);
        updateLocalProfile(updatedProfile);
      } catch (err) {
        console.error("프로필 수정 오류:", err);
      }
    }
  };

  // Esc/Blur Keyboard controls
  const handleKeyDown = (
    e: React.KeyboardEvent, 
    field: "username" | "displayName" | "bio", 
    cancelCallback: () => void, 
    saveCallback: () => void
  ) => {
    if (e.key === "Escape") {
      cancelCallback();
    } else if (e.key === "Enter" && field !== "bio") {
      saveCallback();
    }
  };

  const handleSaveUsername = () => {
    if (usernameInput.trim()) {
      saveProfileField("username", usernameInput);
    } else {
      setUsernameInput(profile?.username || "");
    }
    setIsEditingUsername(false);
  };

  const handleSaveDisplayName = async () => {
    const formatted = displayNameInput.trim().toLowerCase();
    if (!formatted) {
      setDisplayNameInput(profile?.displayName || "");
      setDisplayNameError(null);
      setIsEditingDisplayName(false);
      return;
    }

    if (formatted === profile?.displayName) {
      setDisplayNameError(null);
      setIsEditingDisplayName(false);
      return;
    }

    const isTaken = await checkDisplayNameTaken(formatted);
    if (!isTaken) {
      saveProfileField("displayName", formatted);
      setIsEditingDisplayName(false);
    }
  };

  const handleSaveBio = () => {
    saveProfileField("bio", bioInput);
    setIsEditingBio(false);
  };

  // Link CRUD operations
  const handleAddLink = async () => {
    if (!user) return;
    const newLink = {
      title: "새 링크 제목",
      url: "https://",
      faviconUrl: "",
      createdAt: new Date().toISOString(),
    };

    if (isMockMode) {
      const linkItem: LinkItem = {
        id: `link-${Date.now()}`,
        ...newLink,
      };
      const updated = [linkItem, ...links];
      localStorage.setItem("mock_links", JSON.stringify(updated));
      setLinks(updated);
    } else {
      try {
        const docRef = await addDoc(collection(db, "users", user.uid, "links"), newLink);
        setLinks([{ id: docRef.id, ...newLink }, ...links]);
      } catch (err) {
        console.error("링크 추가 오류:", err);
      }
    }
  };

  const extractDomain = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname;
    } catch {
      return null;
    }
  };

  const handleUpdateLink = async (id: string, title: string, url: string) => {
    if (!user) return;
    
    // URL auto-prefix validation
    let targetUrl = url.trim();
    if (targetUrl && !/^https?:\/\//i.test(targetUrl)) {
      targetUrl = `https://${targetUrl}`;
    }

    const domain = extractDomain(targetUrl);
    const faviconUrl = domain 
      ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` 
      : "";

    if (isMockMode) {
      const updated = links.map(l => 
        l.id === id ? { ...l, title, url: targetUrl, faviconUrl } : l
      );
      localStorage.setItem("mock_links", JSON.stringify(updated));
      setLinks(updated);
    } else {
      try {
        await updateDoc(doc(db, "users", user.uid, "links", id), {
          title,
          url: targetUrl,
          faviconUrl
        });
        setLinks(links.map(l => 
          l.id === id ? { ...l, title, url: targetUrl, faviconUrl } : l
        ));
      } catch (err) {
        console.error("링크 수정 오류:", err);
      }
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!user) return;
    if (!confirm("이 링크를 삭제하시겠습니까?")) return;

    if (isMockMode) {
      const updated = links.filter(l => l.id !== id);
      localStorage.setItem("mock_links", JSON.stringify(updated));
      setLinks(updated);
    } else {
      try {
        await deleteDoc(doc(db, "users", user.uid, "links", id));
        setLinks(links.filter(l => l.id !== id));
      } catch (err) {
        console.error("링크 삭제 오류:", err);
      }
    }
  };

  if (loading || !user || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
          <p className="text-zinc-400 font-medium">관리자 대시보드 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col justify-between selection:bg-violet-500/30 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/10 blur-[100px] pointer-events-none"></div>

      {/* Header */}
      <header className="max-w-5xl mx-auto w-full px-6 py-6 flex justify-between items-center border-b border-white/5 z-10">
        <div className="flex items-center gap-2.5 font-bold text-lg">
          <div className="p-1 bg-gradient-to-tr from-violet-600 to-cyan-500 rounded">
            <Link2 className="h-4.5 w-4.5 text-white" />
          </div>
          <span>MyLink Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/${profile.displayName}`)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold transition"
          >
            <Globe className="h-3.5 w-3.5" />
            내 공개 페이지
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-950/20 border border-red-900/30 text-red-400 hover:bg-red-900/30 text-xs font-semibold transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            로그아웃
          </button>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-12 gap-8 z-10">
        
        {/* Left Column: Profile Card Editor (4 cols) */}
        <section className="md:col-span-5 flex flex-col gap-6">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-6 text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              <User className="h-4 w-4 text-violet-400" />
              <span>프로필 세팅 (클릭하여 수정)</span>
            </div>

            <div className="flex flex-col items-center text-center">
              {/* Avatar Indicator */}
              <div className="relative group mb-6">
                <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-violet-500 to-cyan-400 p-0.5 shadow-lg">
                  {profile.photoURL ? (
                    <img 
                      src={profile.photoURL} 
                      alt={profile.username}
                      className="h-full w-full rounded-full object-cover bg-zinc-900"
                    />
                  ) : (
                    <div className="h-full w-full rounded-full bg-zinc-900 flex items-center justify-center font-bold text-2xl text-white">
                      {profile.username.slice(0, 1)}
                    </div>
                  )}
                </div>
              </div>

              {/* Username Input Field */}
              <div className="w-full mb-4">
                {isEditingUsername ? (
                  <div className="flex flex-col gap-1 items-center">
                    <input
                      ref={usernameRef}
                      type="text"
                      className="w-full text-center bg-zinc-900 border border-violet-500 rounded px-3 py-1 text-lg font-bold outline-none"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      onBlur={handleSaveUsername}
                      onKeyDown={(e) => handleKeyDown(e, "username", () => {
                        setUsernameInput(profile.username);
                        setIsEditingUsername(false);
                      }, handleSaveUsername)}
                      autoFocus
                    />
                    <span className="text-[10px] text-zinc-500">Enter로 저장, ESC로 취소</span>
                  </div>
                ) : (
                  <h2 
                    onClick={() => {
                      setUsernameInput(profile.username);
                      setIsEditingUsername(true);
                    }}
                    className="text-xl font-bold hover:bg-white/5 px-3 py-1.5 rounded cursor-pointer transition inline-block max-w-full truncate"
                  >
                    {profile.username}
                  </h2>
                )}
              </div>

              {/* DisplayName Input Field */}
              <div className="w-full mb-6">
                {isEditingDisplayName ? (
                  <div className="flex flex-col gap-1.5 items-center">
                    <div className="relative w-full flex items-center">
                      <span className="absolute left-3 text-zinc-500 text-sm font-semibold">@</span>
                      <input
                        ref={displayNameRef}
                        type="text"
                        className="w-full pl-7 pr-3 py-1 bg-zinc-900 border border-violet-500 rounded text-sm text-center font-semibold outline-none"
                        value={displayNameInput}
                        onChange={(e) => {
                          setDisplayNameInput(e.target.value);
                          checkDisplayNameTaken(e.target.value);
                        }}
                        onBlur={handleSaveDisplayName}
                        onKeyDown={(e) => handleKeyDown(e, "displayName", () => {
                          setDisplayNameInput(profile.displayName);
                          setDisplayNameError(null);
                          setIsEditingDisplayName(false);
                        }, handleSaveDisplayName)}
                        autoFocus
                      />
                    </div>
                    <span className="text-[10px] text-zinc-500">Enter로 저장, ESC로 취소</span>
                    {displayNameError && (
                      <span className="text-red-400 text-xs font-semibold flex items-center gap-1 mt-1 text-left w-full">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        {displayNameError}
                      </span>
                    )}
                  </div>
                ) : (
                  <div 
                    onClick={() => {
                      setDisplayNameInput(profile.displayName);
                      setIsEditingDisplayName(true);
                    }}
                    className="text-sm font-semibold text-zinc-400 hover:bg-white/5 px-3 py-1 rounded cursor-pointer transition inline-flex items-center gap-1"
                  >
                    @{profile.displayName}
                  </div>
                )}
              </div>

              {/* Bio Textarea Field */}
              <div className="w-full border-t border-white/5 pt-5 text-left">
                <span className="text-xs text-zinc-500 font-semibold block mb-2">한 줄 소개</span>
                {isEditingBio ? (
                  <div className="flex flex-col gap-1">
                    <textarea
                      ref={bioRef}
                      rows={3}
                      className="w-full bg-zinc-900 border border-violet-500 rounded p-3 text-sm outline-none resize-none leading-relaxed"
                      value={bioInput}
                      onChange={(e) => setBioInput(e.target.value)}
                      onBlur={handleSaveBio}
                      onKeyDown={(e) => handleKeyDown(e, "bio", () => {
                        setBioInput(profile.bio);
                        setIsEditingBio(false);
                      }, handleSaveBio)}
                      autoFocus
                    />
                    <span className="text-[10px] text-zinc-500 text-right">ESC로 취소 (텍스트 영역 밖 클릭 시 자동 저장)</span>
                  </div>
                ) : (
                  <p 
                    onClick={() => {
                      setBioInput(profile.bio);
                      setIsEditingBio(true);
                    }}
                    className="text-sm text-zinc-300 hover:bg-white/5 p-3 rounded cursor-pointer transition min-h-[50px] leading-relaxed break-words"
                  >
                    {profile.bio || "작성된 소개글이 없습니다. 클릭하여 추가해보세요."}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Quick Stats/Info */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-400 flex flex-col gap-2.5">
            <div className="flex items-center gap-1.5 font-semibold text-zinc-300 mb-1">
              <Activity className="h-4 w-4 text-cyan-400" />
              <span>활동 정보</span>
            </div>
            <div className="flex justify-between">
              <span>계정 생성일:</span>
              <span className="font-mono text-zinc-300">
                {new Date(profile.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>링크 개수:</span>
              <span className="font-bold text-zinc-300">{links.length}개</span>
            </div>
          </div>
        </section>

        {/* Right Column: Links CRUD Editor (7 cols) */}
        <section className="md:col-span-7 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-violet-400" />
              <span>링크 카드 목록</span>
            </h2>
            <button
              onClick={handleAddLink}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-xs font-bold transition shadow-lg shadow-violet-600/10 hover:shadow-violet-600/20 active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" />
              새 링크 추가
            </button>
          </div>

          {linksLoading ? (
            <div className="flex flex-col justify-center items-center py-20 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent mb-3"></div>
              <p className="text-zinc-400 text-sm">링크 정보를 불러오는 중...</p>
            </div>
          ) : links.length === 0 ? (
            <div className="flex flex-col justify-center items-center py-20 px-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md text-center">
              <Link2 className="h-10 w-10 text-zinc-600 mb-4 animate-pulse" />
              <h3 className="font-semibold text-lg mb-1">등록된 링크가 없습니다</h3>
              <p className="text-zinc-400 text-sm max-w-xs">
                상단의 [새 링크 추가] 버튼을 눌러 첫 번째 소셜 채널이나 작업물 링크를 등록해보세요!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {links.map((link) => (
                <LinkCardEditor
                  key={link.id}
                  link={link}
                  onUpdate={(title, url) => handleUpdateLink(link.id, title, url)}
                  onDelete={() => handleDeleteLink(link.id)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full px-6 py-6 text-center text-xs text-zinc-600 border-t border-white/5 z-10">
        <p>© 2026 MyLink. Manage your public profile page smoothly.</p>
      </footer>
    </div>
  );
}

/* Link Card Editor Sub-Component */
interface LinkCardEditorProps {
  link: LinkItem;
  onUpdate: (title: string, url: string) => void;
  onDelete: () => void;
}

function LinkCardEditor({ link, onUpdate, onDelete }: LinkCardEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [titleInput, setTitleInput] = useState(link.title);
  const [urlInput, setUrlInput] = useState(link.url);

  // Sync inputs on prop updates
  useEffect(() => {
    setTitleInput(link.title);
    setUrlInput(link.url);
  }, [link]);

  const handleSave = () => {
    if (titleInput.trim() !== link.title || urlInput.trim() !== link.url) {
      onUpdate(titleInput, urlInput);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setTitleInput(link.title);
      setUrlInput(link.url);
      setIsEditing(false);
    } else if (e.key === "Enter") {
      handleSave();
    }
  };

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 backdrop-blur-md flex items-center justify-between gap-4 transition duration-300">
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        {/* Favicon Previews */}
        <div className="h-10 w-10 shrink-0 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden">
          {link.faviconUrl ? (
            <img 
              src={link.faviconUrl} 
              alt="Icon"
              className="h-6 w-6 object-contain"
              onError={(e) => {
                // Remove broken image src and trigger fallback icon
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <Link2 className="h-5 w-5 text-zinc-500" />
          )}
        </div>

        {/* Inline Input Fields / Static Texts */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex flex-col gap-1.5 w-full">
              <input
                type="text"
                className="w-full text-sm font-semibold bg-zinc-900 border border-violet-500 rounded px-2.5 py-1 outline-none text-white"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                placeholder="링크 제목 입력"
                autoFocus
              />
              <input
                type="text"
                className="w-full text-xs bg-zinc-900 border border-violet-500 rounded px-2.5 py-1 outline-none text-zinc-400"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                placeholder="https://example.com"
              />
              <span className="text-[9px] text-zinc-500">Enter로 저장, ESC로 취소</span>
            </div>
          ) : (
            <div 
              onClick={() => setIsEditing(true)}
              className="cursor-pointer group flex flex-col gap-0.5 text-left w-full"
            >
              <div className="text-sm font-bold text-zinc-200 group-hover:text-white group-hover:underline flex items-center gap-1.5">
                <span>{link.title || "(제목 없음)"}</span>
              </div>
              <span className="text-xs text-zinc-500 truncate block">
                {link.url || "https://"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        {link.url && (
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition"
            title="링크 직접 방문"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
        <button
          onClick={onDelete}
          className="p-2 rounded-lg bg-red-950/20 hover:bg-red-900/30 border border-red-900/20 hover:border-red-900/40 text-red-400 transition"
          title="링크 삭제"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
