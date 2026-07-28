"use client";

import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import Image from "next/image";
import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type UIEvent,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { FlagSwooshLoader } from "@/components/prototype/flag-swoosh-loader";
import { PrototypeIcon } from "@/components/prototype/prototype-icon";
import { WorkLocationWorldLoader } from "@/components/prototype/work-location-world-loader";

gsap.registerPlugin(Draggable);

type ThemeId = "theme-01" | "theme-02" | "theme-03";
type ActiveSelector = "country" | "work";
type PhonePanel = "wallets" | "transfer" | "exchange" | "messages" | "work" | null;
type BottomNavigationId = "home" | "messages" | "profile";
type PrototypeControlTab = "theme" | "motion";

const PROTOTYPE_CONTROL_TABS = ["theme", "motion"] as const satisfies readonly PrototypeControlTab[];

interface PrototypeToast {
  readonly message: string;
  readonly detail?: string;
  readonly flag?: string;
}

const FIGMA_ICON_ASSETS = {
  announcement: "/assets/prototype-figma/icon-announcement.svg",
  "announcement-arrow": "/assets/prototype-figma/icon-announcement-arrow.svg",
  "arrow-right": "/assets/prototype-figma/icon-arrow-right.svg",
  bills: "/assets/prototype-figma/icon-bills.svg",
  copy: "/assets/prototype-figma/icon-copy.svg",
  credit: "/assets/prototype-figma/icon-credit.svg",
  down: "/assets/prototype-figma/icon-down.svg",
  exchange: "/assets/prototype-figma/icon-exchange.svg",
  "exchange-message": "/assets/prototype-figma/icon-exchange-message-theme-03.svg",
  eye: "/assets/prototype-figma/icon-eye.svg",
  grid: "/assets/prototype-figma/icon-grid.svg",
  load: "/assets/prototype-figma/icon-load.svg",
  "money-received": "/assets/prototype-figma/icon-money-received.svg",
  receipt: "/assets/prototype-figma/icon-receipt.svg",
  send: "/assets/prototype-figma/icon-send.svg",
  wallet: "/assets/prototype-figma/icon-wallet.svg",
  work: "/assets/prototype-figma/icon-work.svg",
} as const;

type FigmaIconName = keyof typeof FIGMA_ICON_ASSETS;

const FIGMA_ICON_ASSETS_THEME_02: Partial<Record<FigmaIconName, string>> = {
  wallet: "/assets/prototype-figma/icon-wallet-theme-02.svg",
  send: "/assets/prototype-figma/icon-send-theme-02.svg",
  exchange: "/assets/prototype-figma/icon-exchange-theme-02.svg",
  "exchange-message": "/assets/prototype-figma/icon-exchange-message-theme-02.svg",
  eye: "/assets/prototype-figma/icon-eye-theme-02.svg",
  bills: "/assets/prototype-figma/icon-bills-theme-02.svg",
  credit: "/assets/prototype-figma/icon-credit-theme-02.svg",
  grid: "/assets/prototype-figma/icon-grid-theme-02.svg",
  load: "/assets/prototype-figma/icon-load-theme-02.svg",
  "announcement-arrow": "/assets/prototype-figma/icon-announcement-arrow-theme-02.svg",
  "arrow-right": "/assets/prototype-figma/icon-arrow-right-theme-02.svg",
};

const FIGMA_ICON_ASSETS_THEME_03: Partial<Record<FigmaIconName, string>> = {
  wallet: "/assets/prototype-figma/icon-wallet-theme-03.svg",
  send: "/assets/prototype-figma/icon-send-theme-03.svg",
  exchange: "/assets/prototype-figma/icon-exchange-theme-03.svg",
  "exchange-message": "/assets/prototype-figma/icon-exchange-message-theme-03.svg",
  eye: "/assets/prototype-figma/icon-eye-theme-03.svg",
  bills: "/assets/prototype-figma/icon-bills-theme-03.svg",
  credit: "/assets/prototype-figma/icon-credit-theme-03.svg",
  grid: "/assets/prototype-figma/icon-grid-theme-03.svg",
  load: "/assets/prototype-figma/icon-load-theme-03.svg",
  "announcement-arrow": "/assets/prototype-figma/icon-announcement-arrow-theme-03.svg",
  "arrow-right": "/assets/prototype-figma/icon-arrow-right-theme-03.svg",
  announcement: "/assets/prototype-figma/icon-announcement-theme-03.svg",
  copy: "/assets/prototype-figma/icon-copy-theme-03.svg",
  down: "/assets/prototype-figma/icon-down-theme-03.svg",
  "money-received": "/assets/prototype-figma/icon-money-received-theme-03.svg",
  receipt: "/assets/prototype-figma/icon-receipt-theme-03.svg",
  work: "/assets/prototype-figma/icon-work-theme-03.svg",
};

const FIGMA_ICON_ASSETS_BY_THEME: Partial<Record<ThemeId, Partial<Record<FigmaIconName, string>>>> = {
  "theme-01": FIGMA_ICON_ASSETS_THEME_02,
  "theme-02": FIGMA_ICON_ASSETS_THEME_03,
};

const PrototypeThemeContext = createContext<ThemeId>("theme-01");

function FigmaIcon({ name, className, size = 24 }: { readonly name: FigmaIconName; readonly className?: string; readonly size?: number }) {
  const activeThemeId = useContext(PrototypeThemeContext);
  const src = FIGMA_ICON_ASSETS_BY_THEME[activeThemeId]?.[name] ?? FIGMA_ICON_ASSETS[name];
  const iconClassName = ["figma-icon", `figma-icon--${name}`, className].filter(Boolean).join(" ");
  return <Image src={src} alt="" width={size} height={size} className={iconClassName} aria-hidden="true" />;
}

const FIGMA_NAVIGATION_ICON_ASSETS_THEME_03 = {
  home: "/assets/prototype-figma/icon-home-theme-03.svg",
  messages: "/assets/prototype-figma/icon-mail-theme-03.svg",
  profile: "/assets/prototype-figma/icon-profile-theme-03.svg",
} as const satisfies Record<BottomNavigationId, string>;

function NavigationIcon({ name }: { readonly name: BottomNavigationId }) {
  const activeThemeId = useContext(PrototypeThemeContext);

  if (activeThemeId === "theme-02") {
    return (
      <span className={`prototype-navigation-icon-image prototype-navigation-icon-image--${name}`} aria-hidden="true">
        <Image src={FIGMA_NAVIGATION_ICON_ASSETS_THEME_03[name]} alt="" width={24} height={24} />
      </span>
    );
  }

  return <span className={`prototype-navigation-icon prototype-navigation-icon--${name}`} aria-hidden="true" />;
}

function WalletNotOpenedCard({
  currency,
  illustration,
  onOpenWallet,
}: {
  readonly currency: string;
  readonly illustration: string;
  readonly onOpenWallet: () => void;
}) {
  return (
    <div className="prototype-wallet-empty">
      <Image
        className="prototype-wallet-empty-illustration"
        src={illustration}
        alt=""
        width={158}
        height={158}
      />
      <p className="prototype-wallet-empty-title">{currency} Wallet not yet opened</p>
      <p className="prototype-wallet-empty-subtitle">Open a {currency} wallet to use services in this currency.</p>
      <button type="button" className="prototype-wallet-empty-button" onClick={onOpenWallet}>
        Open Wallet
      </button>
    </div>
  );
}

interface PrototypeTheme {
  readonly id: ThemeId;
  readonly label: string;
  readonly name: string;
  readonly colors: {
    readonly background: string;
    readonly surface: string;
    readonly primary: string;
    readonly primarySoft: string;
    readonly selector: string;
    readonly ink: string;
    readonly muted: string;
    readonly border: string;
    readonly accentGradientFrom: string;
    readonly accentGradientTo: string;
    readonly ctaSoft: string;
  };
  readonly swatches: readonly string[];
}

interface Wallet {
  readonly id: "php" | "usd" | "hkd";
  readonly name: string;
  readonly balance: string;
  readonly account: string;
  readonly currency: string;
  readonly country: string;
  readonly watermark: string;
}

const PROTOTYPE_THEMES = [
  {
    id: "theme-01",
    label: "Theme 1",
    name: "Violet",
    colors: {
      background: "#f8f5fc",
      surface: "#ffffff",
      primary: "#38168d",
      primarySoft: "#f5f1fc",
      selector: "#f8f0ff",
      ink: "#424242",
      muted: "#6c6c6c",
      border: "#f1eaff",
      accentGradientFrom: "#e0d6ff",
      accentGradientTo: "#8d6be3",
      ctaSoft: "#f5f1fc",
    },
    swatches: ["#38168d", "#f8f5fc", "#e40822"],
  },
  {
    id: "theme-02",
    label: "Theme 2",
    name: "Soft Pink",
    colors: {
      background: "#fff1f5",
      surface: "#ffffff",
      primary: "#b14261",
      primarySoft: "#fff1f5",
      selector: "#fff1f5",
      ink: "#424242",
      muted: "#6c6c6c",
      border: "#ffe4ec",
      accentGradientFrom: "#ffccda",
      accentGradientTo: "#b14261",
      ctaSoft: "#fff1f5",
    },
    swatches: ["#b14261", "#fff1f5", "#e40822"],
  },
  {
    id: "theme-03",
    label: "Theme 3",
    name: "Royal Blue",
    colors: {
      background: "#f6f9fe",
      surface: "#ffffff",
      primary: "#2853bb",
      primarySoft: "#f6f9fe",
      selector: "#f5f8fd",
      ink: "#424242",
      muted: "#6c6c6c",
      border: "#eff5ff",
      accentGradientFrom: "#d5e1ff",
      accentGradientTo: "#2853bb",
      ctaSoft: "#ecf3ff",
    },
    swatches: ["#2853bb", "#f6f9fe", "#e40822"],
  },
] as const satisfies readonly PrototypeTheme[];

const WORK_LOCATION_ANIMATIONS = [
  {
    id: "animation-01",
    label: "Animation 1",
    name: "Takeoff arc",
    motion: {
      from: { x: "-26cqw", y: "11cqw", z: 0, rotationX: 3, rotationY: -8, rotationZ: -7 },
      cruise: { x: "-6cqw", y: "-3cqw", z: 0, rotationX: 1, rotationY: -2, rotationZ: -3 },
      approach: { x: "2cqw", y: "-1.1cqw", z: 0, rotationX: 0, rotationY: 0, rotationZ: -1 },
    },
  },
  {
    id: "animation-02",
    label: "Animation 2",
    name: "World route",
    motion: {
      from: { x: "-34cqw", y: "2cqw", z: 0, rotationX: 0, rotationY: -5, rotationZ: 0 },
      cruise: { x: "-8cqw", y: 0, z: 0, rotationX: 0, rotationY: -1, rotationZ: 0 },
      approach: { x: "2.4cqw", y: 0, z: 0, rotationX: 0, rotationY: 0, rotationZ: 0 },
    },
  },
  {
    id: "animation-03",
    label: "Animation 3",
    name: "Flag swoosh",
    motion: {
      from: { x: "-22cqw", y: "-10cqw", z: 0, rotationX: -2, rotationY: -7, rotationZ: 4 },
      cruise: { x: "-5cqw", y: "2.5cqw", z: 0, rotationX: 0, rotationY: -2, rotationZ: 2 },
      approach: { x: "1.4cqw", y: ".7cqw", z: 0, rotationX: 0, rotationY: 0, rotationZ: .5 },
    },
  },
  {
    id: "animation-04",
    label: "Animation 4",
    name: "Depth flyover",
    motion: {
      from: { x: "-16cqw", y: "9cqw", z: -180, rotationX: 15, rotationY: -10, rotationZ: -6 },
      cruise: { x: "-4cqw", y: "-2cqw", z: -45, rotationX: 5, rotationY: -3, rotationZ: -2 },
      approach: { x: "1.5cqw", y: "-.8cqw", z: 0, rotationX: 0, rotationY: 0, rotationZ: -.5 },
    },
  },
  {
    id: "animation-05",
    label: "Animation 5",
    name: "Soft landing",
    motion: {
      from: { x: "-30cqw", y: "-5cqw", z: 0, rotationX: -2, rotationY: -8, rotationZ: 5 },
      cruise: { x: "-8cqw", y: "3cqw", z: 0, rotationX: 1, rotationY: -2, rotationZ: 2 },
      approach: { x: "2cqw", y: ".8cqw", z: 0, rotationX: 0, rotationY: 0, rotationZ: .5 },
    },
  },
] as const;

type WorkLocationAnimationId = (typeof WORK_LOCATION_ANIMATIONS)[number]["id"];

const WALLETS = [
  {
    id: "php",
    name: "PHP Wallet",
    balance: "₱3,000.00",
    account: "735-****-1234",
    currency: "PHP",
    country: "Philippines",
    watermark: "/assets/prototype-figma/flag-fabric.png",
  },
  {
    id: "usd",
    name: "USD Wallet",
    balance: "$120.00",
    account: "624-****-8802",
    currency: "USD",
    country: "United States",
    watermark: "/assets/prototype-figma/flag-fabric.png",
  },
  {
    id: "hkd",
    name: "HKD Wallet",
    balance: "HK$540.00",
    account: "901-****-2048",
    currency: "HKD",
    country: "Hong Kong",
    watermark: "/assets/prototype-figma/flag-fabric-hk.png",
  },
] as const satisfies readonly Wallet[];

const WORK_LOCATION_OPTIONS = [
  {
    value: "Hong Kong",
    label: "Hong Kong",
    flag: "/assets/prototype-figma/flag-hong-kong.svg",
    unselected: "/assets/prototype-figma/work-country-unselected.svg",
  },
  {
    value: "Singapore",
    label: "Singapore",
    flag: "/assets/prototype-figma/flag-singapore.svg",
    unselected: "/assets/prototype-figma/work-country-unselected.svg",
  },
  {
    value: "Saudi Arabia",
    label: "Saudi Arabia",
    flag: "/assets/prototype-figma/flag-saudi-arabia.svg",
    unselected: "/assets/prototype-figma/work-country-unselected-secondary.svg",
  },
] as const;

type WorkLocation = "Where you work" | (typeof WORK_LOCATION_OPTIONS)[number]["value"];
type LoadingLocation = Exclude<WorkLocation, "Where you work"> | "Philippines";

const UNOPENED_WALLET_CURRENCY: Partial<Record<WorkLocation, string>> = {
  Singapore: "SGD",
  "Saudi Arabia": "SAR",
};

const WALLET_EMPTY_ILLUSTRATIONS: Partial<Record<ThemeId, string>> = {
  "theme-01": "/assets/prototype-figma/wallet-not-opened-illustration-theme-02.png",
  "theme-02": "/assets/prototype-figma/wallet-not-opened-illustration-theme-03.png",
};
const WALLET_EMPTY_ILLUSTRATION_DEFAULT = "/assets/prototype-figma/wallet-not-opened-illustration.png";

const MESSAGES = [
  {
    title: "Money received",
    detail: "Your PHP Wallet received ₱5,000.00",
    time: "11:06",
    icon: "money-received" as const,
    tone: "success",
  },
  {
    title: "Bill payment successful",
    detail: "Your electricity bill payment was completed",
    time: "2026/06/18 11:06",
    icon: "receipt" as const,
    tone: "warning",
  },
  {
    title: "Exchanged completed",
    detail: "Your electricity bill payment was completed",
    time: "2026/06/18 11:06",
    icon: "exchange-message" as const,
    tone: "primary",
  },
] as const;

const QUICK_ACTIONS = [
  { label: "Load", icon: "load" },
  { label: "Bills", icon: "bills" },
  { label: "Credit", icon: "credit" },
  { label: "More", icon: "grid" },
] as const satisfies readonly { readonly label: string; readonly icon: FigmaIconName }[];

function themeVariables(theme: PrototypeTheme): CSSProperties {
  return {
    "--prototype-bg": theme.colors.background,
    "--prototype-surface": theme.colors.surface,
    "--prototype-primary": theme.colors.primary,
    "--prototype-primary-soft": theme.colors.primarySoft,
    "--prototype-selector-bg": theme.colors.selector,
    "--prototype-ink": theme.colors.ink,
    "--prototype-muted": theme.colors.muted,
    "--prototype-border": theme.colors.border,
    "--prototype-accent-gradient-from": theme.colors.accentGradientFrom,
    "--prototype-accent-gradient-to": theme.colors.accentGradientTo,
    "--prototype-cta-soft": theme.colors.ctaSoft,
  } as CSSProperties;
}

export function RemittancePrototype() {
  const { t } = useLanguage();
  const [themeId, setThemeId] = useState<ThemeId>("theme-01");
  const [workLocationAnimationId, setWorkLocationAnimationId] = useState<WorkLocationAnimationId>("animation-01");
  const [activeControlTab, setActiveControlTab] = useState<PrototypeControlTab>("theme");
  const [walletId, setWalletId] = useState<Wallet["id"]>("php");
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [workLocation, setWorkLocation] = useState<WorkLocation>("Where you work");
  const [activeSelector, setActiveSelector] = useState<ActiveSelector>("country");
  const [openPanel, setOpenPanel] = useState<PhonePanel>(null);
  const [activeNavigation, setActiveNavigation] = useState<BottomNavigationId>("home");
  const [isAnnouncementHeader, setIsAnnouncementHeader] = useState(false);
  const [isBalanceHeader, setIsBalanceHeader] = useState(false);
  const [loadingWorkLocation, setLoadingWorkLocation] = useState<LoadingLocation | null>(null);
  const [toast, setToast] = useState<PrototypeToast | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phoneShellRef = useRef<HTMLDivElement | null>(null);
  const prototypeAppRef = useRef<HTMLDivElement | null>(null);
  const utilityHeaderRef = useRef<HTMLElement | null>(null);
  const countrySelectorRef = useRef<HTMLDivElement | null>(null);
  const workSelectorRef = useRef<HTMLDivElement | null>(null);
  const countryTriggerRef = useRef<HTMLButtonElement | null>(null);
  const workTriggerRef = useRef<HTMLButtonElement | null>(null);
  const stickyAnnouncementRef = useRef<HTMLButtonElement | null>(null);
  const stickyWalletRef = useRef<HTMLButtonElement | null>(null);
  const announcementRef = useRef<HTMLButtonElement | null>(null);
  const walletRef = useRef<HTMLElement | null>(null);
  const panelBackdropRef = useRef<HTMLDivElement | null>(null);
  const panelSheetRef = useRef<HTMLElement | null>(null);
  const panelReturnFocusRef = useRef<HTMLElement | null>(null);
  const selectedWorkOptionRef = useRef<HTMLInputElement | null>(null);
  const workRegionHandleRef = useRef<HTMLButtonElement | null>(null);
  const workLocationLoadingRef = useRef<HTMLDivElement | null>(null);
  const workLocationLoadingArtworkRef = useRef<HTMLDivElement | null>(null);
  const workSheetClosingRef = useRef(false);
  const workSheetDidDragRef = useRef(false);
  const workSheetCloseTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const announcementHeaderTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const announcementHeaderStateRef = useRef(false);
  const balanceHeaderTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const balanceHeaderStateRef = useRef(false);

  const theme = PROTOTYPE_THEMES.find((item) => item.id === themeId) ?? PROTOTYPE_THEMES[0];
  const workLocationAnimation = WORK_LOCATION_ANIMATIONS.find((item) => item.id === workLocationAnimationId)
    ?? WORK_LOCATION_ANIMATIONS[0];
  const wallet = WALLETS.find((item) => item.id === walletId) ?? WALLETS[0];
  const country = "Philippines";
  const selectedWorkLocationOption = WORK_LOCATION_OPTIONS.find((option) => option.value === workLocation);
  const unopenedWalletCurrency = activeSelector === "work" ? UNOPENED_WALLET_CURRENCY[workLocation] ?? null : null;
  const showBalanceHeader = isBalanceHeader && !unopenedWalletCurrency;
  const selectedWorkRegionIndicator = themeId === "theme-01"
    ? "/assets/prototype-figma/work-country-selected-violet.svg"
    : themeId === "theme-02"
      ? "/assets/prototype-figma/work-country-selected-pink.svg"
      : "/assets/prototype-figma/work-country-selected.svg";

  useEffect(() => () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
  }, []);

  useLayoutEffect(() => {
    const header = utilityHeaderRef.current;
    const countrySelector = countrySelectorRef.current;
    const workSelector = workSelectorRef.current;
    const stickyAnnouncement = stickyAnnouncementRef.current;
    const stickyWallet = stickyWalletRef.current;

    if (!prototypeAppRef.current || !header || !countrySelector || !workSelector || !stickyAnnouncement || !stickyWallet) {
      return;
    }

    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const announcementTimeline = gsap.timeline({
        paused: true,
        defaults: { overwrite: "auto" },
      });

      announcementTimeline
        .fromTo(
          countrySelector,
          { left: "5.333cqw" },
          { left: "5.067cqw", duration: .24, ease: "power2.inOut" },
          0,
        )
        .fromTo(
          workSelector,
          { left: "35.467cqw" },
          { left: "35.2cqw", duration: .24, ease: "power2.inOut" },
          0,
        )
        .fromTo(
          stickyAnnouncement,
          { autoAlpha: 0, y: "-.8cqw" },
          { autoAlpha: 1, y: "0cqw", duration: .18, ease: "power2.out" },
          .04,
        );

      announcementTimeline.progress(announcementHeaderStateRef.current ? 1 : 0).pause();
      announcementHeaderTimelineRef.current = announcementTimeline;

      const balanceTimeline = gsap.timeline({
        paused: true,
        defaults: { overwrite: "auto" },
      });

      balanceTimeline
        .fromTo(
          stickyWallet,
          { autoAlpha: 0, y: "-.8cqw" },
          { autoAlpha: 1, y: "0cqw", duration: .24, ease: "power3.out" },
          .08,
        );

      balanceTimeline.progress(balanceHeaderStateRef.current ? 1 : 0).pause();
      balanceHeaderTimelineRef.current = balanceTimeline;

      return () => {
        if (announcementHeaderTimelineRef.current === announcementTimeline) {
          announcementHeaderTimelineRef.current = null;
        }
        announcementTimeline.kill();
        if (balanceHeaderTimelineRef.current === balanceTimeline) {
          balanceHeaderTimelineRef.current = null;
        }
        balanceTimeline.kill();
      };
    }, prototypeAppRef);

    return () => {
      announcementHeaderTimelineRef.current = null;
      balanceHeaderTimelineRef.current = null;
      media.revert();
    };
  }, []);

  useLayoutEffect(() => {
    announcementHeaderStateRef.current = isAnnouncementHeader;

    const timeline = announcementHeaderTimelineRef.current;
    if (!timeline) return;

    if (isAnnouncementHeader) {
      timeline.play();
    } else {
      timeline.reverse();
    }
  }, [isAnnouncementHeader]);

  useLayoutEffect(() => {
    balanceHeaderStateRef.current = isBalanceHeader;

    const timeline = balanceHeaderTimelineRef.current;
    if (!timeline) return;

    if (isBalanceHeader) {
      timeline.play();
    } else {
      timeline.reverse();
    }
  }, [isBalanceHeader]);

  const showToast = useCallback((message: string, options?: Omit<PrototypeToast, "message">) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, ...options });
    toastTimerRef.current = setTimeout(() => setToast(null), options?.detail ? 2800 : 2200);
  }, []);

  const showCountrySelectionToast = useCallback((location: LoadingLocation) => {
    const selectedOption = WORK_LOCATION_OPTIONS.find((option) => option.value === location);
    const isHomeCountry = location === "Philippines";

    showToast(`${selectedOption?.label ?? location} selected`, {
      detail: isHomeCountry ? "Home country · PHP wallet active" : "Work country · Local services updated",
      flag: isHomeCountry ? "/assets/prototype-figma/flag-ph.svg" : selectedOption?.flag,
    });
  }, [showToast]);

  const finishWorkLocationLoading = useCallback(() => {
    if (!loadingWorkLocation) return;

    let focusTarget: HTMLButtonElement | null = null;
    if (loadingWorkLocation === "Hong Kong") {
      setWalletId("hkd");
      setActiveSelector("work");
      focusTarget = workTriggerRef.current;
    } else if (loadingWorkLocation === "Philippines") {
      setWalletId("php");
      setActiveSelector("country");
      focusTarget = countryTriggerRef.current;
    }

    setLoadingWorkLocation(null);
    showCountrySelectionToast(loadingWorkLocation);
    requestAnimationFrame(() => focusTarget?.focus({ preventScroll: true }));
  }, [loadingWorkLocation, setWalletId, showCountrySelectionToast]);

  const openPrototypePanel = useCallback((panel: Exclude<PhonePanel, null>, trigger?: HTMLElement | null) => {
    panelReturnFocusRef.current = trigger
      ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    setOpenPanel(panel);
  }, []);

  const closePrototypePanel = useCallback((restoreFocus = true) => {
    const returnFocusTarget = panelReturnFocusRef.current;
    panelReturnFocusRef.current = null;
    setOpenPanel(null);

    if (restoreFocus && returnFocusTarget?.isConnected) {
      requestAnimationFrame(() => returnFocusTarget.focus({ preventScroll: true }));
    }
  }, []);

  const dismissWorkSheet = useCallback((restoreFocus = true, onClosed?: () => void) => {
    if (workSheetClosingRef.current) return;

    const sheet = panelSheetRef.current;
    const backdrop = panelBackdropRef.current;
    const phoneShell = phoneShellRef.current;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!sheet || !backdrop || !phoneShell || prefersReducedMotion) {
      workSheetClosingRef.current = false;
      closePrototypePanel(restoreFocus);
      onClosed?.();
      return;
    }
    const backdropTargets = [backdrop, phoneShell];

    workSheetClosingRef.current = true;
    Draggable.get(sheet)?.disable();
    gsap.killTweensOf([sheet, ...backdropTargets]);
    workSheetCloseTimelineRef.current?.kill();

    const sheetHeight = Math.max(sheet.offsetHeight, 1);
    const currentY = Math.max(0, Number(gsap.getProperty(sheet, "y")) || 0);
    const remainingDistance = Math.max(0, sheetHeight - currentY);
    const duration = Math.max(.12, Math.min(.24, (remainingDistance / sheetHeight) * .24));

    const closeTimeline = gsap.timeline({
      defaults: { overwrite: true },
      onComplete: () => {
        if (workSheetCloseTimelineRef.current !== closeTimeline) return;
        workSheetCloseTimelineRef.current = null;
        workSheetClosingRef.current = false;
        closePrototypePanel(restoreFocus);
        onClosed?.();
      },
    });
    workSheetCloseTimelineRef.current = closeTimeline;

    closeTimeline
      .to(sheet, { y: sheetHeight, duration, ease: "power2.in" }, 0)
      .to(backdropTargets, { "--work-backdrop-opacity": 0, duration: duration * .8, ease: "power1.out" }, 0);
  }, [closePrototypePanel]);

  useLayoutEffect(() => {
    if (openPanel !== "work") return;

    const sheet = panelSheetRef.current;
    const backdrop = panelBackdropRef.current;
    const phoneShell = phoneShellRef.current;
    const handle = workRegionHandleRef.current;
    if (!sheet || !backdrop || !phoneShell || !handle) return;
    const backdropTargets = [backdrop, phoneShell];
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    workSheetClosingRef.current = false;
    workSheetDidDragRef.current = false;
    workSheetCloseTimelineRef.current?.kill();
    workSheetCloseTimelineRef.current = null;
    gsap.set(sheet, {
      y: prefersReducedMotion ? 0 : sheet.offsetHeight,
      willChange: prefersReducedMotion ? "auto" : "transform",
    });
    gsap.set(backdropTargets, { "--work-backdrop-opacity": prefersReducedMotion ? .6 : 0 });

    let lastDragY = 0;
    let lastDragTime = performance.now();
    let dragVelocity = 0;
    let disposed = false;

    const [draggable] = Draggable.create(sheet, {
      type: "y",
      trigger: handle,
      bounds: { minY: 0, maxY: sheet.offsetHeight },
      edgeResistance: .9,
      dragClickables: true,
      suppressClickOnDrag: true,
      minimumMovement: 6,
      zIndexBoost: false,
      allowEventDefault: false,
      allowNativeTouchScrolling: false,
      autoScroll: 0,
      force3D: true,
      onPress: () => {
        if (disposed) return;
        draggable.applyBounds({ minY: 0, maxY: sheet.offsetHeight });
        gsap.killTweensOf([sheet, ...backdropTargets]);
        gsap.set(sheet, { willChange: "transform" });
        handle.classList.add("is-dragging");
        workSheetDidDragRef.current = false;
        dragVelocity = 0;
        lastDragY = draggable.y;
        lastDragTime = performance.now();
      },
      onDrag: () => {
        if (disposed) return;
        const now = performance.now();
        const elapsed = Math.max(now - lastDragTime, 1);
        const instantVelocity = (draggable.y - lastDragY) / elapsed;
        dragVelocity = dragVelocity * .55 + instantVelocity * .45;
        lastDragY = draggable.y;
        lastDragTime = now;
        workSheetDidDragRef.current ||= draggable.y > 4;

        const dragProgress = Math.min(Math.max(draggable.y / Math.max(sheet.offsetHeight, 1), 0), 1);
        gsap.set(backdropTargets, { "--work-backdrop-opacity": .6 * (1 - dragProgress * .88) });
      },
      onDragEnd: () => {
        if (disposed || workSheetClosingRef.current) return;
        handle.classList.remove("is-dragging");

        const sheetHeight = Math.max(sheet.offsetHeight, 1);
        const recentVelocity = performance.now() - lastDragTime <= 120 ? dragVelocity : 0;
        const flickVelocityThreshold = Math.max(.55, (sheetHeight * 2.2) / 1000);
        const shouldDismiss = draggable.y >= sheetHeight * .24
          || (draggable.y >= sheetHeight * .04 && recentVelocity >= flickVelocityThreshold);

        if (shouldDismiss) {
          dismissWorkSheet();
        } else {
          const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          if (prefersReducedMotion) {
            gsap.set(sheet, { y: 0, clearProps: "willChange" });
            gsap.set(backdropTargets, { "--work-backdrop-opacity": .6 });
            draggable.update(true);
          } else {
            gsap.to(sheet, {
              y: 0,
              duration: .24,
              ease: "power3.out",
              overwrite: true,
              onComplete: () => {
                gsap.set(sheet, { clearProps: "willChange" });
                draggable.update(true);
              },
            });
            gsap.to(backdropTargets, {
              "--work-backdrop-opacity": .6,
              duration: .2,
              ease: "power2.out",
              overwrite: true,
            });
          }
        }

        if (workSheetDidDragRef.current) {
          window.setTimeout(() => {
            workSheetDidDragRef.current = false;
          }, 0);
        }
      },
    });
    const openTimeline = prefersReducedMotion
      ? null
      : gsap.timeline({
          defaults: { overwrite: "auto" },
          onComplete: () => {
            gsap.set(sheet, { clearProps: "willChange" });
            draggable.update(true);
          },
        })
          .to(backdropTargets, {
            "--work-backdrop-opacity": .6,
            duration: .14,
            ease: "power1.out",
          }, 0)
          .to(sheet, {
            y: 0,
            duration: .22,
            ease: "power3.out",
          }, 0);

    const resizeObserver = new ResizeObserver(() => {
      draggable.applyBounds({ minY: 0, maxY: sheet.offsetHeight });
    });
    resizeObserver.observe(sheet);

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      openTimeline?.kill();
      draggable.kill();
      handle.classList.remove("is-dragging");
      workSheetClosingRef.current = false;
      workSheetDidDragRef.current = false;
      workSheetCloseTimelineRef.current?.kill();
      workSheetCloseTimelineRef.current = null;
      gsap.killTweensOf([sheet, ...backdropTargets]);
      gsap.set(sheet, { clearProps: "transform,willChange" });
      backdrop.style.removeProperty("--work-backdrop-opacity");
      phoneShell.style.removeProperty("--work-backdrop-opacity");
    };
  }, [dismissWorkSheet, openPanel]);

  useLayoutEffect(() => {
    if (
      !loadingWorkLocation
      || workLocationAnimation.id === "animation-02"
      || workLocationAnimation.id === "animation-03"
    ) return;

    const overlay = workLocationLoadingRef.current;
    const artwork = workLocationLoadingArtworkRef.current;
    if (!overlay || !artwork) return;
    const loadingTargets = [overlay, artwork];

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      gsap.set(overlay, { autoAlpha: 1, yPercent: 0 });
      gsap.set(artwork, { autoAlpha: 1, x: 0, y: 0, rotation: 0 });
      const finishTimer = window.setTimeout(finishWorkLocationLoading, 400);

      return () => {
        window.clearTimeout(finishTimer);
        gsap.set(loadingTargets, { clearProps: "all" });
      };
    }

    gsap.set(artwork, {
      transformPerspective: 900,
      transformStyle: "preserve-3d",
      willChange: "transform,opacity",
    });

    const loadingTimeline = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: () => {
        gsap.set(artwork, { clearProps: "willChange" });
        finishWorkLocationLoading();
      },
    });

    loadingTimeline
      .fromTo(
        overlay,
        { autoAlpha: 0, yPercent: 100 },
        { autoAlpha: 1, yPercent: 0, duration: .18, ease: "power3.out" },
        0,
      )
      .fromTo(
        artwork,
        {
          autoAlpha: 0,
          ...workLocationAnimation.motion.from,
          transformOrigin: "64% 52%",
          force3D: true,
        },
        {
          autoAlpha: 1,
          ...workLocationAnimation.motion.cruise,
          duration: .42,
          ease: "power3.out",
        },
        .04,
      )
      .to(artwork, {
        ...workLocationAnimation.motion.approach,
        duration: .24,
        ease: "sine.out",
      }, .46)
      .to(artwork, {
        x: 0,
        y: 0,
        z: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        duration: .18,
        ease: "sine.out",
      }, .7)
      .to(overlay, { autoAlpha: 0, duration: .14, ease: "power1.in" }, 1.02);

    return () => {
      loadingTimeline.kill();
      gsap.set(loadingTargets, { clearProps: "all" });
    };
  }, [finishWorkLocationLoading, loadingWorkLocation, workLocationAnimation]);

  useEffect(() => {
    if (!openPanel) return;

    const focusFrame = requestAnimationFrame(() => {
      const panel = panelSheetRef.current;
      const focusTarget = openPanel === "work"
        ? selectedWorkOptionRef.current ?? panel?.querySelector<HTMLElement>(".prototype-work-region-input")
        : panel?.querySelector<HTMLElement>(".prototype-sheet-close, button, input");
      focusTarget?.focus({ preventScroll: true });
    });

    const handlePanelKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (openPanel === "work") {
          dismissWorkSheet();
        } else {
          closePrototypePanel();
        }
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelSheetRef.current;
      if (!panel) return;

      const focusableElements = Array.from(panel.querySelectorAll<HTMLElement>(
        "button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex='-1'])",
      )).filter((element) => !element.hasAttribute("hidden"));

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (!panel.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? lastElement : firstElement)?.focus({ preventScroll: true });
      } else if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus({ preventScroll: true });
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus({ preventScroll: true });
      }
    };

    document.addEventListener("keydown", handlePanelKeyDown);

    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handlePanelKeyDown);
    };
  }, [closePrototypePanel, dismissWorkSheet, openPanel]);

  const copyAccountNumber = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      showToast("Copy is unavailable");
      return;
    }

    try {
      await navigator.clipboard.writeText(wallet.account.replaceAll("*", "0"));
      showToast("Account number copied");
    } catch {
      showToast("Unable to copy account number");
    }
  };

  const selectTheme = (nextThemeId: ThemeId) => {
    setThemeId(nextThemeId);
    setOpenPanel(null);
    panelReturnFocusRef.current = null;
  };

  const handleControlTabKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    currentTab: PrototypeControlTab,
  ) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    const currentIndex = PROTOTYPE_CONTROL_TABS.indexOf(currentTab);
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (currentIndex + direction + PROTOTYPE_CONTROL_TABS.length) % PROTOTYPE_CONTROL_TABS.length;
    const nextTab = PROTOTYPE_CONTROL_TABS[nextIndex];

    setActiveControlTab(nextTab);
    document.getElementById(`prototype-controls-tab-${nextTab}`)?.focus();
  };

  const handlePrototypeScroll = (event: UIEvent<HTMLElement>) => {
    const scrollTop = event.currentTarget.scrollTop;
    const exitBuffer = event.currentTarget.clientWidth * .012;

    const balanceHeaderThreshold = walletRef.current?.offsetTop ?? event.currentTarget.clientWidth * .2;
    const shouldShowBalanceHeader = !unopenedWalletCurrency && (balanceHeaderStateRef.current
      ? scrollTop >= balanceHeaderThreshold - exitBuffer
      : scrollTop >= balanceHeaderThreshold);

    const announcement = announcementRef.current;
    const announcementHeaderThreshold = announcement
      ? announcement.offsetTop
      : event.currentTarget.clientWidth * .1;
    const shouldShowAnnouncementHeader = shouldShowBalanceHeader || (announcementHeaderStateRef.current
      ? scrollTop >= announcementHeaderThreshold - exitBuffer
      : scrollTop >= announcementHeaderThreshold);

    if (shouldShowAnnouncementHeader !== announcementHeaderStateRef.current) {
      announcementHeaderStateRef.current = shouldShowAnnouncementHeader;
      setIsAnnouncementHeader(shouldShowAnnouncementHeader);
    }
    if (shouldShowBalanceHeader !== balanceHeaderStateRef.current) {
      balanceHeaderStateRef.current = shouldShowBalanceHeader;
      setIsBalanceHeader(shouldShowBalanceHeader);
    }
  };

  return (
    <PrototypeThemeContext.Provider value={themeId}>
    <div className="grid min-w-0 items-start gap-8 sm:gap-10 xl:grid-cols-[minmax(380px,.78fr)_minmax(0,1fr)] xl:gap-16 2xl:gap-20">
      <div className="order-2 flex min-w-0 justify-center xl:order-1 xl:sticky xl:top-28">
        <div
          ref={phoneShellRef}
          className={`phone-shell prototype-phone-shell${openPanel ? " is-panel-open" : ""}${openPanel === "work" ? " is-work-region-open" : ""}`}
          style={themeVariables(theme)}
          aria-label={`${t(theme.label)} ${t("interactive mobile wallet prototype")}`}
        >
          <div className="phone-screen-viewport prototype-screen" style={themeVariables(theme)} data-theme={theme.id}>
            <div ref={prototypeAppRef} className="prototype-app">
              <header
                ref={utilityHeaderRef}
                className={`prototype-utility-header${isAnnouncementHeader ? " is-announcement-sticky" : ""}${showBalanceHeader ? " is-balance-sticky" : ""}`}
                inert={openPanel || loadingWorkLocation ? true : undefined}
              >
                <div ref={countrySelectorRef} className="prototype-selector-wrap">
                  <button
                    ref={countryTriggerRef}
                    type="button"
                    className={`prototype-pill prototype-country-pill${activeSelector === "work" ? " is-inactive" : ""}`}
                    onClick={() => {
                      if (
                        workLocationAnimation.id === "animation-01"
                        || workLocationAnimation.id === "animation-02"
                        || workLocationAnimation.id === "animation-03"
                      ) {
                        setLoadingWorkLocation("Philippines");
                      } else {
                        setWalletId("php");
                        setActiveSelector("country");
                        showCountrySelectionToast("Philippines");
                      }
                    }}
                    aria-pressed={activeSelector === "country"}
                  >
                    <span className="prototype-flag"><Image src="/assets/prototype-figma/flag-ph.svg" alt="" width={22} height={22} priority /></span>
                    <span className="prototype-pill-label">{country}</span>
                  </button>
                </div>

                <div ref={workSelectorRef} className="prototype-selector-wrap">
                  <button
                    ref={workTriggerRef}
                    type="button"
                    className={`prototype-pill prototype-work-pill${selectedWorkLocationOption ? " is-selected" : ""}${activeSelector === "work" ? " is-active" : ""}`}
                    onClick={(event) => openPrototypePanel("work", event.currentTarget)}
                    aria-haspopup="dialog"
                    aria-expanded={openPanel === "work"}
                    aria-controls="prototype-work-region-sheet"
                  >
                    <span className="prototype-work-content">
                      {selectedWorkLocationOption ? (
                        <span className="prototype-flag"><Image src={selectedWorkLocationOption.flag} alt="" width={22} height={22} /></span>
                      ) : (
                        <FigmaIcon name="work" />
                      )}
                      <span className="prototype-pill-label">{selectedWorkLocationOption?.label ?? workLocation}</span>
                    </span>
                    <FigmaIcon name="down" />
                  </button>
                </div>

                <button
                  ref={stickyAnnouncementRef}
                  type="button"
                  className="prototype-announcement prototype-announcement--sticky"
                  onClick={() => showToast("You’re already using the latest version")}
                  aria-hidden={!isAnnouncementHeader}
                  tabIndex={isAnnouncementHeader ? 0 : -1}
                >
                  <span className="prototype-announcement-icon"><FigmaIcon name="announcement" size={20} /></span>
                  <span>We’ve improve your app for a better user ex...</span>
                  <FigmaIcon name="announcement-arrow" className="prototype-announcement-arrow" size={16} />
                </button>

                <button
                  ref={stickyWalletRef}
                  type="button"
                  className="prototype-sticky-wallet"
                  disabled
                  aria-label={unopenedWalletCurrency
                    ? `${unopenedWalletCurrency} Wallet, not yet opened. View all wallets`
                    : `${wallet.name}, ${balanceVisible ? wallet.balance : "balance hidden"}. View all wallets`}
                  aria-hidden={!showBalanceHeader}
                  tabIndex={showBalanceHeader ? 0 : -1}
                >
                  <span className="prototype-sticky-wallet-name">
                    <span className="prototype-sticky-wallet-icon"><FigmaIcon name="wallet" size={22} /></span>
                    <strong>{unopenedWalletCurrency ? `${unopenedWalletCurrency} Wallet` : wallet.name}</strong>
                  </span>
                  <strong className="prototype-sticky-wallet-balance">
                    {unopenedWalletCurrency ? "Not yet opened" : balanceVisible ? wallet.balance : "••••••••"}
                  </strong>
                  <Image
                    className="prototype-sticky-wallet-arrow"
                    src={themeId === "theme-01"
                      ? "/assets/prototype-figma/icon-wallet-forward-theme-02.svg"
                      : themeId === "theme-02"
                        ? "/assets/prototype-figma/icon-wallet-forward-theme-03.svg"
                      : "/assets/prototype-figma/icon-wallet-forward.svg"}
                    alt=""
                    width={24}
                    height={24}
                  />
                </button>
              </header>

              <main
                className={`prototype-scroll-area${showBalanceHeader ? " is-balance-sticky" : ""}${openPanel ? " is-panel-open" : ""}`}
                onScroll={handlePrototypeScroll}
                inert={openPanel || loadingWorkLocation ? true : undefined}
              >
                <button
                  ref={announcementRef}
                  type="button"
                  className="prototype-announcement"
                  onClick={() => showToast("You’re already using the latest version")}
                  aria-hidden={isAnnouncementHeader}
                  tabIndex={isAnnouncementHeader ? -1 : 0}
                >
                  <span className="prototype-announcement-icon"><FigmaIcon name="announcement" size={20} /></span>
                  <span>We’ve improve your app for a better user ex...</span>
                  <FigmaIcon name="announcement-arrow" className="prototype-announcement-arrow" size={16} />
                </button>

                <section
                  ref={walletRef}
                  className={`prototype-wallet${unopenedWalletCurrency ? " prototype-wallet--empty" : ""}`}
                  aria-label="Wallet balance"
                >
                  {unopenedWalletCurrency ? (
                    <WalletNotOpenedCard
                      currency={unopenedWalletCurrency}
                      illustration={WALLET_EMPTY_ILLUSTRATIONS[themeId] ?? WALLET_EMPTY_ILLUSTRATION_DEFAULT}
                      onOpenWallet={() => showToast(`Opening a ${unopenedWalletCurrency} wallet coming soon`)}
                    />
                  ) : (
                    <>
                      <Image className="prototype-wallet-watermark" src={wallet.watermark} alt="" width={200} height={150} />
                      <div className="prototype-wallet-heading">
                        <div className="prototype-wallet-title">
                          <span className="prototype-wallet-icon"><FigmaIcon name="wallet" size={22} /></span>
                          <strong>{wallet.name}</strong>
                        </div>
                        <button type="button" className="prototype-all-wallets" disabled>All Wallets</button>
                      </div>

                      <div className="prototype-balance-label">
                        <span>Available Balance</span>
                        <button
                          type="button"
                          className="prototype-icon-button"
                          onClick={() => setBalanceVisible((visible) => !visible)}
                          aria-label={balanceVisible ? "Hide balance" : "Show balance"}
                        >
                          {balanceVisible ? <FigmaIcon name="eye" size={20} /> : <PrototypeIcon name="eye-off" />}
                        </button>
                      </div>
                      <p className="prototype-balance" aria-live="polite">{balanceVisible ? wallet.balance : "••••••••"}</p>
                      <p className="prototype-account-label">{country} · Receiving Account</p>

                      <div className="prototype-bank-card" aria-label={`Asia United Bank card ending in ${wallet.account.slice(-4)}`}>
                        <Image className="prototype-bank-card-art" src="/assets/prototype-figma/aub-card.png" alt="" width={308} height={117} />
                        <div className="prototype-bank-card-account">
                          <strong>Asia United Bank</strong>
                          <span>{wallet.account}<button type="button" onClick={() => void copyAccountNumber()} aria-label="Copy receiving account number"><FigmaIcon name="copy" size={12} /></button></span>
                        </div>
                        <p className="prototype-bank-card-currency">{country} · {wallet.currency}</p>
                      </div>

                      <div className="prototype-carousel-dots" aria-label="Wallet card 1 of 3">
                        <Image
                          src={themeId === "theme-01"
                            ? "/assets/prototype-figma/carousel-dots-theme-02.svg"
                            : themeId === "theme-02"
                              ? "/assets/prototype-figma/carousel-dots-theme-03.svg"
                            : "/assets/prototype-figma/carousel-dots.svg"}
                          alt=""
                          width={32}
                          height={8}
                        />
                      </div>

                      <div className="prototype-wallet-actions">
                        <button type="button" disabled>
                          <FigmaIcon name="send" />
                          <span><strong>Transfer</strong><small>Send money easily</small></span>
                        </button>
                        <button type="button" disabled>
                          <FigmaIcon name="exchange" />
                          <span><strong>Exchange</strong><small>Convert currencies</small></span>
                        </button>
                      </div>
                    </>
                  )}
                </section>

                {!unopenedWalletCurrency && (
                  <section className="prototype-messages" aria-labelledby="prototype-messages-title">
                    <div className="prototype-messages-heading">
                      <h3 id="prototype-messages-title">Latest Messages</h3>
                      <button type="button" disabled>View All <FigmaIcon name="arrow-right" size={16} /></button>
                    </div>
                    <div className="prototype-messages-list">
                      {MESSAGES.map((message) => (
                        <button key={message.title} type="button" className="prototype-message-row" onClick={() => showToast(message.title)}>
                          <span className={`prototype-message-icon prototype-message-icon--${message.tone}`}><FigmaIcon name={message.icon} /></span>
                          <span className="prototype-message-copy"><strong>{message.title}</strong><small>{message.detail}</small></span>
                          <time>{message.time}</time>
                        </button>
                      ))}
                    </div>
                  </section>
                )}

                <section className="prototype-quick-actions" aria-label="Quick actions">
                  {QUICK_ACTIONS.map((action) => (
                    <button key={action.label} type="button" onClick={() => showToast(`${action.label} preview selected`)}>
                      <span><FigmaIcon name={action.icon} /></span>
                      <small>{action.label}</small>
                    </button>
                  ))}
                </section>

                <section className="prototype-remittance-banner" aria-labelledby="prototype-remittance-banner-title">
                  <span className="prototype-remittance-banner-artwork" aria-hidden="true">
                    <Image
                      className="prototype-remittance-banner-art"
                      src="/assets/prototype-figma/remittance-banner.png"
                      alt=""
                      width={1755}
                      height={896}
                      unoptimized
                    />
                  </span>
                  <h3 id="prototype-remittance-banner-title">Send love, across<br />borders</h3>
                  <p>Fast, secure, and reliable<br />remittance to the Philippines</p>
                  <button type="button" disabled>Send now</button>
                </section>
              </main>

              <nav className="prototype-bottom-navigation" aria-label="Mobile app navigation" inert={openPanel || loadingWorkLocation ? true : undefined}>
                <div className="prototype-navigation-items">
                  {([
                    ["home", "Home"],
                    ["messages", "Messages"],
                    ["profile", "Profile"],
                  ] as const).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      className={activeNavigation === id ? "is-active" : undefined}
                      onClick={() => {
                        setActiveNavigation(id);
                        if (id !== "home") showToast(`${label} preview selected`);
                      }}
                      aria-current={activeNavigation === id ? "page" : undefined}
                    >
                      <NavigationIcon name={id} />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </nav>

              {openPanel && (
                <div
                  ref={panelBackdropRef}
                  className={`prototype-sheet-backdrop${openPanel === "work" ? " prototype-work-region-backdrop" : ""}`}
                  onClick={(event) => {
                    if (event.target !== event.currentTarget) return;
                    if (openPanel === "work") {
                      dismissWorkSheet();
                    } else {
                      closePrototypePanel();
                    }
                  }}
                >
                  <section
                    ref={panelSheetRef}
                    id={openPanel === "work" ? "prototype-work-region-sheet" : undefined}
                    className={`prototype-sheet${openPanel === "work" ? " prototype-work-region-sheet" : ""}`}
                    role="dialog"
                    aria-modal="true"
                    aria-label={openPanel === "work" ? undefined : `${openPanel} panel`}
                    aria-labelledby={openPanel === "work" ? "prototype-work-region-title" : undefined}
                    aria-describedby={openPanel === "work" ? "prototype-work-region-description" : undefined}
                    onClick={(event) => event.stopPropagation()}
                  >
                    {openPanel === "work" ? (
                      <>
                        <button
                          ref={workRegionHandleRef}
                          type="button"
                          className="prototype-work-region-handle"
                          onClick={() => {
                            if (workSheetClosingRef.current) return;
                            if (workSheetDidDragRef.current) {
                              workSheetDidDragRef.current = false;
                              return;
                            }
                            dismissWorkSheet();
                          }}
                          aria-label="Close work country selection"
                        >
                          <span />
                        </button>
                        <h3 id="prototype-work-region-title">Choose your work country/region</h3>
                        <p id="prototype-work-region-description">
                          Wallets, receiving accounts, and local services will be shown based on your selection.
                        </p>
                        <div className="prototype-work-region-options" role="radiogroup" aria-label="Work country or region">
                          {WORK_LOCATION_OPTIONS.map((option) => {
                            const isSelected = selectedWorkLocationOption?.value === option.value;
                            return (
                              <label key={option.value} className={`prototype-work-region-option${isSelected ? " is-selected" : ""}`}>
                                <input
                                  ref={isSelected ? selectedWorkOptionRef : undefined}
                                  className="prototype-work-region-input"
                                  type="radio"
                                  name="prototype-work-location"
                                  value={option.value}
                                  checked={isSelected}
                                  onChange={() => {
                                    setWorkLocation(option.value);
                                    if (option.value === "Hong Kong") {
                                      dismissWorkSheet(false, () => setLoadingWorkLocation(option.value));
                                    } else {
                                      setActiveSelector("work");
                                      dismissWorkSheet();
                                      showCountrySelectionToast(option.value);
                                    }
                                  }}
                                />
                                <Image className="prototype-work-region-flag" src={option.flag} alt="" width={32} height={32} />
                                <span>{option.label}</span>
                                <Image
                                  className={`prototype-work-region-indicator${isSelected ? " is-selected" : ""}`}
                                  src={isSelected ? selectedWorkRegionIndicator : option.unselected}
                                  alt=""
                                  width={isSelected ? 24 : 21}
                                  height={isSelected ? 24 : 21}
                                />
                              </label>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="prototype-sheet-handle" />
                        <button type="button" className="prototype-sheet-close" onClick={() => closePrototypePanel()} aria-label="Close panel"><PrototypeIcon name="close" /></button>
                      </>
                    )}

                    {openPanel === "wallets" && (
                      <>
                        <div className="prototype-sheet-icon"><PrototypeIcon name="wallet" /></div>
                        <h3>All Wallets</h3>
                        <p>Choose the balance you want to view.</p>
                        <div className="prototype-wallet-list">
                          {WALLETS.map((item) => (
                            <button key={item.id} type="button" className={walletId === item.id ? "is-active" : undefined} onClick={() => { setWalletId(item.id); closePrototypePanel(); }}>
                              <span><strong>{item.name}</strong><small>{item.country} · {item.currency}</small></span>
                              <b>{item.balance}</b>
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {(openPanel === "transfer" || openPanel === "exchange") && (
                      <>
                        <div className="prototype-sheet-icon"><PrototypeIcon name={openPanel === "transfer" ? "send" : "exchange"} /></div>
                        <h3>{openPanel === "transfer" ? "Start a transfer" : "Exchange currency"}</h3>
                        <p>{openPanel === "transfer" ? "Send from your PHP Wallet." : "Convert your balance with a live preview."}</p>
                        <label className="prototype-amount-field">
                          <span>Amount</span>
                          <span><b>{wallet.currency === "PHP" ? "₱" : wallet.currency}</b><input inputMode="decimal" defaultValue="500.00" aria-label="Amount" /></span>
                        </label>
                        <button type="button" className="prototype-sheet-primary" onClick={() => { closePrototypePanel(); showToast(openPanel === "transfer" ? "Transfer flow started" : "Exchange quote ready"); }}>
                          {openPanel === "transfer" ? "Continue" : "Review quote"}<PrototypeIcon name="arrow-right" />
                        </button>
                      </>
                    )}

                    {openPanel === "messages" && (
                      <>
                        <div className="prototype-sheet-icon"><PrototypeIcon name="mail" /></div>
                        <h3>All Messages</h3>
                        <p>You’re all caught up. Your latest activity is shown below.</p>
                        <div className="prototype-sheet-message-list">
                          {MESSAGES.map((message) => <span key={message.title}><b>{message.title}</b><small>{message.time}</small></span>)}
                        </div>
                      </>
                    )}
                  </section>
                </div>
              )}

              {loadingWorkLocation && (
                workLocationAnimation.id === "animation-02" ? (
                  <WorkLocationWorldLoader
                    destination={loadingWorkLocation}
                    onComplete={finishWorkLocationLoading}
                  />
                ) : workLocationAnimation.id === "animation-03" ? (
                  <FlagSwooshLoader
                    selectedCountry={loadingWorkLocation}
                    onComplete={finishWorkLocationLoading}
                    assetSrc={loadingWorkLocation === "Philippines"
                      ? "/assets/prototype-figma/work-location-philippines-swoosh.png"
                      : "/assets/prototype-figma/work-location-hongkong-swoosh.png"}
                  />
                ) : (
                  <div
                    ref={workLocationLoadingRef}
                    className="prototype-work-location-loading"
                    role="status"
                    aria-live="assertive"
                    aria-label={`Loading ${loadingWorkLocation}`}
                  >
                    <div ref={workLocationLoadingArtworkRef} className="prototype-work-location-loading-artwork">
                      <Image
                        src={loadingWorkLocation === "Philippines"
                          ? "/assets/prototype-figma/work-location-philippines-loading.png"
                          : "/assets/prototype-figma/work-location-hongkong-loading.png"}
                        alt=""
                        width={305}
                        height={228}
                        priority
                      />
                    </div>
                  </div>
                )
              )}

              <div
                className={`prototype-toast${toast?.detail ? " prototype-toast--selection" : ""}${toast ? " is-visible" : ""}`}
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                {toast?.flag ? (
                  <span className="prototype-toast-flag" aria-hidden="true">
                    <Image src={toast.flag} alt="" width={32} height={32} />
                  </span>
                ) : null}
                <span className="prototype-toast-copy">
                  <strong>{toast?.message}</strong>
                  {toast?.detail ? <small>{toast.detail}</small> : null}
                </span>
                <span className="prototype-toast-check" aria-hidden="true">
                  <PrototypeIcon name="check" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="order-1 min-w-0 xl:order-2 xl:pt-12">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#f1edfb] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#381c8d]">
          <PrototypeIcon name="sparkles" size={16} />
          {t("Live prototype")}
        </span>
        <h2 className="mt-5 max-w-2xl text-[2.2rem] font-bold leading-[.98] tracking-[-0.055em] text-[#1d1822] sm:mt-6 sm:text-5xl xl:text-[3.5rem]">
          {t("Explore the app")}
        </h2>
        <p className="mt-4 max-w-lg text-base leading-7 text-[#77717f] sm:text-lg">
          {t("Choose a style, then interact directly with the phone.")}
        </p>

        <div className="prototype-configurator mt-8 sm:mt-10" style={themeVariables(theme)}>
          <div className="prototype-configurator-tabs" role="tablist" aria-label={t("Prototype settings")}>
            <button
              id="prototype-controls-tab-theme"
              type="button"
              role="tab"
              aria-selected={activeControlTab === "theme"}
              aria-controls="prototype-controls-panel-theme"
              tabIndex={activeControlTab === "theme" ? 0 : -1}
              className={`prototype-configurator-tab${activeControlTab === "theme" ? " is-active" : ""}`}
              onClick={() => setActiveControlTab("theme")}
              onKeyDown={(event) => handleControlTabKeyDown(event, "theme")}
            >
              <PrototypeIcon name="sparkles" size={17} />
              {t("Style")}
            </button>
            <button
              id="prototype-controls-tab-motion"
              type="button"
              role="tab"
              aria-selected={activeControlTab === "motion"}
              aria-controls="prototype-controls-panel-motion"
              tabIndex={activeControlTab === "motion" ? 0 : -1}
              className={`prototype-configurator-tab${activeControlTab === "motion" ? " is-active" : ""}`}
              onClick={() => setActiveControlTab("motion")}
              onKeyDown={(event) => handleControlTabKeyDown(event, "motion")}
            >
              <PrototypeIcon name="play-circle" size={17} />
              {t("Motion")}
            </button>
          </div>

          {activeControlTab === "theme" ? (
            <div
              id="prototype-controls-panel-theme"
              role="tabpanel"
              aria-labelledby="prototype-controls-tab-theme"
              className="prototype-configurator-panel"
            >
              <div className="prototype-configurator-heading">
                <div>
                  <h3>{t("Color theme")}</h3>
                  <p>{t("Pick the look of the remittance app.")}</p>
                </div>
                <span>{t(theme.name)}</span>
              </div>

              <div className="prototype-theme-options" role="radiogroup" aria-label={t("Prototype theme")}>
                {PROTOTYPE_THEMES.map((item) => {
                  const isActive = item.id === themeId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      className={`prototype-theme-option${isActive ? " is-active" : ""}`}
                      onClick={() => selectTheme(item.id)}
                    >
                      <span className="prototype-theme-swatch" style={{ background: item.colors.primary }}>
                        {isActive ? <PrototypeIcon name="check" size={15} /> : null}
                      </span>
                      <span>
                        <strong>{t(item.name)}</strong>
                        <small>{t(item.label)}</small>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div
              id="prototype-controls-panel-motion"
              role="tabpanel"
              aria-labelledby="prototype-controls-tab-motion"
              className="prototype-configurator-panel"
            >
              <div className="prototype-configurator-heading">
                <div>
                  <h3>{t("Country transition")}</h3>
                  <p>{t("Applied when the country changes.")}</p>
                </div>
              </div>

              <fieldset disabled={Boolean(loadingWorkLocation)}>
                <legend className="sr-only">{t("Country or work region animation")}</legend>
                <div className="prototype-motion-options" role="radiogroup" aria-label={t("Country or work region animation")}>
                  {WORK_LOCATION_ANIMATIONS.map((item, index) => {
                    const isDisabled = item.id === "animation-04" || item.id === "animation-05";
                    const isActive = !isDisabled && item.id === workLocationAnimationId;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        aria-label={isDisabled ? `${t(item.label)} · ${t("Coming soon")}` : t(item.label)}
                        title={isDisabled ? t("Coming soon") : undefined}
                        disabled={isDisabled}
                        className={`prototype-motion-option${isActive ? " is-active" : ""}${isDisabled ? " is-coming-soon" : ""}`}
                        onClick={() => setWorkLocationAnimationId(item.id)}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            </div>
          )}
        </div>
      </div>
    </div>
    </PrototypeThemeContext.Provider>
  );
}
