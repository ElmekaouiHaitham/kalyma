import type { ReactNode } from "react";

type PageShellProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  maxWidth?: string;
};

export default function PageShell({
  title,
  subtitle,
  action,
  children,
  maxWidth = "max-w-[1464px]",
}: PageShellProps) {
  return (
    <div className="min-h-full px-6 py-10 lg:px-8" style={{ background: "#f7f2ea" }}>
      <div className={`mx-auto ${maxWidth}`}>
        <header
          className="mb-10 flex flex-col gap-5 border-b pb-8 sm:flex-row sm:items-end sm:justify-between"
          style={{ borderColor: "#e6d9c9" }}
        >
          <div>
            <h1
              className="text-[38px] font-semibold leading-tight sm:text-[42px]"
              style={{ color: "#1f1b17", fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-[17px]" style={{ color: "#6f6b66" }}>
                {subtitle}
              </p>
            )}
          </div>
          {action}
        </header>
        {children}
      </div>
    </div>
  );
}
