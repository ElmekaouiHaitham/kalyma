"use client";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  BookOpen,
  MessageCircle,
  Radio,
  User,
  Bell,
  ChevronLeft,
  LogOut,
  Newspaper,
  Sparkles,
  Users,
  Settings,
  LayoutDashboard,
  MessageSquare,
  FileText,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const WEEKLY_PERCENT = 78;

function SidebarSection({ label }: { label: string }) {
  return (
    <div
      className="px-4 pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest"
      style={{ color: "#9aa5b1" }}
    >
      {label}
    </div>
  );
}

function SidebarItem({
  icon: Icon,
  label,
  href,
  active,
  dot,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
  active: boolean;
  dot?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left relative"
      )}
      style={{
        background: active ? "rgba(26,43,94,0.07)" : "transparent",
        color: active ? "#1a2b5e" : "#64748b",
        fontWeight: active ? 700 : 500,
      }}
    >
      {active && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full"
          style={{ background: "#1a2b5e" }}
        />
      )}
      <Icon
        size={17}
        style={{
          strokeWidth: active ? 2.2 : 1.8,
          color: active ? "#1a2b5e" : "#9aa5b1",
          flexShrink: 0,
        }}
      />
      <span className="flex-1 truncate">{label}</span>
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
  { label: "Articles", icon: FileText, href: "/articles" },
  { label: "Books", icon: BookOpen, href: "/library/books" },
  { label: "Practice", icon: Sparkles, href: "/practice" },
  { label: "News", icon: Newspaper, href: "/news" },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/home";

  const nav = (href: string) => router.push(href);
  const active = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#f0f4ff", colorScheme: "light" }}
    >
      {/* ── SIDEBAR (md+) ─────────────────────────────── */}
      <aside
        className="hidden md:flex flex-col shrink-0 overflow-y-auto"
        style={{
          width: 240,
          background: "white",
          borderRight: "1px solid rgba(26,43,94,0.08)",
          boxShadow: "2px 0 12px rgba(26,43,94,0.05)",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-5 py-5 shrink-0"
          style={{ borderBottom: "1px solid rgba(26,43,94,0.07)" }}
        >
          <Image
            src="/logo.png"
            alt="kalyma.ma"
            width={38}
            height={38}
            className="object-contain shrink-0"
            style={{ filter: "drop-shadow(0 1px 4px rgba(201,168,76,0.4))" }}
          />
          <div>
            <div
              className="font-bold text-sm leading-tight"
              style={{ color: "#1a2b5e", fontFamily: "'Outfit', sans-serif" }}
            >
              kalyma.ma
            </div>
            <div className="text-[10px]" style={{ color: "#9aa5b1" }}>
              Speak with confidence
            </div>
          </div>
        </div>

        {/* Dashboard item  */}
        <div className="px-3 pt-3">
          <SidebarItem
            icon={LayoutDashboard}
            label="Dashboard"
            href="/home"
            active={active("/home")}
            onClick={() => nav("/home")}
          />
        </div>

        {/* Weekly Engagement widget */}
        <div
          className="mx-3 mt-3 rounded-xl p-3"
          style={{
            background: "rgba(26,43,94,0.04)",
            border: "1px solid rgba(26,43,94,0.08)",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-[11px] font-bold"
              style={{ color: "#1a2b5e" }}
            >
              Weekly Engagement
            </span>
            <span
              className="text-[11px] font-bold"
              style={{ color: "#1a2b5e" }}
            >
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
          <div
            className="text-[10px] mt-1.5"
            style={{ color: "#9aa5b1" }}
          >
            You&apos;re doing great this week!
          </div>
        </div>

        {/* Library section */}
        <SidebarSection label="Study" />
        <nav className="px-3 space-y-0.5">
          <SidebarItem
            icon={FileText}
            label="Articles"
            href="/articles"
            active={active("/articles")}
            onClick={() => nav("/articles")}
          />
          <SidebarItem
            icon={BookOpen}
            label="Books"
            href="/library/books"
            active={active("/library/books")}
            onClick={() => nav("/library/books")}
          />
        </nav>

        {/* Interact section */}
        <SidebarSection label="Interact" />
        <nav className="px-3 space-y-0.5 flex-1">
          <SidebarItem
            icon={Sparkles}
            label="Atlas AI"
            href="/chat"
            active={active("/chat")}
            onClick={() => nav("/chat")}
          />
          <SidebarItem
            icon={Radio}
            label="Live Sessions"
            href="/live"
            active={active("/live")}
            onClick={() => nav("/live")}
          />

          <SidebarItem
            icon={Newspaper}
            label="News"
            href="/news"
            active={active("/news")}
            onClick={() => nav("/news")}
          />
          <SidebarItem
            icon={Settings}
            label="Profile Settings"
            href="/profile"
            active={active("/profile")}
            onClick={() => nav("/profile")}
          />
        </nav>

        {/* Sign out */}
        <div
          className="px-3 pb-4 pt-3 mt-auto shrink-0"
          style={{ borderTop: "1px solid rgba(26,43,94,0.07)" }}
        >
          {/* Avatar row */}
          <div className="flex items-center gap-3 px-4 py-2.5 mb-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
              style={{ background: "linear-gradient(135deg, #1a2b5e, #2d4080)" }}
            >
              S
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="text-sm font-semibold truncate"
                style={{ color: "#1a2b5e" }}
              >
                Samir
              </div>
              <div className="text-[10px]" style={{ color: "#9aa5b1" }}>
                B1 — Intermediate
              </div>
            </div>
          </div>
          <button
            onClick={() => router.push("/auth")}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{ color: "#ef4444" }}
          >
            <LogOut size={14} style={{ color: "#ef4444" }} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN AREA ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar (mobile only) */}
        {!isHome && (
          <header
            className="md:hidden shrink-0 flex items-center justify-between px-4 z-40"
            style={{
              height: 60,
              background: "white",
              borderBottom: "1px solid rgba(26,43,94,0.08)",
              boxShadow: "0 1px 6px rgba(26,43,94,0.06)",
            }}
          >
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-full"
            style={{ color: isHome ? "transparent" : "#1a2b5e", pointerEvents: isHome ? "none" : "auto" }}
          >
            <ChevronLeft size={22} />
          </button>

          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="kalyma.ma" width={34} height={34} className="object-contain"
              style={{ filter: "drop-shadow(0 1px 3px rgba(201,168,76,0.4))" }} />
            <div>
              <div className="text-sm font-bold leading-none" style={{ fontFamily: "'Outfit', sans-serif", color: "#1a2b5e" }}>kalyma.ma</div>
              <div className="text-[9px] leading-none" style={{ color: "#9aa5b1" }}>Speak with confidence</div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button className="w-9 h-9 flex items-center justify-center rounded-full" style={{ color: "#64748b" }}>
              <Bell size={18} />
            </button>
            <button
              onClick={() => router.push("/profile")}
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white"
              style={{
                background: "linear-gradient(135deg, #1a2b5e, #2d4080)",
                boxShadow: pathname === "/profile"
                  ? "0 0 0 2px white, 0 0 0 3.5px #1a2b5e"
                  : "0 2px 6px rgba(26,43,94,0.25)",
              }}
            >
              S
            </button>
          </div>
        </header>
        )}

        {/* Desktop top utility bar (md+) */}
        <div
          className="hidden md:flex items-center justify-between px-6 py-3 shrink-0"
          style={{
            background: "white",
            borderBottom: "1px solid rgba(26,43,94,0.07)",
          }}
        >
          {/* Breadcrumb / back */}
          {!isHome && (
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-sm font-medium transition-all rounded-lg px-2 py-1.5 hover:bg-gray-100"
              style={{ color: "#1a2b5e" }}
            >
              <ChevronLeft size={16} />
              Back
            </button>
          )}
          {isHome && <div />}

          {/* Right: bell + profile */}
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all" style={{ color: "#64748b" }}>
              <Bell size={18} />
            </button>
            <button
              onClick={() => router.push("/profile")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all hover:bg-gray-50"
              style={{
                border: "1px solid rgba(26,43,94,0.12)",
                background: pathname === "/profile" ? "rgba(26,43,94,0.05)" : "white",
              }}
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: "linear-gradient(135deg, #1a2b5e, #2d4080)" }}>
                S
              </div>
              <span className="text-sm font-medium" style={{ color: "#1a2b5e" }}>Samir</span>
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
          {children}
        </main>

        {/* Bottom nav — mobile only */}
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 z-50"
          style={{
            background: "white",
            borderTop: "1px solid rgba(26,43,94,0.08)",
            boxShadow: "0 -4px 20px rgba(26,43,94,0.08)",
          }}
        >
          <div className="flex items-center h-16 px-2 max-w-md mx-auto">
            {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
              const isActive = pathname === href || pathname.startsWith(href + "/");
              const isLive = href === "/live";
              return (
                <button
                  key={href}
                  onClick={() => router.push(href)}
                  className="flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-all relative"
                >
                  {isLive && (
                    <span className="absolute top-1.5 right-[calc(50%-14px)] w-1.5 h-1.5 rounded-full" style={{ background: "#ef4444" }} />
                  )}
                  <Icon style={{ width: 22, height: 22, strokeWidth: isActive ? 2.2 : 1.8, color: isActive ? (isLive ? "#ef4444" : "#1a2b5e") : "#9aa5b1" }} />
                  <span className="text-[10px] font-semibold" style={{ color: isActive ? (isLive ? "#ef4444" : "#1a2b5e") : "#9aa5b1" }}>
                    {label}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full" style={{ background: isLive ? "#ef4444" : "#1a2b5e" }} />
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
