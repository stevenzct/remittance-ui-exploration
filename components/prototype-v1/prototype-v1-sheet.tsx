"use client";

import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { PrototypeIcon } from "@/components/prototype/prototype-icon";
import { V1_WALLETS, V1_WORK_WALLETS, type V1WalletId, type V1WorkCountry } from "./prototype-v1-wallets";
import styles from "./prototype-v1-sheet.module.css";

gsap.registerPlugin(Draggable);

export type V1Panel = "work" | "wallets" | "transfer" | "exchange" | "profile" | "bills" | "savings" | "rates" | "moments";

interface PrototypeV1SheetProps {
  readonly panel: V1Panel | null;
  readonly onClose: () => void;
  readonly workCountry: V1WorkCountry | null;
  readonly activeWallet: V1WalletId;
  readonly onWorkCountryChange: (country: V1WorkCountry) => void;
}

const TITLES: Record<V1Panel, string> = {
  work: "Where do you work?",
  wallets: "Your wallets",
  transfer: "Transfer money",
  exchange: "Exchange money",
  profile: "Your account",
  bills: "Pay your bills",
  savings: "Your savings",
  rates: "Exchange rates",
  moments: "Payso Moments",
};

const INFORMATION: Partial<Record<V1Panel, { title: string; description: string }>> = {
  bills: { title: "Keep everyday payments together", description: "A place for household bills and the payments that help you take care of home." },
  savings: { title: "Make room for your next goal", description: "Set money aside for the plans that matter to you and your family." },
  rates: { title: "Plan your next exchange", description: "Explore the wallet and currency controls in the interactive prototype. Live exchange rates are not connected to this preview." },
  moments: { title: "Closer to the moments that matter", description: "A space for the milestones you share with the people back home." },
};

const ALL_WALLETS = [
  { id: "hkd", label: "HKD Wallet", balance: "HK$ 5,000.00", flag: "/assets/prototype-figma/flag-hong-kong.svg", action: null },
  { id: "php", label: "PHP Wallet", balance: "₱ 5,000.00", flag: "/assets/prototype-v1/flag-ph.svg", action: null },
  { id: "sgd", label: "SGD Wallet", balance: "S$ 5,000.00", flag: "/assets/prototype-figma/flag-singapore.svg", action: null },
  { id: "sar", label: "SAR Wallet", balance: "Not open", flag: "/assets/prototype-figma/flag-saudi-arabia.svg", action: "Open" },
] as const;

function ExplorePrototypeLink() {
  return (
    <Link className={styles.primaryLink} href="/prototype">
      Explore interactive prototype
      <PrototypeIcon name="arrow-right" size={18} />
    </Link>
  );
}

function SheetContent({ panel, onClose, workCountry, activeWallet, onWorkCountryChange }: PrototypeV1SheetProps & { readonly panel: V1Panel }) {
  const titleId = useId();
  const descriptionId = useId();
  const countryName = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const draggableSheetRef = useRef<HTMLElement>(null);
  const draggableHandleRef = useRef<HTMLButtonElement>(null);
  const workSheetClosingRef = useRef(false);
  const workSheetDidDragRef = useRef(false);
  const workSheetCloseTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const selectionTimerRef = useRef<number | null>(null);
  const [selectedCountry, setSelectedCountry] = useState(workCountry);
  const [amount, setAmount] = useState("1000");
  const [destination, setDestination] = useState("Bank account");
  const [currency, setCurrency] = useState(activeWallet === "php" ? "HKD" : "PHP");
  const wallet = V1_WALLETS[activeWallet];
  const walletCurrency = wallet.currency;
  const walletName = wallet.name;
  const information = INFORMATION[panel];
  const numericAmount = Number(amount);
  const hasValidAmount = amount.trim() !== "" && Number.isFinite(numericAmount) && numericAmount > 0;
  const isDraggableSheet = panel === "work" || panel === "wallets";

  const dismissWorkSheet = useCallback((onClosed: () => void = onClose) => {
    if (workSheetClosingRef.current) return;

    const sheet = draggableSheetRef.current;
    const overlay = overlayRef.current;
    const phone = sheet?.closest<HTMLElement>("[data-screen]");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!sheet || !overlay || prefersReducedMotion) {
      workSheetClosingRef.current = false;
      onClosed();
      return;
    }

    const backdropTargets = phone ? [overlay, phone] : [overlay];
    workSheetClosingRef.current = true;
    Draggable.get(sheet)?.disable();
    gsap.killTweensOf([sheet, ...backdropTargets]);
    workSheetCloseTimelineRef.current?.kill();

    const sheetHeight = Math.max(sheet.offsetHeight, 1);
    const currentY = Math.max(0, Number(gsap.getProperty(sheet, "y")) || 0);
    const remainingDistance = Math.max(0, sheetHeight - currentY);
    const duration = Math.max(.12, Math.min(.24, (remainingDistance / sheetHeight) * .24));
    const timeline = gsap.timeline({
      defaults: { overwrite: true },
      onComplete: () => {
        if (workSheetCloseTimelineRef.current !== timeline) return;
        workSheetCloseTimelineRef.current = null;
        workSheetClosingRef.current = false;
        onClosed();
      },
    });
    workSheetCloseTimelineRef.current = timeline;
    timeline
      .to(sheet, { y: sheetHeight, duration, ease: "power2.in" }, 0)
      .to(backdropTargets, { "--v1-sheet-backdrop-opacity": 0, duration: duration * .8, ease: "power1.out" }, 0);
  }, [onClose]);

  useLayoutEffect(() => {
    if (!isDraggableSheet) return;

    const sheet = draggableSheetRef.current;
    const overlay = overlayRef.current;
    const handle = draggableHandleRef.current;
    const phone = sheet?.closest<HTMLElement>("[data-screen]");
    if (!sheet || !overlay || !handle) return;

    const backdropTargets = phone ? [overlay, phone] : [overlay];
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    workSheetClosingRef.current = false;
    workSheetDidDragRef.current = false;
    workSheetCloseTimelineRef.current?.kill();
    workSheetCloseTimelineRef.current = null;
    gsap.set(sheet, { y: prefersReducedMotion ? 0 : sheet.offsetHeight, willChange: prefersReducedMotion ? "auto" : "transform" });
    gsap.set(backdropTargets, { "--v1-sheet-backdrop-opacity": prefersReducedMotion ? .6 : 0 });

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
        handle.classList.add(styles.dragging);
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

        const progress = Math.min(Math.max(draggable.y / Math.max(sheet.offsetHeight, 1), 0), 1);
        gsap.set(backdropTargets, { "--v1-sheet-backdrop-opacity": .6 * (1 - progress * .88) });
      },
      onDragEnd: () => {
        if (disposed || workSheetClosingRef.current) return;
        handle.classList.remove(styles.dragging);

        const sheetHeight = Math.max(sheet.offsetHeight, 1);
        const recentVelocity = performance.now() - lastDragTime <= 120 ? dragVelocity : 0;
        const flickVelocityThreshold = Math.max(.55, (sheetHeight * 2.2) / 1000);
        const shouldDismiss = draggable.y >= sheetHeight * .24
          || (draggable.y >= sheetHeight * .04 && recentVelocity >= flickVelocityThreshold);

        if (shouldDismiss) {
          dismissWorkSheet();
        } else if (prefersReducedMotion) {
          gsap.set(sheet, { y: 0, clearProps: "willChange" });
          gsap.set(backdropTargets, { "--v1-sheet-backdrop-opacity": .6 });
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
            "--v1-sheet-backdrop-opacity": .6,
            duration: .2,
            ease: "power2.out",
            overwrite: true,
          });
        }

        if (workSheetDidDragRef.current) {
          window.setTimeout(() => { workSheetDidDragRef.current = false; }, 0);
        }
      },
    });

    const openTimeline = prefersReducedMotion ? null : gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: () => {
        gsap.set(sheet, { clearProps: "willChange" });
        draggable.update(true);
      },
    })
      .to(backdropTargets, { "--v1-sheet-backdrop-opacity": .6, duration: .14, ease: "power1.out" }, 0)
      .to(sheet, { y: 0, duration: .22, ease: "power3.out" }, 0);

    const resizeObserver = new ResizeObserver(() => draggable.applyBounds({ minY: 0, maxY: sheet.offsetHeight }));
    resizeObserver.observe(sheet);

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      openTimeline?.kill();
      draggable.kill();
      handle.classList.remove(styles.dragging);
      workSheetClosingRef.current = false;
      workSheetDidDragRef.current = false;
      workSheetCloseTimelineRef.current?.kill();
      workSheetCloseTimelineRef.current = null;
      gsap.killTweensOf([sheet, ...backdropTargets]);
      gsap.set(sheet, { clearProps: "transform,willChange" });
      overlay.style.removeProperty("--v1-sheet-backdrop-opacity");
      phone?.style.removeProperty("--v1-sheet-backdrop-opacity");
    };
  }, [dismissWorkSheet, isDraggableSheet]);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        if (isDraggableSheet) dismissWorkSheet();
        else onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const candidates = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex="0"]',
      ) ?? []);
      const focusable = candidates.filter((element) => {
        if (!(element instanceof HTMLInputElement) || element.type !== "radio") return true;
        const group = candidates.filter((candidate): candidate is HTMLInputElement =>
          candidate instanceof HTMLInputElement && candidate.type === "radio" && candidate.name === element.name,
        );
        return element === (group.find((radio) => radio.checked) ?? group[0]);
      });
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) {
        event.preventDefault();
        dialogRef.current?.focus();
      } else if (event.shiftKey && (document.activeElement === first || !dialogRef.current?.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialogRef.current?.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      if (selectionTimerRef.current !== null) window.clearTimeout(selectionTimerRef.current);
    };
  }, [dismissWorkSheet, isDraggableSheet, onClose]);

  function selectCountry(country: V1WorkCountry) {
    if (selectionTimerRef.current !== null) window.clearTimeout(selectionTimerRef.current);
    setSelectedCountry(country);
    selectionTimerRef.current = window.setTimeout(() => {
      selectionTimerRef.current = null;
      dismissWorkSheet(() => onWorkCountryChange(country));
    }, 320);
  }

  if (panel === "work") {
    return (
      <div ref={overlayRef} className={`${styles.overlay} ${styles.workOverlay}`}>
        <div className={styles.backdrop} onClick={() => dismissWorkSheet()} aria-hidden="true" />
        <section
          className={`${styles.sheet} ${styles.workSheet}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          tabIndex={-1}
          ref={(node) => {
            dialogRef.current = node;
            draggableSheetRef.current = node;
          }}
        >
          <button ref={(node) => {
            closeRef.current = node;
            draggableHandleRef.current = node;
          }} className={styles.workHandleButton} onClick={() => {
            if (workSheetClosingRef.current) return;
            if (workSheetDidDragRef.current) {
              workSheetDidDragRef.current = false;
              return;
            }
            dismissWorkSheet();
          }} type="button" aria-label="Close work country selection">
            <span className={styles.workHandle} />
          </button>
          <h2 className={styles.workTitle} id={titleId}>Choose your work country/region</h2>
          <p className={styles.workDescription} id={descriptionId}>
            Wallets, receiving accounts, and local services will be shown based on your selection.
          </p>
          <fieldset className={styles.workCountries}>
            <legend className={styles.srOnly}>Work country or region</legend>
            {V1_WORK_WALLETS.map((country) => {
              const selected = selectedCountry === country.country;
              const indicator = selected
                ? "work-country-selected.svg"
                : country.country === "Saudi Arabia"
                  ? "work-country-unselected-secondary.svg"
                  : "work-country-unselected.svg";

              return (
                <label className={`${styles.workCountry}${selected ? ` ${styles.workCountrySelected}` : ""}`} key={country.id}>
                  <input
                    type="radio"
                    name={countryName}
                    value={country.country}
                    checked={selected}
                    onChange={() => selectCountry(country.country)}
                    onClick={() => { if (selected) selectCountry(country.country); }}
                  />
                  <Image className={country.id === "sgd" ? styles.singaporeFlag : undefined} src={`/assets/prototype-figma/${country.flag}`} width={32} height={32} alt="" />
                  <span>{country.country}</span>
                  <Image
                    className={styles.workIndicator}
                    src={`/assets/prototype-figma/${indicator}`}
                    width={selected ? 24 : 21}
                    height={selected ? 24 : 21}
                    alt=""
                  />
                </label>
              );
            })}
          </fieldset>
        </section>
      </div>
    );
  }

  if (panel === "wallets") {
    return (
      <div ref={overlayRef} className={`${styles.overlay} ${styles.walletsOverlay}`}>
        <div className={styles.backdrop} onClick={() => dismissWorkSheet()} aria-hidden="true" />
        <section
          className={`${styles.sheet} ${styles.walletsSheet}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          tabIndex={-1}
          ref={(node) => {
            dialogRef.current = node;
            draggableSheetRef.current = node;
          }}
        >
          <button ref={(node) => {
            closeRef.current = node;
            draggableHandleRef.current = node;
          }} className={styles.walletsHandleButton} onClick={() => {
            if (workSheetClosingRef.current) return;
            if (workSheetDidDragRef.current) {
              workSheetDidDragRef.current = false;
              return;
            }
            dismissWorkSheet();
          }} type="button" aria-label="Close all wallets">
            <span className={styles.workHandle} />
          </button>
          <h2 className={styles.walletsTitle} id={titleId}>All&nbsp; wallets</h2>
          <p className={styles.walletsDescription} id={descriptionId}>View balances and wallet details</p>
          <div className={styles.walletRows}>
            {ALL_WALLETS.map((item) => (
              <button className={styles.walletRow} type="button" key={item.id} onClick={() => {
                if (item.action) return;
                dismissWorkSheet();
              }}>
                <Image className={`${styles.walletFlag}${item.id === "sgd" ? ` ${styles.singaporeWalletFlag}` : ""}`} src={item.flag} width={32} height={32} alt="" unoptimized />
                <span className={styles.walletRowCopy}>
                  <strong>{item.label}</strong>
                  <small>{item.balance}</small>
                </span>
                {item.action ? <span className={styles.openWallet}>{item.action}</span> : (
                  <Image className={styles.walletChevron} src="/assets/prototype-v1/profile/chevron.svg" width={16} height={16} alt="" unoptimized />
                )}
              </button>
            ))}
          </div>
          <button type="button" className={styles.manageWallets}>Manage Wallets</button>
        </section>
      </div>
    );
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      <section className={styles.sheet} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} ref={dialogRef}>
        <div className={styles.handle} aria-hidden="true" />
        <header className={styles.header}>
          <h2 id={titleId}>{TITLES[panel]}</h2>
          <button ref={closeRef} className={styles.close} onClick={onClose} type="button" aria-label={`Close ${TITLES[panel].toLowerCase()}`}>
            <PrototypeIcon name="close" size={20} />
          </button>
        </header>
        <div className={styles.content}>
          {(panel === "transfer" || panel === "exchange") && <>
            <p className={styles.description}>{panel === "transfer" ? `Preview a transfer from your ${walletName} wallet.` : "Choose a currency to preview the exchange setup."}</p>
            <label className={styles.field}>From wallet<span className={styles.readOnly}>{walletName} <strong>{walletCurrency}</strong></span></label>
            <label className={styles.field}>Amount in {walletCurrency}<input type="number" inputMode="decimal" min="0" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" /></label>
            {panel === "transfer" ? <label className={styles.field}>Send to<select value={destination} onChange={(event) => setDestination(event.target.value)}><option>Bank account</option><option>Payso wallet</option></select></label> : <label className={styles.field}>Exchange to<select value={currency} onChange={(event) => setCurrency(event.target.value)}>{Object.values(V1_WALLETS).filter((item) => item.id !== activeWallet).map((item) => <option key={item.id} value={item.currency}>{item.currency} · {item.country}</option>)}</select></label>}
            <div className={styles.preview} aria-live="polite">
              <strong>{!hasValidAmount ? "Enter an amount greater than zero." : panel === "transfer" ? `${walletCurrency} ${numericAmount.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} → ${destination}` : `${walletCurrency} → ${currency}`}</strong>
              <p>{panel === "transfer" ? "Preview only. No funds are moved." : "A live exchange quote is not connected to this prototype."}</p>
            </div>
            <ExplorePrototypeLink />
          </>}

          {panel === "profile" && <>
            <div className={styles.profile}><span><PrototypeIcon name="wallet" size={26} /></span><h3>Your Payso account</h3><p>First-launch preview</p></div>
            <dl className={styles.details}><div><dt>Home country</dt><dd>Philippines</dd></div><div><dt>Home wallet</dt><dd>Philippine Peso</dd></div><div><dt>Work country</dt><dd>{workCountry ?? "Not selected"}</dd></div></dl>
            <ExplorePrototypeLink />
          </>}

          {information && <>
            <div className={styles.information}><span className={styles.featureIcon}><PrototypeIcon name={panel === "rates" ? "exchange" : "sparkles"} size={28} /></span><h3>{information.title}</h3><p>{information.description}</p></div>
            <p className={styles.previewNote}>This feature is a preview in Prototype V1.</p>
            <ExplorePrototypeLink />
          </>}
        </div>
      </section>
    </div>
  );
}

export function PrototypeV1Sheet(props: PrototypeV1SheetProps) {
  return props.panel ? <SheetContent key={props.panel} {...props} panel={props.panel} /> : null;
}
