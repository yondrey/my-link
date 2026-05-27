"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export interface UserProfile {
  displayName: string;
  username: string;
  photoURL: string;
  bio: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isMockMode: boolean;
  refreshProfile: () => Promise<void>;
  signInWithGoogle: () => Promise<any>;
  logout: () => Promise<void>;
  updateLocalProfile: (newProfile: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isMockMode: true,
  refreshProfile: async () => {},
  signInWithGoogle: async () => {},
  logout: async () => {},
  updateLocalProfile: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMockMode, setIsMockMode] = useState(true);

  // Check if we are running in mock mode
  useEffect(() => {
    const isMock = process.env.NEXT_PUBLIC_FIREBASE_API_KEY === undefined || 
                   process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "" || 
                   process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "mock-api-key";
    setIsMockMode(isMock);
  }, []);

  const fetchProfile = async (uid: string) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data() as UserProfile);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (user && !isMockMode) {
      await fetchProfile(user.uid);
    }
  };

  const updateLocalProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
  };

  const signInWithGoogle = async () => {
    if (isMockMode) {
      // Mock Sign In simulation
      const mockUser = {
        uid: "mock-user-123",
        email: "yondrey96@gmail.com",
        displayName: "욘드리 개발자",
        photoURL: "", // Will fall back to a styled avatar
      } as unknown as User;
      
      setUser(mockUser);
      const localProfile = {
        displayName: "yondrey",
        username: "욘드리 개발자",
        photoURL: "",
        bio: "안녕하세요! 바이브 코딩을 배우고 있는 욘드리입니다.",
        createdAt: new Date().toISOString(),
      };
      
      // Store in localStorage for basic mock persistence across refreshes
      localStorage.setItem("mock_user", JSON.stringify(mockUser));
      localStorage.setItem("mock_profile", JSON.stringify(localProfile));
      setProfile(localProfile);
      
      return mockUser;
    } else {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const loggedUser = result.user;
      
      const userDocRef = doc(db, "users", loggedUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        const email = loggedUser.email || "";
        const emailPrefix = email.split("@")[0].toLowerCase().replace(/[^a-z0-9-_]/g, "");
        const initialDisplayName = emailPrefix || `user-${loggedUser.uid.slice(0, 5)}`;
        
        const initialProfile: UserProfile = {
          displayName: initialDisplayName,
          username: loggedUser.displayName || "새 사용자",
          photoURL: loggedUser.photoURL || "",
          bio: "안녕하세요! 마이링크에 오신 것을 환영합니다.",
          createdAt: new Date().toISOString(),
        };
        
        await setDoc(userDocRef, initialProfile);
        setProfile(initialProfile);
      } else {
        setProfile(userDoc.data() as UserProfile);
      }
      
      return loggedUser;
    }
  };

  const logout = async () => {
    if (isMockMode) {
      setUser(null);
      setProfile(null);
      localStorage.removeItem("mock_user");
      localStorage.removeItem("mock_profile");
      localStorage.removeItem("mock_links");
    } else {
      await signOut(auth);
    }
  };

  // Restore session from localStorage if in mock mode
  useEffect(() => {
    if (isMockMode) {
      const savedUser = localStorage.getItem("mock_user");
      const savedProfile = localStorage.getItem("mock_profile");
      if (savedUser && savedProfile) {
        setUser(JSON.parse(savedUser));
        setProfile(JSON.parse(savedProfile));
      }
      setLoading(false);
    } else {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
          await fetchProfile(currentUser.uid);
        } else {
          setProfile(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [isMockMode]);

  return (
    <AuthContext.Provider value={{ user, profile, loading, isMockMode, refreshProfile, signInWithGoogle, logout, updateLocalProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
