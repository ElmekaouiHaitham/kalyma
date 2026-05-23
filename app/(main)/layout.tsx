"use client";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Radio,
  LogOut,
  Newspaper,
  Sparkles,
  Settings,
  FileText,
  GraduationCap,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/providers";
import { useEffect, useState } from "react";

function SidebarItem({
  icon: Icon,
  label,
  active,
  dot,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  dot?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center rounded-[14px] border text-left transition-all duration-200 hover:border-black hover:bg-[#f7f2ea] hover:text-black",
        active
          ? "border-[#e5e5eb] bg-[#e5e5eb] text-[#18265d]"
          : "border-transparent bg-transparent text-[#667084]"
      )}
      style={{
        height: "clamp(50px, 3.18vw, 61px)",
        gap: "clamp(14px, 1.05vw, 20px)",
        paddingInline: "clamp(16px, 1.05vw, 20px)",
        fontWeight: 500,
      }}
    >
      <Icon
        size={25}
        style={{
          width: "clamp(20px, 1.3vw, 25px)",
          height: "clamp(20px, 1.3vw, 25px)",
          strokeWidth: 2,
          color: "currentColor",
          flexShrink: 0,
        }}
      />
      <span
        className="flex-1 truncate leading-none"
        style={{ fontSize: "clamp(18px, 1.15vw, 22px)" }}
      >
        {label}
      </span>
      {dot && (
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: "#ef4444" }}
        />
      )}
    </button>
  );
}

const NAV_ITEMS = [
  { label: "Home", icon: Home, href: "/home" },
  { label: "News", icon: Newspaper, href: "/news" },
  { label: "Atlas", icon: Sparkles, href: "/chat", atlas: true },
  { label: "Live", icon: Radio, href: "/live" },
  { label: "Practice", icon: GraduationCap, href: "/practice" },
];

type XpHistoryEntry = {
  reason: string;
  created_at: string;
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, session } = useAuth();
  const [xpHistory, setXpHistory] = useState<XpHistoryEntry[]>([]);

  useEffect(() => {
    if (session) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/gamification/me/xp-history`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setXpHistory(data);
        })
        .catch(console.error);
    }
  }, [session]);

  const isThisWeek = (dateString: string) => {
    if (!dateString) return false;
    const d = new Date(dateString);
    const now = new Date();
    return now.getTime() - d.getTime() <= 7 * 24 * 60 * 60 * 1000;
  };

  const articleReadsThisWeek = xpHistory.filter(
    (h) => h.reason === "article_completed" && isThisWeek(h.created_at)
  ).length;
  const targetFreq = user?.preferences?.article_frequency || 2;
  const WEEKLY_PERCENT = Math.min(
    100,
    Math.round((articleReadsThisWeek / Math.max(targetFreq, 1)) * 100)
  );

  const nav = (href: string) => router.push(href);
  const active = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: pathname === "/home" ? "#f3f4fb" : "#f7f2ea", colorScheme: "light" }}
    >
      {/* ── SIDEBAR (md+) ─────────────────────────────── */}
      <aside
        className="hidden md:flex flex-col shrink-0 overflow-y-auto"
        style={{
          width: "clamp(256px, 18.75vw, 360px)",
          background: "white",
          borderRight: "1px solid rgba(26,43,94,0.08)",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center shrink-0"
          style={{
            paddingInline: "clamp(24px, 1.66vw, 32px)",
            paddingTop: "clamp(28px, 1.875vw, 36px)",
            paddingBottom: "clamp(28px, 1.66vw, 32px)",
          }}
        >
          <Image
            src="/logo with word.webp"
            alt="kalyma.ma"
            width={225}
            height={68}
            className="h-auto object-contain"
            style={{ width: "clamp(175px, 11.72vw, 225px)" }}
            priority
          />
        </div>

        {/* Dashboard item */}
        <div className="px-6 pt-2">
          <SidebarItem
            icon={Home}
            label="Dashboard"
            active={active("/home")}
            onClick={() => nav("/home")}
          />
        </div>

        {/* Weekly Engagement widget */}
        <div
          className="mx-6 mt-4 rounded-[14px]"
          style={{
            background: "rgba(245,246,250,0.8)",
            border: "1px solid rgba(26,43,94,0.08)",
            padding: "clamp(12px, 0.84vw, 16px)",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-semibold" style={{ color: "#1a2b5e" }}>
              Weekly Engagement
            </span>
            <span className="text-[13px] font-semibold" style={{ color: "#1a2b5e" }}>
              {WEEKLY_PERCENT}%
            </span>
          </div>
          <div
            className="w-full rounded-full overflow-hidden"
            style={{ height: 6, background: "rgba(26,43,94,0.1)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${WEEKLY_PERCENT}%`,
                background: "linear-gradient(90deg, #1a2b5e, #2d4080)",
              }}
            />
          </div>
          <div className="text-[12px] mt-2" style={{ color: "#8b94a7" }}>
            {WEEKLY_PERCENT === 100 ? "Goal reached! Amazing!" : "Keep up the momentum!"}
          </div>
        </div>

        <nav className="px-6 pt-5 space-y-2">
          <SidebarItem
            icon={FileText}
            label="Articles"
            active={active("/articles")}
            onClick={() => nav("/articles")}
          />
          <SidebarItem
            icon={GraduationCap}
            label="Practice"
            active={active("/practice")}
            onClick={() => nav("/practice")}
          />
        </nav>

        <nav className="px-6 pt-2 space-y-2 flex-1">
          <SidebarItem
            icon={Sparkles}
            label="Atlas AI"
            active={active("/chat")}
            onClick={() => nav("/chat")}
          />
          <SidebarItem
            icon={Radio}
            label="Live Sessions"
            active={active("/live")}
            onClick={() => nav("/live")}
          />
          <SidebarItem
            icon={Newspaper}
            label="News"
            active={active("/news")}
            onClick={() => nav("/news")}
          />
          <SidebarItem
            icon={Settings}
            label="Profile Settings"
            active={active("/profile")}
            onClick={() => nav("/profile")}
          />
        </nav>

        {/* User + Sign out */}
        <div className="px-6 pb-8 pt-6 mt-auto shrink-0">
          <button
            onClick={() => router.push("/auth")}
            className="w-full flex items-center rounded-[14px] border border-transparent font-medium text-[#667084] transition-all hover:border-black hover:bg-[#f7f2ea] hover:text-black"
            style={{
              height: "clamp(50px, 3.18vw, 61px)",
              gap: "clamp(14px, 1.05vw, 20px)",
              paddingInline: "clamp(16px, 1.05vw, 20px)",
              fontSize: "clamp(18px, 1.15vw, 22px)",
            }}
          >
            <LogOut
              size={25}
              style={{
                width: "clamp(20px, 1.3vw, 25px)",
                height: "clamp(20px, 1.3vw, 25px)",
                color: "currentColor",
              }}
            />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── MAIN AREA ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Mobile top bar — hidden on reader pages and home */}
        {/* Scrollable content */}
        <main
          className="flex-1 overflow-hidden"
          style={{
            // Chat manages its own scroll; other pages get pb for bottom nav
            overflowY: pathname === "/chat" ? "hidden" : "auto",
            paddingBottom: pathname === "/chat" ? 0 : undefined,
            background: pathname === "/home" ? "#f3f4fb" : undefined,
          }}
          // Give chat page full height to flex properly
        >
          <div
            style={{
              height: pathname === "/chat" ? "100%" : "auto",
              paddingBottom: pathname === "/chat" ? 0 : "5rem",
              background: pathname === "/home" ? "#f3f4fb" : undefined,
            }}
            className={pathname !== "/chat" ? "md:pb-6" : ""}
          >
            {children}
          </div>
        </main>

        {/* Bottom nav — mobile only */}
        <nav
          className="pointer-events-none fixed bottom-4 left-0 right-0 z-50 px-5 md:hidden"
          style={{
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          <div
            className="pointer-events-auto mx-auto flex h-[66px] max-w-[340px] items-center rounded-[28px] border bg-white px-3"
            style={{
              borderColor: "#eee6dd",
              boxShadow: "0 14px 32px rgba(31,27,23,0.12)",
            }}
          >
            {NAV_ITEMS.map(({ label, icon: Icon, href, atlas }) => {
              const isActive = pathname === href || pathname.startsWith(href + "/");
              return (
                <button
                  key={href}
                  onClick={() => router.push(href)}
                  className="relative flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-medium transition-colors"
                  style={{ color: isActive ? "#1a2b5e" : "#667084" }}
                >
                  {atlas ? (
                    <Image
                      src="/atlas-logo.png"
                      alt=""
                      width={23}
                      height={23}
                      className="h-[23px] w-[23px] object-contain"
                    />
                  ) : (
                    <Icon
                      style={{
                        width: 21,
                        height: 21,
                        strokeWidth: isActive ? 2.3 : 1.9,
                        color: "currentColor",
                      }}
                    />
                  )}
                  <span className="leading-none">{label}</span>
                  {isActive && (
                    <span
                      className="absolute bottom-2 h-[3px] w-6 rounded-full"
                      style={{ background: "#1a2b5e" }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
