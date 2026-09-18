"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type Ref } from "react";
import styles from "./prototype-v1-transfer.module.css";

const USD_TO_PHP = 52.8;
type CurrencyCode = "USD" | "PHP" | "MYR" | "HKD";
type CurrencySheetKind = "send" | "receive";

function formatMoney(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatWholeMoney(value: string) {
  return Math.trunc(Number(value.replaceAll(",", ""))).toLocaleString("en-US");
}

function amountScale(value: string) {
  if (value.length >= 15) return styles.amountSmall;
  if (value.length >= 11) return styles.amountMedium;
  return styles.amountLarge;
}

export function PrototypeV1Transfer({ active, rootRef, onBack, onSheetOpenChange }: {
  readonly active: boolean;
  readonly rootRef?: Ref<HTMLDivElement>;
  readonly onBack: () => void;
  readonly onSheetOpenChange?: (isOpen: boolean) => void;
}) {
  const [amount, setAmount] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [sendCurrency, setSendCurrency] = useState<CurrencyCode>("USD");
  const [receiveCurrency, setReceiveCurrency] = useState<CurrencyCode>("PHP");
  const [currencySheet, setCurrencySheet] = useState<CurrencySheetKind | null>(null);
  const numericAmount = Number(amount);
  const hasAmount = amount !== "" && Number.isFinite(numericAmount);
  const hasError = hasAmount && numericAmount < 1;
  const hasValidAmount = hasAmount && numericAmount >= 1;

  const sendDisplay = useMemo(() => {
    if (!hasAmount) return "0.00";
    if (isFocused) return amount;
    return formatMoney(numericAmount);
  }, [amount, hasAmount, isFocused, numericAmount]);

  const sendScaleValue = hasAmount ? formatMoney(numericAmount) : "0.00";
  const receiveDisplay = hasValidAmount
    ? formatMoney(sendCurrency === "USD" ? numericAmount * USD_TO_PHP : numericAmount / USD_TO_PHP)
    : "0.00";

  function updateAmount(value: string) {
    const sanitized = value.replace(/[^\d.]/g, "");
    const [whole = "", ...decimalParts] = sanitized.split(".");
    const decimal = decimalParts.join("").slice(0, 2);
    const next = sanitized.includes(".") ? `${whole}.${decimal}` : whole;
    setAmount(next.replace(/^0+(?=\d)/, ""));
  }

  useEffect(() => {
    onSheetOpenChange?.(currencySheet !== null);
    return () => onSheetOpenChange?.(false);
  }, [currencySheet, onSheetOpenChange]);

  function selectSendCurrency(currency: CurrencyCode) {
    if (currency === receiveCurrency) {
      setReceiveCurrency(sendCurrency);
    }
    setSendCurrency(currency);
    setCurrencySheet(null);
  }

  function selectReceiveCurrency(currency: CurrencyCode) {
    if (currency === sendCurrency) return;
    setReceiveCurrency(currency);
    setCurrencySheet(null);
  }

  function swapCurrencies() {
    setSendCurrency(receiveCurrency);
    setReceiveCurrency(sendCurrency);
  }

  return (
    <div ref={rootRef} className={styles.screen} aria-label="Exchange" aria-hidden={!active} inert={!active}>
      <header className={styles.header} data-exchange-content>
        <button type="button" className={styles.back} aria-label="Back to wallet" onClick={onBack}>
          <Image src="/assets/prototype-figma/icon-arrow-left-exchange.svg" alt="" width={24} height={24} unoptimized />
        </button>
        <h2>Exchange</h2>
      </header>

      <section className={`${styles.moneyCard} ${styles.sendCard}`} aria-label="Amount to send" data-exchange-content>
        <span className={styles.cardLabel}>Send</span>
        <label className={styles.amountInputWrap}>
          <span className={styles.srOnly}>Amount in USD</span>
          <input
            className={`${styles.amountInput} ${amountScale(sendScaleValue)}`}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={isFocused ? amount : sendDisplay}
            placeholder="0.00"
            aria-invalid={hasError}
            aria-describedby={hasError ? "transfer-amount-error" : undefined}
            onFocus={(event) => {
              setIsFocused(true);
              requestAnimationFrame(() => event.currentTarget.select());
            }}
            onBlur={() => setIsFocused(false)}
            onChange={(event) => updateAmount(event.target.value)}
          />
        </label>
        {hasError && <span id="transfer-amount-error" className={styles.error} role="alert">The amount needs to be greater than 0</span>}
        <CurrencyPill code={sendCurrency} onClick={() => setCurrencySheet("send")} expanded={currencySheet === "send"} />
        <div className={styles.balanceLine}><span>Available balance:</span><strong>76,022 {sendCurrency}</strong></div>
      </section>

      <button type="button" className={styles.swap} aria-label={`Swap ${sendCurrency} and ${receiveCurrency}`} onClick={swapCurrencies} data-exchange-content>
        <Icon icon="humbleicons:exchange-vertical" width="24" height="24" />
      </button>

      <section className={`${styles.moneyCard} ${styles.receiveCard}`} aria-label="Estimated amount to receive" data-exchange-content>
        <span className={styles.cardLabel}>Receive</span>
        <output className={`${styles.receiveAmount} ${amountScale(receiveDisplay)}${hasValidAmount ? ` ${styles.receiveFilled}` : ""}`} aria-live="polite">{receiveDisplay}</output>
        <CurrencyPill code={receiveCurrency} onClick={() => setCurrencySheet("receive")} expanded={currencySheet === "receive"} />
        <div className={styles.balanceLine}><span>Estimated amount:</span>{hasAmount && <strong>{formatWholeMoney(receiveDisplay)} {receiveCurrency}</strong>}</div>
      </section>

      <section className={styles.detailsCard} aria-label="Transfer details" data-exchange-content>
        <div className={styles.detailRow}>
          <span className={`${styles.detailIcon} ${styles.rateIcon}`}><Icon icon="ic:baseline-show-chart" width="24" height="24" /></span>
          <span>Reference rate:</span>
          {hasAmount && <strong>{sendCurrency === "USD" ? "1.0000 USD = 58.2435 PHP" : "1.0000 PHP = 0.0172 USD"}</strong>}
        </div>
        <div className={styles.detailRow}>
          <span className={`${styles.detailIcon} ${styles.feeIcon}`}><Icon icon="ant-design:tags-outlined" width="24" height="24" /></span>
          <span>Fee</span>
          {hasAmount && <strong>62 {receiveCurrency}</strong>}
        </div>
        <div className={`${styles.detailRow} ${styles.noteRow}`}>
          <span className={`${styles.detailIcon} ${styles.infoIcon}`}><Icon icon="material-symbols:info-outline" width="24" height="24" /></span>
          <p>The estimated amount is for your reference only. Final amount shown at confirmation page.</p>
        </div>
      </section>

      <button className={styles.next} type="button" disabled={!hasValidAmount} data-exchange-content>Next</button>
      {currencySheet && (
        <CurrencyBottomSheet
          kind={currencySheet}
          selected={currencySheet === "send" ? sendCurrency : receiveCurrency}
          disabledCurrency={currencySheet === "receive" ? sendCurrency : undefined}
          onClose={() => setCurrencySheet(null)}
          onSelect={currencySheet === "send" ? selectSendCurrency : selectReceiveCurrency}
        />
      )}
    </div>
  );
}

function CurrencyPill({ code, expanded, onClick }: {
  readonly code: CurrencyCode | "Select";
  readonly expanded: boolean;
  readonly onClick: () => void;
}) {
  return (
    <button type="button" className={styles.currencyPill} aria-label={`${code} currency`} aria-haspopup="dialog" aria-expanded={expanded} onClick={onClick}>
      {code !== "Select" && <CurrencyFlag currency={code} size={22} />}
      <span>{code}</span>
      <Icon icon="gridicons:dropdown" width="24" height="24" />
    </button>
  );
}

const RECEIVE_CURRENCIES: readonly CurrencyCode[] = ["USD", "PHP", "MYR", "HKD", "MYR", "HKD"];

function CurrencyBottomSheet({ kind, selected, disabledCurrency, onClose, onSelect }: {
  readonly kind: CurrencySheetKind;
  readonly selected: CurrencyCode;
  readonly disabledCurrency?: CurrencyCode;
  readonly onClose: () => void;
  readonly onSelect: (currency: CurrencyCode) => void;
}) {
  const sheetRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dragRef = useRef({ pointerId: -1, startY: 0, delta: 0 });
  const [isClosing, setIsClosing] = useState(false);
  const currencies: readonly CurrencyCode[] = kind === "send" ? ["USD", "PHP"] : RECEIVE_CURRENCIES;

  useEffect(() => closeRef.current?.focus({ preventScroll: true }), []);

  const closeSheet = useCallback(() => {
    if (isClosing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onClose();
      return;
    }
    setIsClosing(true);
  }, [isClosing, onClose]);

  useEffect(() => {
    if (!isClosing) return;
    const timeout = window.setTimeout(onClose, 240);
    return () => window.clearTimeout(timeout);
  }, [isClosing, onClose]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSheet();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [closeSheet]);

  function startDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button")) return;
    dragRef.current = { pointerId: event.pointerId, startY: event.clientY, delta: 0 };
    event.currentTarget.setPointerCapture(event.pointerId);
    sheetRef.current?.classList.add(styles.sheetDragging);
  }

  function dragSheet(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragRef.current.pointerId !== event.pointerId || !sheetRef.current) return;
    const scale = sheetRef.current.getBoundingClientRect().width / 375;
    const delta = Math.max(0, event.clientY - dragRef.current.startY);
    dragRef.current.delta = delta;
    sheetRef.current.style.transform = `translateY(${delta / Math.max(scale, .01)}px)`;
  }

  function finishDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragRef.current.pointerId !== event.pointerId || !sheetRef.current) return;
    const sheet = sheetRef.current;
    const shouldClose = dragRef.current.delta > sheet.getBoundingClientRect().height * .22;
    dragRef.current.pointerId = -1;
    sheet.classList.remove(styles.sheetDragging);
    if (shouldClose) {
      closeSheet();
      return;
    }
    sheet.classList.add(styles.sheetSnapping);
    sheet.style.transform = "translateY(0)";
    window.setTimeout(() => sheet.classList.remove(styles.sheetSnapping), 230);
  }

  return (
    <div className={`${styles.sheetOverlay}${isClosing ? ` ${styles.sheetOverlayClosing}` : ""}`} role="presentation">
      <button className={styles.sheetBackdrop} type="button" aria-label="Close currency selection" onClick={closeSheet} />
      <section ref={sheetRef} className={`${styles.currencySheet} ${kind === "receive" ? styles.receiveSheet : styles.sendSheet}`} role="dialog" aria-modal="true" aria-labelledby="currency-sheet-title">
        <div className={styles.sheetHeader} onPointerDown={startDrag} onPointerMove={dragSheet} onPointerUp={finishDrag} onPointerCancel={finishDrag}>
          <span className={styles.dragHandle} aria-hidden="true" />
          <h3 id="currency-sheet-title">Select currency</h3>
          <button ref={closeRef} className={styles.sheetClose} type="button" aria-label="Close currency selection" onClick={closeSheet}>
            <Icon icon="iconamoon:close-bold" width="32" height="32" />
          </button>
        </div>
        <div className={styles.currencyList}>
          {currencies.map((currency, index) => {
            const disabled = currency === disabledCurrency;
            const locked = kind === "receive" && currency === "MYR" && index === 2;
            const isSelected = kind === "send" && !disabled && !locked && currency === selected && currencies.indexOf(currency) === index;
            return (
              <button
                type="button"
                className={`${styles.currencyRow}${isSelected ? ` ${styles.currencyRowSelected}` : ""}${disabled ? ` ${styles.currencyRowDisabled}` : ""}${locked ? ` ${styles.currencyRowLocked}` : ""}`}
                key={`${currency}-${index}`}
                disabled={disabled}
                onClick={() => locked ? undefined : onSelect(currency)}
              >
                <CurrencyFlag currency={currency} size={32} />
                <strong>{currency}</strong>
                {locked ? <span className={styles.lockedCopy}>Wallet not opened yet.<br />Tap and open</span> : <span className={styles.rowBalance}>Balance: <em>{currency === "USD" || currency === "PHP" ? "1000.00" : "00.00"}</em></span>}
                <span className={styles.rowStatus} aria-hidden="true">
                  {disabled ? <Icon icon="mynaui:ban" width="24" height="24" /> : locked ? <Icon icon="material-symbols:lock-outline" width="24" height="24" /> : isSelected ? <Icon icon="ep:circle-check-filled" width="24" height="24" /> : <span className={styles.emptyStatus} />}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function CurrencyFlag({ currency, size }: { readonly currency: CurrencyCode; readonly size: number }) {
  const src = currency === "USD"
    ? `/assets/prototype-figma/flag-us-${size >= 32 ? "32" : "22"}.png`
    : currency === "PHP"
      ? "/assets/prototype-figma/flag-ph.svg"
      : currency === "MYR"
        ? "/assets/prototype-figma/flag-malaysia.svg"
        : "/assets/prototype-figma/flag-hong-kong.svg";
  const exactExport = currency === "USD";
  const isMalaysia = currency === "MYR";

  return (
    <span
      className={`${styles.flagFrame}${exactExport ? ` ${styles.exactFlag}` : ""}${isMalaysia ? ` ${styles.malaysiaFlag}` : ""}`}
      style={{ width: size, height: size, flexBasis: size }}
      aria-hidden="true"
    >
      <Image className={styles.flagImage} src={src} width={size} height={size} alt="" unoptimized />
    </span>
  );
}
