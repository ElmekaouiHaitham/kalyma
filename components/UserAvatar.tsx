"use client";

import { useState } from "react";

type UserAvatarProps = {
  avatarUrl?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
  textClassName?: string;
};

function getInitials(name?: string | null) {
  const displayName = name?.trim() || "Kalyma User";
  return (
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "KU"
  );
}

export function UserAvatar({
  avatarUrl,
  name,
  size,
  className = "",
  textClassName = "",
}: UserAvatarProps) {
  const [failedAvatarUrl, setFailedAvatarUrl] = useState<string | null>(null);
  const showImage = avatarUrl && failedAvatarUrl !== avatarUrl;
  const initials = getInitials(name);

  return (
    <div
      className={`grid shrink-0 place-items-center overflow-hidden rounded-full bg-[#202b67] text-white ${className}`}
      style={size ? { width: size, height: size } : undefined}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt={name?.trim() || "User avatar"}
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setFailedAvatarUrl(avatarUrl || null)}
        />
      ) : (
        <span
          className={`font-bold uppercase tracking-tight ${textClassName}`}
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: textClassName
              ? undefined
              : Math.max(12, Math.round((size || 40) * 0.36)),
          }}
        >
          {initials}
        </span>
      )}
    </div>
  );
}
