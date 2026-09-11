"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { PrototypeIcon } from "@/components/prototype/prototype-icon";
import { V1_WALLETS, V1_WORK_WALLETS, type V1WalletId, type V1WorkCountry } from "./prototype-v1-wallets";
import styles from "./prototype-v1-sheet.module.css";

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

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onClose();
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
  }, [onClose]);

  function selectCountry(country: V1WorkCountry) {
    if (selectionTimerRef.current !== null) window.clearTimeout(selectionTimerRef.current);
    setSelectedCountry(country);
    selectionTimerRef.current = window.setTimeout(() => {
      selectionTimerRef.current = null;
      onWorkCountryChange(country);
    }, 320);
  }

  if (panel === "work") {
    return (
      <div className={`${styles.overlay} ${styles.workOverlay}`}>
        <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
        <section
          className={`${styles.sheet} ${styles.workSheet}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          tabIndex={-1}
          ref={dialogRef}
        >
          <button ref={closeRef} className={styles.workHandleButton} onClick={onClose} type="button" aria-label="Close work country selection">
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
                  <span>{selected && country.country === "Hong Kong" ? "Hongkong" : country.country}</span>
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
          {panel === "wallets" && <>
            <div className={styles.wallet}>
              <span className={styles.walletCountry}><Image src={`/assets/prototype-figma/${wallet.flag}`} width={25} height={25} alt="" /> {walletName} <span>{walletCurrency}</span></span>
              <small>Available balance</small>
              <strong>{wallet.symbol}3,000.00</strong>
            </div>
            <dl className={styles.details}>
              <div><dt>Receiving bank</dt><dd>{wallet.receivingBank ?? "Not connected"}</dd></div>
              <div><dt>Receiving account</dt><dd>{wallet.receivingBank ? "735-****-1234" : "Not opened"}</dd></div>
              <div><dt>Work country</dt><dd>{workCountry ?? "Not selected"}</dd></div>
            </dl>
            <ExplorePrototypeLink />
          </>}

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
