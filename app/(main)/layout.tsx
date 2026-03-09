"use client";
import { usePathname, useRouter } from "next/navigation";
import { Home, BookOpen, MessageCircle, Radio } from "lucide-react";
import { Bell, ChevronLeft } from "lucide-react";
import Image from "next/image";

const NAV_ITEMS = [
  { label: "Home", icon: Home, href: "/home" },
  { label: "Library", icon: BookOpen, href: "/library" },
  { label: "Live", icon: Radio, href: "/live" },
  { label: "Chat", icon: MessageCircle, href: "/chat" },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === "/home";

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ background: "#f0f4ff", colorScheme: "light" }}
    >
      {/* Top Header Bar */}
      <header
        className="shrink-0 flex items-center justify-between px-4 z-40"
        style={{
          height: 60,
          background: "white",
          borderBottom: "1px solid rgba(26,43,94,0.08)",
          boxShadow: "0 1px 6px rgba(26,43,94,0.06)",
        }}
      >
        {/* Left: back arrow */}
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full transition-colors"
          style={{
            color: isHome ? "transparent" : "#1a2b5e",
            pointerEvents: isHome ? "none" : "auto",
          }}
        >
          <ChevronLeft size={22} />
        </button>

        {/* Center: Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="kalyma.ma logo"
            width={36}
            height={36}
            className="object-contain"
            style={{ filter: "drop-shadow(0 1px 3px rgba(201,168,76,0.4))" }}
          />
          <div>
            <div
              className="text-base font-bold leading-none"
              style={{ fontFamily: "'Outfit', sans-serif", color: "#1a2b5e" }}
            >
              kalyma.ma
            </div>
            <div className="text-[9px] leading-none" style={{ color: "#9aa5b1" }}>
              Speak with confidence
            </div>
          </div>
        </div>

        {/* Right: Bell + Profile avatar */}
        <div className="flex items-center gap-1.5">
          <button
            className="w-9 h-9 flex items-center justify-center rounded-full transition-colors hover:bg-gray-100"
            style={{ color: "#64748b" }}
          >
            <Bell size={18} />
          </button>

          {/* Profile avatar button */}
          <button
            onClick={() => router.push("/profile")}
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white transition-all hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #1a2b5e, #2d4080)",
              boxShadow:
                pathname === "/profile"
                  ? "0 0 0 2px white, 0 0 0 3.5px #1a2b5e"
                  : "0 2px 6px rgba(26,43,94,0.25)",
            }}
          >
            S
          </button>
        </div>
      </header>

      {/* Main content area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto pb-20">{children}</div>

        {/* Bottom Navigation */}
        <nav
          className="fixed bottom-0 left-0 right-0 z-50"
          style={{
            background: "white",
            borderTop: "1px solid rgba(26,43,94,0.08)",
            boxShadow: "0 -4px 20px rgba(26, 43, 94, 0.08)",
          }}
        >
          <div className="flex items-center h-16 px-2 max-w-md mx-auto">
            {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
              const active =
                pathname === href || pathname.startsWith(href + "/");
              const isLive = href === "/live";
              return (
                <button
                  key={href}
                  onClick={() => router.push(href)}
                  className="flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-all duration-150 relative"
                >
                  {/* Live tab gets a red dot indicator */}
                  {isLive && (
                    <span
                      className="absolute top-1.5 right-[calc(50%-14px)] w-1.5 h-1.5 rounded-full"
                      style={{ background: "#ef4444" }}
                    />
                  )}
                  <Icon
                    style={{
                      width: 22,
                      height: 22,
                      strokeWidth: active ? 2.2 : 1.8,
                      color: active
                        ? isLive
                          ? "#ef4444"
                          : "#1a2b5e"
                        : "#9aa5b1",
                    }}
                  />
                  <span
                    className="text-[10px] font-semibold"
                    style={{
                      color: active
                        ? isLive
                          ? "#ef4444"
                          : "#1a2b5e"
                        : "#9aa5b1",
                    }}
                  >
                    {label}
                  </span>
                  {active && (
                    <span
                      className="absolute bottom-1 w-1 h-1 rounded-full"
                      style={{
                        background: isLive ? "#ef4444" : "#1a2b5e",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </main>
    </div>
  );
}
