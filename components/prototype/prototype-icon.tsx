import type { ReactNode } from "react";

export type PrototypeIconName =
  | "wallet"
  | "eye-off"
  | "send"
  | "play-circle"
  | "exchange"
  | "arrow-right"
  | "mail"
  | "check"
  | "sparkles"
  | "close";

export interface PrototypeIconProps {
  name: PrototypeIconName;
  size?: number;
  className?: string;
}

const icons: Record<PrototypeIconName, ReactNode> = {
  wallet: (
    <>
      <path d="M4 6h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h12" />
      <path d="M2 7h16M15 11h7v6h-7a3 3 0 0 1 0-6Z" />
      <path d="M17 14h.01" />
    </>
  ),
  "eye-off": (
    <>
      <path d="m3 3 18 18M10.6 6.2A9.8 9.8 0 0 1 12 6c6.5 0 10 6 10 6a16 16 0 0 1-2.1 2.8M6.2 6.2A15.4 15.4 0 0 0 2 12s3.5 6 10 6a9.7 9.7 0 0 0 3.8-.8" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </>
  ),
  send: (
    <>
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </>
  ),
  "play-circle": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m10 8 6 4-6 4Z" />
    </>
  ),
  exchange: (
    <>
      <path d="M20 8a8 8 0 0 0-13.5-3L4 7M4 3v4h4M4 16a8 8 0 0 0 13.5 3l2.5-2M20 21v-4h-4" />
      <path d="M14.5 9.5c-.5-.8-1.3-1.2-2.5-1.2-1.4 0-2.5.8-2.5 1.9 0 2.9 5 1.5 5 4.2 0 1.2-1.1 2-2.6 2-1.2 0-2.1-.4-2.7-1.3M12 7v10" />
    </>
  ),
  "arrow-right": (
    <>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 7 9-7" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  sparkles: (
    <>
      <path d="m12 3 1.3 3.7L17 8l-3.7 1.3L12 13l-1.3-3.7L7 8l3.7-1.3ZM19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8ZM5 14l.8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8Z" />
    </>
  ),
  close: (
    <>
      <path d="m6 6 12 12M18 6 6 18" />
    </>
  ),
};

export function PrototypeIcon({
  name,
  size = 24,
  className,
}: PrototypeIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      {icons[name]}
    </svg>
  );
}
