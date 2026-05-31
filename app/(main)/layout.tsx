"use client";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Home,
  Radio,
  LogOut,
  Newspaper,
  Sparkles,
  Settings,
  FileText,
  GraduationCap,
  Trophy,
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/app/providers";
import { UserAvatar } from "@/components/UserAvatar";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", icon: Home, href: "/home" },
  { label: "Articles", icon: FileText, href: "/articles" },
  { label: "Practice", icon: GraduationCap, href: "/practice" },
  { label: "Atlas AI", icon: Sparkles, href: "/chat", atlas: true },
  { label: "Live Sessions", icon: Radio, href: "/live" },
  { label: "News", icon: Newspaper, href: "/news" },
  { label: "Leaderboard", icon: Trophy, href: "/leaderboard" },
  { label: "Profile Settings", icon: Settings, href: "/profile", profile: true },
];

const MOBILE_NAV_ITEMS = NAV_ITEMS.filter(
  ({ href }) =>
    href !== "/articles" && href !== "/leaderboard" && href !== "/profile",
);

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const showMobileNav = pathname === "/home" || pathname.startsWith("/profile");
  const showMobileBack = !showMobileNav;
  const displayName = user?.full_name?.trim() || "Kalyma Learner";

  const nav = (href: string) => router.push(href);
  const active = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        background:
          pathname === "/home"
            ? "#f3f4fb"
            : pathname === "/chat"
              ? "#ffffff"
              : "#f7f2ea",
        colorScheme: "light",
      }}
    >
      {/* ── SIDEBAR (md+) ─────────────────────────────── */}
      <aside className="hidden md:flex flex-col shrink-0 h-screen w-72 border-r border-[rgba(26,43,94,0.08)] bg-white/80 backdrop-blur-xl z-30 px-5 py-6">
        <div className="px-2 mb-6 shrink-0">
          <Image
            src="/logo with word.webp"
            alt="kalyma"
            width={328}
            height={128}
            className="h-20 w-auto object-contain"
            priority
          />
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon, profile }) => {
              const isActive = active(href);
              return (
                <li key={href}>
                  <button
                    onClick={() => nav(href)}
                    className={cn(
                      "cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-[14px] border-2 text-[15px] font-medium transition-all duration-200 active:scale-[0.98]",
                      isActive
                        ? "border-[#aeb5c9] bg-[#f4efe7] text-[#1a2b5e]"
                      : "border-transparent text-[#667084] hover:border-[#aeb5c9] hover:bg-[#f4efe7] hover:text-[#1a2b5e]",
                    )}
                  >
                    {profile ? (
                      <UserAvatar
                        avatarUrl={user?.avatar_url}
                        name={displayName}
                        size={20}
                      />
                    ) : (
                      <Icon className="h-[20px] w-[20px]" />
                    )}
                    <span>{label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          onClick={() => router.push("/auth")}
          className="cursor-pointer mt-4 flex items-center gap-3 px-4 py-3 rounded-[14px] border-2 border-transparent text-[15px] font-medium text-[#667084] hover:border-[#aeb5c9] hover:bg-[#f4efe7] hover:text-[#1a2b5e] active:scale-[0.98] transition-all duration-200 shrink-0"
        >
          <LogOut className="h-[20px] w-[20px]" />
          <span>Sign out</span>
        </button>
      </aside>

      {/* ── MAIN AREA ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Scrollable content */}
        <main
          className="flex-1 overflow-hidden"
          style={{
            // Chat manages its own scroll; other pages get pb for bottom nav
            overflowY: pathname === "/chat" ? "hidden" : "auto",
            paddingBottom: pathname === "/chat" ? 0 : undefined,
            background:
              pathname === "/home"
                ? "#f3f4fb"
                : pathname === "/chat"
                  ? "#ffffff"
                  : undefined,
          }}
        >
          <div
            style={{
              height: pathname === "/chat" ? "100%" : "auto",
              paddingBottom:
                pathname === "/chat" ? 0 : showMobileNav ? "5rem" : 0,
              background:
                pathname === "/home"
                  ? "#f3f4fb"
                  : pathname === "/chat"
                    ? "#ffffff"
                    : undefined,
            }}
            className={pathname !== "/chat" ? "md:pb-6" : ""}
          >
            {children}
          </div>
        </main>

        {/* Bottom nav — mobile only */}
        {showMobileBack && (
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="fixed left-4 top-4 z-[70] grid h-11 w-11 place-items-center rounded-full border bg-white text-[#17172f] shadow-[0_10px_26px_rgba(31,27,23,0.12)] transition-colors hover:bg-[#f4efe7] md:hidden"
            style={{ borderColor: "#eee6dd" }}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}

        {showMobileNav && (
          <nav
            className="pointer-events-none fixed bottom-4 left-0 right-0 z-50 px-2 md:hidden"
            style={{
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
          >
            <div
              className="pointer-events-auto mx-auto flex h-[78px] max-w-[390px] items-center rounded-[32px] border bg-white px-3"
              style={{
                borderColor: "#eee6dd",
                boxShadow: "0 14px 32px rgba(31,27,23,0.12)",
              }}
            >
              {MOBILE_NAV_ITEMS.map(({ label, icon: Icon, href, atlas }) => {
                const isActive = active(href);
                return (
                  <button
                    key={href}
                    onClick={() => router.push(href)}
                    className="cursor-pointer relative flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-medium transition-colors"
                    style={{ color: isActive ? "#1a2b5e" : "#667084" }}
                  >
                    {atlas ? (
                      <Image
                        src="/atlas-logo.png"
                        alt=""
                        width={23}
                        height={23}
                        className="h-[25px] w-[25px] object-contain"
                      />
                    ) : (
                      <Icon
                        style={{
                          width: 23,
                          height: 23,
                          strokeWidth: isActive ? 2.3 : 1.9,
                          color: "currentColor",
                        }}
                      />
                    )}
                    <span className="leading-none truncate w-full text-center">
                      {label === "Profile Settings" ? "Profile" : label}
                    </span>
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
        )}
      </div>
    </div>
  );
}
