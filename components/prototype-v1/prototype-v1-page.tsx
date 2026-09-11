"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { PrototypeIcon } from "@/components/prototype/prototype-icon";
import { TakeoffArcTransition } from "@/components/prototype/takeoff-arc-transition";
import { PrototypeV1Sheet, type V1Panel } from "./prototype-v1-sheet";
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
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const panelTriggerRef = useRef<HTMLElement | null>(null);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [panel, setPanel] = useState<V1Panel | null>(null);
  const [workCountry, setWorkCountry] = useState<V1WorkCountry | null>(null);
  const [activeWallet, setActiveWallet] = useState<V1WalletId>("php");
  const [loadingCountry, setLoadingCountry] = useState<V1WorkCountry | "Philippines" | null>(null);
  const [toast, setToast] = useState("");
  const isHongKong = activeWallet === "hkd";
  const isWorkWallet = activeWallet !== "php";
  const wallet = V1_WALLETS[activeWallet];
  const needsReceivingAccount = wallet.receivingBank === null;
  const workWallet = V1_WORK_WALLETS.find((item) => item.country === workCountry);
  const workArtwork = workCountry ? V1_WORK_ARTWORK[workCountry] : null;

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
    setToast("");
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
    const resize = () => canvas.style.setProperty("--phone-scale", String(viewport.clientWidth / 375));
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  async function copyAccount() {
    try {
      await navigator.clipboard.writeText("735-****-1234");
      setToast("Account reference copied");
    } catch {
      setToast("Account reference: 735-****-1234");
    }
  }

  function goHome() {
    setPanel(null);
    scrollRef.current?.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  function selectHomeCountry(trigger: HTMLButtonElement) {
    if (!isWorkWallet) {
      goHome();
      return;
    }
    panelTriggerRef.current = trigger;
    setPanel(null);
    setToast("");
    setLoadingCountry("Philippines");
  }

  return (
    <section className={`ui-surface rounded-[26px] p-3 sm:rounded-[36px] sm:p-9 lg:p-12 xl:p-14 ${styles.page}`} aria-label="Prototype V1 — first app launch">
      <div className={styles.stage}>
        <div className={`phone-shell prototype-phone-shell ${styles.phone}`} data-panel={panel ?? undefined} aria-label="Payso first-launch phone prototype">
          <div className={styles.statusBackdrop} aria-hidden="true" />
          <div ref={viewportRef} className={`phone-screen-viewport ${styles.viewport}`}>
            <div ref={canvasRef} className={styles.canvas}>
              <div className={styles.home} inert={panel !== null || loadingCountry !== null}>
                <header className={styles.header}>
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

                <div className={styles.scroll} ref={scrollRef} tabIndex={0} aria-label="Wallet and offers">
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
                    <button type="button" className={styles.allWallets}>All Wallets</button>
                    <div className={styles.balanceLabel}>
                      <span>Available Balance</span>
                      <button type="button" className={styles.eyeButton} onClick={() => setBalanceVisible(!balanceVisible)} aria-label={balanceVisible ? "Hide balance" : "Show balance"} aria-pressed={!balanceVisible}>
                        {balanceVisible ? <Asset name="icon-eye.svg" width={18} height={15} /> : <PrototypeIcon name="eye-off" size={18} />}
                      </button>
                    </div>
                    <p className={styles.balance} aria-live="polite">{wallet.symbol}{balanceVisible ? "3,000.00" : "••••••••"}</p>
                    <p className={styles.receivingLabel}>{wallet.country} · Receiving Account</p>
                    {needsReceivingAccount ? <button className={styles.openReceivingAccount} type="button" onClick={() => setToast(`${wallet.currency} receiving account setup coming soon`)}>
                      <span className={styles.addAccountIcon}><Asset name="icon-add-account.png" width={36} /></span>
                      <span className={styles.addAccountCopy}><strong>Open your receiving account</strong><span>Add your VA account to start receiving payments securely.</span></span>
                    </button> : <><div className={styles.bankCard}>
                      <Asset name={isHongKong ? "bank-card-hk.png" : "bank-card.png"} width={315} height={117} className={styles.bankArtwork} priority />
                      <span className={styles.bankLogo}><Asset name={isHongKong ? "bank-logo-hk.png" : "bank-logo.png"} width={isHongKong ? 26 : 32} height={isHongKong ? 9 : 24} /></span>
                      <p className={styles.bankName}>{isHongKong ? "DBS Black Card" : "Asia United Bank"}</p>
                      <button type="button" className={styles.account} onClick={copyAccount} aria-label="Copy account reference 735-****-1234">
                        <span>735-****-1234</span>{!isHongKong && <Asset name="icon-copy.svg" width={12} />}
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
                      <button type="button">
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

                <nav className={styles.navigation} aria-label="App navigation">
                  <button type="button" className={styles.homeButton} aria-current="page" onClick={goHome}>
                    <Asset name="icon-home.svg" width={24} /><span>Home</span>
                  </button>
                  <button type="button" className={styles.profileButton} aria-label="Profile">
                    <Asset name="icon-profile.svg" width={22} />
                  </button>
                </nav>
              </div>
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
              <div className={styles.toast} role="status" data-visible={Boolean(toast)}>{toast}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
