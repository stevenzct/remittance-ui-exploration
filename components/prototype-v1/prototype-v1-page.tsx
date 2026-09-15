"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { PrototypeIcon } from "@/components/prototype/prototype-icon";
import { TakeoffArcTransition } from "@/components/prototype/takeoff-arc-transition";
import { PrototypeV1Sheet, type V1Panel } from "./prototype-v1-sheet";
import { PrototypeV1Profile } from "./prototype-v1-profile";
import { PrototypeV1Transfer } from "./prototype-v1-transfer";
import { V1_WALLETS, V1_WORK_ARTWORK, V1_WORK_WALLETS, type V1WalletId, type V1WorkCountry } from "./prototype-v1-wallets";
import styles from "./prototype-v1-page.module.css";

const ASSETS = "/assets/prototype-v1";
const SHARED_ASSETS: Readonly<Record<string, string>> = {
  "banner-remittance.png": "remittance-banner.png",
  "flag-fabric.png": "flag-fabric.png",
  "flag-hong-kong.svg": "flag-hong-kong.svg",
  "flag-singapore.svg": "flag-singapore.svg",
  "flag-saudi-arabia.svg": "flag-saudi-arabia.svg",
  "flag-watermark-hk.png": "flag-fabric-hk.png",
  "icon-copy.svg": "icon-copy-theme-03.svg",
  "icon-profile.svg": "icon-profile-theme-03.svg",
};
const promotions = [
  {
    id: "bills", image: "banner-bills.png", title: ["Pay bills", "from abroad"],
    description: ["Support tuition, utilities, and", "daily needs in just a few taps,"], action: "Pay now",
  },
  {
    id: "savings", image: "banner-savings.png", title: ["Low fees,", "bigger savings"],
    description: ["Keep more of what you earn", "on every transfer."], action: "Learn more",
  },
  {
    id: "wallets", image: "banner-remittance.png", title: ["Send love, across borders"],
    description: ["Fast, secure, and reliable remittance to the Philippines"], action: "All Wallets",
  },
  {
    id: "rates", image: "banner-rates.png", title: ["Great rates,", "more value"],
    description: ["Support tuition, utilities, and", "daily needs in just a few taps,"], action: "See rates",
  },
  {
    id: "moments", image: "banner-moments.png", title: ["Send for", "special moments"],
    description: ["Help fund birthdays, gifts,", "and family celebrations."], action: "Send today",
  },
] as const;

type V1Toast = {
  readonly id: number;
  readonly kind: "copy" | "info";
  readonly message: string;
};

type V1Screen = "home" | "profile" | "exchange";

function Asset({ name, width, height = width, className, priority = false }: {
  readonly name: string;
  readonly width: number;
  readonly height?: number;
  readonly className?: string;
  readonly priority?: boolean;
}) {
  const src = SHARED_ASSETS[name] ? `/assets/prototype-figma/${SHARED_ASSETS[name]}` : `${ASSETS}/${name}`;
  return <Image src={src} alt="" width={width} height={height} className={className} priority={priority} unoptimized />;
}

export function PrototypeV1Page() {
  const stageRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const homeScreenRef = useRef<HTMLDivElement>(null);
  const profileScreenRef = useRef<HTMLDivElement>(null);
  const transferScreenRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLElement>(null);
  const navPillRef = useRef<HTMLSpanElement>(null);
  const homeNavRef = useRef<HTMLButtonElement>(null);
  const profileNavRef = useRef<HTMLButtonElement>(null);
  const homeNavLabelRef = useRef<HTMLSpanElement>(null);
  const profileNavLabelRef = useRef<HTMLSpanElement>(null);
  const homeActiveIconRef = useRef<HTMLSpanElement>(null);
  const homeInactiveIconRef = useRef<HTMLSpanElement>(null);
  const profileActiveIconRef = useRef<HTMLSpanElement>(null);
  const profileInactiveIconRef = useRef<HTMLSpanElement>(null);
  const activeScreenRef = useRef<V1Screen>("home");
  const screenTransitionRef = useRef<gsap.core.Timeline | null>(null);
  const toastRef = useRef<HTMLDivElement>(null);
  const toastTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const toastSequenceRef = useRef(0);
  const panelTriggerRef = useRef<HTMLElement | null>(null);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [panel, setPanel] = useState<V1Panel | null>(null);
  const [workCountry, setWorkCountry] = useState<V1WorkCountry | null>(null);
  const [activeWallet, setActiveWallet] = useState<V1WalletId>("php");
  const [loadingCountry, setLoadingCountry] = useState<V1WorkCountry | "Philippines" | null>(null);
  const [toast, setToast] = useState<V1Toast | null>(null);
  const [activeScreen, setActiveScreen] = useState<V1Screen>("home");
  const [transferSheetOpen, setTransferSheetOpen] = useState(false);
  const [isMobileFullscreen, setIsMobileFullscreen] = useState(false);
  const isHongKong = activeWallet === "hkd";
  const isWorkWallet = activeWallet !== "php";
  const wallet = V1_WALLETS[activeWallet];
  const needsReceivingAccount = wallet.receivingBank === null;
  const workWallet = V1_WORK_WALLETS.find((item) => item.country === workCountry);
  const workArtwork = workCountry ? V1_WORK_ARTWORK[workCountry] : null;

  const showToast = useCallback((message: string, kind: V1Toast["kind"] = "info") => {
    toastSequenceRef.current += 1;
    setToast({ id: toastSequenceRef.current, kind, message });
  }, []);

  const focusTransition = useCallback((node: HTMLDivElement | null) => {
    node?.focus({ preventScroll: true });
  }, []);

  const openPanel = useCallback((nextPanel: V1Panel) => {
    panelTriggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setPanel(nextPanel);
  }, []);

  const closePanel = useCallback(() => {
    setPanel(null);
    requestAnimationFrame(() => panelTriggerRef.current?.focus({ preventScroll: true }));
  }, []);

  const selectWorkCountry = useCallback((country: V1WorkCountry) => {
    setPanel(null);
    setToast(null);
    setLoadingCountry(country);
  }, []);

  const showSelectedWallet = useCallback(() => {
    if (loadingCountry === "Philippines") {
      setActiveWallet("php");
      setWorkCountry(null);
    } else {
      const nextWallet = V1_WORK_WALLETS.find((item) => item.country === loadingCountry);
      if (!nextWallet) return;
      setWorkCountry(nextWallet.country);
      setActiveWallet(nextWallet.id);
    }
    scrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [loadingCountry]);

  const finishCountryTransition = useCallback(() => {
    setLoadingCountry(null);
    requestAnimationFrame(() => panelTriggerRef.current?.focus({ preventScroll: true }));
  }, []);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const canvas = canvasRef.current;
    if (!viewport || !canvas) return;
    const resize = () => {
      const scale = viewport.clientWidth / 375;
      canvas.style.setProperty("--phone-scale", String(scale));
      canvas.style.height = `${viewport.clientHeight / scale}px`;
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mobileViewport = window.matchMedia("(max-width: 1023px)");

    const updateMobileFullscreen = () => {
      const stage = stageRef.current;

      if (!mobileViewport.matches || !stage) {
        setIsMobileFullscreen(false);
        return;
      }

      setIsMobileFullscreen(stage.getBoundingClientRect().top <= 1);
    };

    updateMobileFullscreen();
    window.addEventListener("scroll", updateMobileFullscreen, { passive: true });
    window.addEventListener("resize", updateMobileFullscreen);
    mobileViewport.addEventListener("change", updateMobileFullscreen);

    return () => {
      window.removeEventListener("scroll", updateMobileFullscreen);
      window.removeEventListener("resize", updateMobileFullscreen);
      mobileViewport.removeEventListener("change", updateMobileFullscreen);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("prototype-experience-fullscreen", isMobileFullscreen);

    return () => document.body.classList.remove("prototype-experience-fullscreen");
  }, [isMobileFullscreen]);

  useLayoutEffect(() => {
    const homeScreen = homeScreenRef.current;
    const profileScreen = profileScreenRef.current;
    const transferScreen = transferScreenRef.current;
    if (!homeScreen || !profileScreen || !transferScreen) return;

    const homeContent = homeScreen.querySelectorAll<HTMLElement>("[data-screen-content]");
    const profileContent = profileScreen.querySelectorAll<HTMLElement>("[data-screen-content]");
    const transferContent = transferScreen.querySelectorAll<HTMLElement>("[data-exchange-content]");
    gsap.set(homeScreen, { pointerEvents: "auto" });
    gsap.set([profileScreen, transferScreen], { pointerEvents: "none" });
    gsap.set(homeContent, { autoAlpha: 1, x: 0, y: 0 });
    gsap.set([...profileContent, ...transferContent], { autoAlpha: 0, x: 0, y: 10 });

    return () => {
      screenTransitionRef.current?.kill();
      gsap.killTweensOf([...homeContent, ...profileContent, ...transferContent]);
    };
  }, []);

  useLayoutEffect(() => {
    const toastNode = toastRef.current;
    if (!toast || !toastNode) return;

    toastTimelineRef.current?.kill();
    gsap.killTweensOf(toastNode);

    const hideToast = () => {
      setToast((currentToast) => currentToast?.id === toast.id ? null : currentToast);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(toastNode, { autoAlpha: 1, scale: 1, y: 0 });
      const timeout = window.setTimeout(hideToast, 2200);
      return () => window.clearTimeout(timeout);
    }

    toastTimelineRef.current = gsap.timeline({ onComplete: hideToast })
      .fromTo(toastNode,
        { autoAlpha: 0, scale: .96, y: -8 },
        { autoAlpha: 1, scale: 1, y: 0, duration: .3, ease: "power3.out" })
      .to(toastNode, { autoAlpha: 0, scale: .98, y: -6, duration: .2, ease: "power2.in" }, "+=1.7");

    return () => {
      toastTimelineRef.current?.kill();
      gsap.killTweensOf(toastNode);
    };
  }, [toast]);

  async function copyAccount() {
    try {
      await navigator.clipboard.writeText("735-****-1234");
    } catch {
      // Clipboard access can be unavailable in an embedded prototype. The tap
      // still receives the same confirmation feedback as the Figma flow.
    }
    showToast("Account reference copied", "copy");
  }

  const changeScreen = useCallback((nextScreen: V1Screen) => {
    const currentScreen = activeScreenRef.current;
    if (nextScreen === currentScreen) return;

    const homeScreen = homeScreenRef.current;
    const profileScreen = profileScreenRef.current;
    const transferScreen = transferScreenRef.current;
    const navigation = navigationRef.current;
    if (!homeScreen || !profileScreen || !transferScreen || !navigation) return;

    const screenFor = (screen: V1Screen) => screen === "home" ? homeScreen : screen === "profile" ? profileScreen : transferScreen;
    const contentFor = (screen: V1Screen) => [...screenFor(screen).querySelectorAll<HTMLElement>(screen === "exchange" ? "[data-exchange-content]" : "[data-screen-content]")];
    const currentLayer = screenFor(currentScreen);
    const nextLayer = screenFor(nextScreen);
    const outgoing = contentFor(currentScreen);
    const incoming = contentFor(nextScreen);
    const direction = nextScreen === "home" ? -1 : 1;
    const involvesExchange = currentScreen === "exchange" || nextScreen === "exchange";
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const navPill = navPillRef.current;
    const homeNav = homeNavRef.current;
    const profileNav = profileNavRef.current;
    const homeNavLabel = homeNavLabelRef.current;
    const profileNavLabel = profileNavLabelRef.current;
    const homeActiveIcon = homeActiveIconRef.current;
    const homeInactiveIcon = homeInactiveIconRef.current;
    const profileActiveIcon = profileActiveIconRef.current;
    const profileInactiveIcon = profileInactiveIconRef.current;
    if (!navPill || !homeNav || !profileNav || !homeNavLabel || !profileNavLabel
      || !homeActiveIcon || !homeInactiveIcon || !profileActiveIcon || !profileInactiveIcon) return;

    activeScreenRef.current = nextScreen;
    setActiveScreen(nextScreen);
    if (currentScreen === "exchange") setTransferSheetOpen(false);
    if (nextScreen === "home") scrollRef.current?.scrollTo({ top: 0, behavior: "instant" });

    const isReversing = Boolean(screenTransitionRef.current);
    screenTransitionRef.current?.kill();
    screenTransitionRef.current = null;
    gsap.killTweensOf([...outgoing, ...incoming, navigation, navPill, homeNav, profileNav,
      homeNavLabel, profileNavLabel, homeActiveIcon, homeInactiveIcon, profileActiveIcon, profileInactiveIcon]);

    const navState = nextScreen === "home"
      ? { pillLeft: 12, homeLeft: 12, homeWidth: 89, homePadding: 12, profileLeft: 109, profileWidth: 24, profilePadding: 0 }
      : { pillLeft: 56, homeLeft: 24, homeWidth: 24, homePadding: 0, profileLeft: 56, profileWidth: 89, profilePadding: 12 };

    if (prefersReducedMotion) {
      gsap.set(currentLayer, { pointerEvents: "none" });
      gsap.set(nextLayer, { pointerEvents: "auto" });
      gsap.set(outgoing, { autoAlpha: 0, x: 0, y: 0 });
      gsap.set(incoming, { autoAlpha: 1, x: 0, y: 0 });
      gsap.set(navigation, { autoAlpha: nextScreen === "exchange" ? 0 : 1 });
      if (!involvesExchange) {
        gsap.set(navPill, { left: navState.pillLeft });
        gsap.set(homeNav, { left: navState.homeLeft, width: navState.homeWidth, paddingLeft: navState.homePadding });
        gsap.set(profileNav, { left: navState.profileLeft, width: navState.profileWidth, paddingLeft: navState.profilePadding });
        gsap.set([homeNavLabel, homeActiveIcon, profileInactiveIcon], { autoAlpha: nextScreen === "home" ? 1 : 0 });
        gsap.set([profileNavLabel, profileActiveIcon, homeInactiveIcon], { autoAlpha: nextScreen === "profile" ? 1 : 0 });
      }
      return;
    }

    gsap.set(currentLayer, { pointerEvents: "none" });
    gsap.set(nextLayer, { pointerEvents: "auto" });
    gsap.set([...outgoing, ...incoming], { willChange: "transform,opacity" });
    if (!isReversing) gsap.set(incoming, { autoAlpha: 0, x: direction * 18, y: 8 });

    const timeline = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: () => {
        gsap.set(outgoing, { autoAlpha: 0, x: 0, y: 0, clearProps: "willChange" });
        gsap.set(incoming, { autoAlpha: 1, x: 0, y: 0, clearProps: "willChange" });
        screenTransitionRef.current = null;
      },
    })
      .to(outgoing, {
        autoAlpha: 0,
        x: direction * -12,
        duration: .18,
        ease: "power2.inOut",
      }, 0)
      .to(incoming, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        duration: .38,
        ease: "power3.out",
        stagger: .035,
      }, .14);

    if (involvesExchange) {
      timeline.to(navigation, {
        autoAlpha: nextScreen === "exchange" ? 0 : 1,
        duration: nextScreen === "exchange" ? .18 : .38,
        ease: nextScreen === "exchange" ? "power2.inOut" : "power3.out",
      }, nextScreen === "exchange" ? 0 : .14);
    } else {
      timeline
        .to(navPill, { left: navState.pillLeft, duration: .42, ease: "power3.inOut" }, 0)
        .to(homeNav, { left: navState.homeLeft, width: navState.homeWidth, paddingLeft: navState.homePadding, duration: .42, ease: "power3.inOut" }, 0)
        .to(profileNav, { left: navState.profileLeft, width: navState.profileWidth, paddingLeft: navState.profilePadding, duration: .42, ease: "power3.inOut" }, 0)
        .to([homeNavLabel, homeActiveIcon, profileInactiveIcon], {
          autoAlpha: nextScreen === "home" ? 1 : 0,
          duration: .2,
        }, 0)
        .to([profileNavLabel, profileActiveIcon, homeInactiveIcon], {
          autoAlpha: nextScreen === "profile" ? 1 : 0,
          duration: .2,
        }, .12);
    }

    screenTransitionRef.current = timeline;
  }, []);

  function goHome() {
    setPanel(null);
    if (activeScreenRef.current === "home") {
      scrollRef.current?.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
      return;
    }
    changeScreen("home");
  }

  function selectHomeCountry(trigger: HTMLButtonElement) {
    if (!isWorkWallet) {
      goHome();
      return;
    }
    panelTriggerRef.current = trigger;
    setPanel(null);
    setToast(null);
    setLoadingCountry("Philippines");
  }

  return (
    <section className={`prototype-fullscreen-page ui-surface rounded-[26px] p-3 sm:rounded-[36px] sm:p-9 lg:p-12 xl:p-14 ${styles.page}`} aria-label="Prototype V1 — first app launch">
      <div ref={stageRef} className={`prototype-device-stage ${styles.stage}${isMobileFullscreen ? " is-mobile-fullscreen" : ""}`}>
        <div className={`phone-shell prototype-phone-shell ${styles.phone}${isMobileFullscreen ? ` is-mobile-fullscreen ${styles.mobileFullscreen}` : ""}`} data-panel={panel ?? undefined} data-screen={activeScreen} data-transfer-sheet={transferSheetOpen || undefined} aria-label="Payso first-launch phone prototype">
          <div className={styles.statusBackdrop} aria-hidden="true" />
          <div ref={viewportRef} className={`phone-screen-viewport ${styles.viewport}`}>
            <div ref={canvasRef} className={styles.canvas}>
              <div ref={homeScreenRef} className={`${styles.home} ${styles.screenLayer}`} aria-hidden={activeScreen !== "home"} inert={panel !== null || loadingCountry !== null || activeScreen !== "home"}>
                <header className={styles.header} data-screen-content>
                  <button className={styles.country} type="button" onClick={(event) => selectHomeCountry(event.currentTarget)} aria-label="Philippines home wallet" aria-pressed={!isWorkWallet}>
                    {isWorkWallet ? <Asset name="country-pill-ph-unselected.svg" width={101} height={30} className={styles.countryInactiveBackground} /> : <Asset name="country-pill.svg" width={129} height={58} className={styles.countryBackground} priority />}
                    <Asset name="flag-ph.svg" width={22} className={styles.flag} priority />
                    <span>Philippines</span>
                  </button>
                  <button className={`${styles.work}${workCountry ? ` ${styles.workChosen}` : ""}`} data-country={workCountry ?? undefined} type="button" onClick={() => openPanel("work")} aria-haspopup="dialog" aria-pressed={isWorkWallet} aria-label={workCountry ? `Work country: ${workCountry}` : "Choose where you work"}>
                    {isWorkWallet && workArtwork && <Asset name={workArtwork.pill} width={workArtwork.pillWidth} height={58} className={styles.countryBackground} />}
                    {workWallet ? <Asset name={workWallet.flag} width={22} className={styles.flag} /> : <span className={styles.workIcon}><Asset name="icon-work.svg" width={20} height={18} /></span>}
                    <span className={styles.workLabel}>{workCountry ?? "Where you work"}</span>
                    {!workCountry && <Asset name="icon-down.svg" width={16} className={styles.down} />}
                  </button>
                </header>

                <div className={styles.scroll} ref={scrollRef} tabIndex={0} aria-label="Wallet and offers" data-screen-content>
                  <section className={styles.wallet} data-currency={activeWallet} data-needs-account={needsReceivingAccount || undefined} aria-label={`${wallet.currency} wallet`}>
                    {needsReceivingAccount ? <div className={styles.workWatermark} aria-hidden="true">
                      <Asset name={activeWallet === "sgd" ? "flag-watermark-sg.png" : "flag-watermark-sa.png"} width={200} height={150} priority />
                    </div> : isHongKong ? <Asset name="flag-watermark-hk.png" width={183} className={styles.hongKongWatermark} priority /> : <div className={styles.fabric} aria-hidden="true">
                      <Asset name="flag-fabric.png" width={200} height={150} priority />
                    </div>}
                    <div className={styles.walletTitle}>
                      <span className={styles.walletIcon}><Asset name="icon-wallet.svg" width={22} /></span>
                      <h2>{wallet.currency} Wallet</h2>
                    </div>
                    <button type="button" className={styles.allWallets} onClick={() => openPanel("wallets")} aria-haspopup="dialog" aria-expanded={panel === "wallets"}>All Wallets</button>
                    <div className={styles.balanceLabel}>
                      <span>Available Balance</span>
                      <button type="button" className={styles.eyeButton} onClick={() => setBalanceVisible(!balanceVisible)} aria-label={balanceVisible ? "Hide balance" : "Show balance"} aria-pressed={!balanceVisible}>
                        {balanceVisible ? <Asset name="icon-eye.svg" width={18} height={15} /> : <PrototypeIcon name="eye-off" size={18} />}
                      </button>
                    </div>
                    <p className={styles.balance} aria-live="polite">{wallet.symbol}{balanceVisible ? "3,000.00" : "••••••••"}</p>
                    <p className={styles.receivingLabel}>{wallet.country} · Receiving Account</p>
                    {needsReceivingAccount ? <button className={styles.openReceivingAccount} type="button" onClick={() => showToast(`${wallet.currency} receiving account setup coming soon`)}>
                      <span className={styles.addAccountIcon}><Asset name="icon-add-account.png" width={36} /></span>
                      <span className={styles.addAccountCopy}><strong>Open your receiving account</strong><span>Add your VA account to start receiving payments securely.</span></span>
                    </button> : <><div className={styles.bankCard}>
                      <Asset name={isHongKong ? "bank-card-hk.png" : "bank-card.png"} width={315} height={117} className={styles.bankArtwork} priority />
                      <span className={styles.bankLogo}><Asset name={isHongKong ? "bank-logo-hk.png" : "bank-logo.png"} width={isHongKong ? 26 : 32} height={isHongKong ? 9 : 24} /></span>
                      <p className={styles.bankName}>{isHongKong ? "DBS Black Card" : "Asia United Bank"}</p>
                      <button type="button" className={styles.account} onClick={copyAccount} aria-label="Copy account reference 735-****-1234">
                        <span>735-****-1234</span><Asset name="icon-copy.svg" width={12} />
                      </button>
                      {isHongKong && <span className={styles.actionRequired}><Asset name="icon-action-info.svg" width={12} /><span>Action required</span></span>}
                      <span className={styles.bankCountry}>{isHongKong ? "Hong Kong · HKD" : "Philippines · PHP"}</span>
                    </div>
                    <Asset name="carousel-dots.svg" width={32} height={8} className={styles.dots} /></>}
                    <div className={styles.actions}>
                      <button type="button">
                        <Asset name="icon-send.svg" width={24} />
                        <span><strong>Transfer</strong><small>Send money easily</small></span>
                      </button>
                      <button type="button" onClick={() => changeScreen("exchange")}>
                        <Asset name="icon-exchange.svg" width={24} />
                        <span><strong>Exchange</strong><small>Convert currencies</small></span>
                      </button>
                    </div>
                  </section>

                  <div className={styles.promotions}>
                    {promotions.map((promotion, index) => (
                      <article key={promotion.id} className={styles.promotion} data-promotion={promotion.id}>
                        <Asset name={promotion.image} width={343} height={165} className={styles.promotionArtwork} priority={index < 2} />
                        <h3>{promotion.title.map((line, lineIndex) => <span key={line}>{lineIndex > 0 && <br />}{line}</span>)}</h3>
                        <p>{promotion.description.map((line, lineIndex) => <span key={line}>{lineIndex > 0 && <br />}{line}</span>)}</p>
                        <button type="button">{promotion.action}</button>
                      </article>
                    ))}
                  </div>
                </div>

              </div>
              <div ref={profileScreenRef} className={`${styles.screenLayer} ${styles.profileScreenLayer}`} aria-hidden={activeScreen !== "profile"} inert={activeScreen !== "profile"}>
                <PrototypeV1Profile onPreview={(label) => showToast(`${label} coming soon`)} />
              </div>
              <nav ref={navigationRef} className={styles.navigation} aria-label="App navigation" aria-hidden={activeScreen === "exchange"} inert={panel !== null || loadingCountry !== null || activeScreen === "exchange"}>
                <span ref={navPillRef} className={styles.navPill} aria-hidden="true" />
                <button ref={homeNavRef} type="button" className={`${styles.navButton} ${styles.homeButton}`} aria-label="Home" aria-current={activeScreen === "home" ? "page" : undefined} onClick={goHome}>
                  <span className={styles.navIcon} aria-hidden="true">
                    <span ref={homeActiveIconRef} className={styles.navIconActive}><Asset name="icon-home.svg" width={24} height={24} /></span>
                    <span ref={homeInactiveIconRef} className={styles.navIconInactive}><Image src="/assets/prototype-v1/profile/nav-home.svg" alt="" width={24} height={24} unoptimized /></span>
                  </span>
                  <span ref={homeNavLabelRef} className={`${styles.navLabel} ${styles.homeNavLabel}`}>Home</span>
                </button>
                <button ref={profileNavRef} type="button" className={`${styles.navButton} ${styles.profileButton}`} aria-label="Profile" aria-current={activeScreen === "profile" ? "page" : undefined} onClick={() => changeScreen("profile")}>
                  <span className={styles.navIcon} aria-hidden="true">
                    <span ref={profileActiveIconRef} className={styles.navIconInactive}><Image src="/assets/prototype-v1/profile/nav-profile.svg" alt="" width={22} height={22} unoptimized /></span>
                    <span ref={profileInactiveIconRef} className={styles.navIconActive}><Asset name="icon-profile.svg" width={22} height={22} /></span>
                  </span>
                  <span ref={profileNavLabelRef} className={`${styles.navLabel} ${styles.profileNavLabel}`}>Profile</span>
                </button>
              </nav>
              <PrototypeV1Transfer
                active={activeScreen === "exchange"}
                rootRef={transferScreenRef}
                onBack={() => changeScreen("home")}
                onSheetOpenChange={setTransferSheetOpen}
              />
              <PrototypeV1Sheet panel={panel} onClose={closePanel} workCountry={workCountry} activeWallet={activeWallet} onWorkCountryChange={selectWorkCountry} />
              {loadingCountry && (
                <div ref={focusTransition} className={styles.transition} tabIndex={-1}>
                  <TakeoffArcTransition
                    destination={loadingCountry}
                    assetSrc={loadingCountry === "Philippines"
                      ? "/assets/prototype-figma/work-location-philippines-loading.png"
                      : V1_WORK_ARTWORK[loadingCountry].transition}
                    onCovered={showSelectedWallet}
                    onComplete={finishCountryTransition}
                  />
                </div>
              )}
              {toast && <div ref={toastRef} className={styles.toast} role="status" aria-live="polite" aria-atomic="true" data-kind={toast.kind}>{toast.message}</div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
