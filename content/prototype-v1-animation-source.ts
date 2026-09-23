export type PrototypeV1AnimationId =
  | "country-switch"
  | "work-sheet"
  | "wallet-sheet"
  | "currency-sheet"
  | "bottom-navigation"
  | "enter-exchange"
  | "return-home";

export interface PrototypeV1SourceFile {
  readonly id: string;
  readonly label: string;
  readonly fileName: string;
  readonly language: string;
  readonly code: string;
}

export interface PrototypeV1AnimationSource {
  readonly id: PrototypeV1AnimationId;
  readonly index: string;
  readonly category: string;
  readonly title: string;
  readonly shortTitle: string;
  readonly runtime: string;
  readonly duration: string;
  readonly trigger: string;
  readonly overview: string;
  readonly timeline: readonly {
    readonly time: string;
    readonly label: string;
    readonly detail: string;
  }[];
  readonly implementationNotes: readonly string[];
  readonly accessibility: string;
  readonly files: readonly PrototypeV1SourceFile[];
}

const SCREEN_TRANSITION_ENGINE = String.raw`type Screen = "home" | "profile" | "exchange";

const changeScreen = useCallback((nextScreen: Screen) => {
  const currentScreen = activeScreenRef.current;
  if (nextScreen === currentScreen) return;

  const currentLayer = screenFor(currentScreen);
  const nextLayer = screenFor(nextScreen);
  const outgoing = contentFor(currentScreen);
  const incoming = contentFor(nextScreen);
  const direction = nextScreen === "home" ? -1 : 1;
  const involvesExchange =
    currentScreen === "exchange" || nextScreen === "exchange";
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  activeScreenRef.current = nextScreen;
  setActiveScreen(nextScreen);

  const isReversing = Boolean(screenTransitionRef.current);
  screenTransitionRef.current?.kill();
  gsap.killTweensOf([
    ...outgoing,
    ...incoming,
    navigation,
    navPill,
    homeNav,
    profileNav,
  ]);

  gsap.set(currentLayer, { pointerEvents: "none" });
  gsap.set(nextLayer, { pointerEvents: "auto" });

  if (reduceMotion) {
    gsap.set(outgoing, { autoAlpha: 0, x: 0, y: 0 });
    gsap.set(incoming, { autoAlpha: 1, x: 0, y: 0 });
    gsap.set(navigation, {
      autoAlpha: nextScreen === "exchange" ? 0 : 1,
    });
    return;
  }

  gsap.set([...outgoing, ...incoming], {
    willChange: "transform,opacity",
  });
  if (!isReversing) {
    gsap.set(incoming, {
      autoAlpha: 0,
      x: direction * 18,
      y: 8,
    });
  }

  const timeline = gsap.timeline({
    defaults: { overwrite: "auto" },
    onComplete: () => {
      gsap.set(outgoing, {
        autoAlpha: 0,
        x: 0,
        y: 0,
        clearProps: "willChange",
      });
      gsap.set(incoming, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        clearProps: "willChange",
      });
      screenTransitionRef.current = null;
    },
  })
    .to(outgoing, {
      autoAlpha: 0,
      x: direction * -12,
      duration: 0.18,
      ease: "power2.inOut",
    }, 0)
    .to(incoming, {
      autoAlpha: 1,
      x: 0,
      y: 0,
      duration: 0.38,
      ease: "power3.out",
      stagger: 0.035,
    }, 0.14);

  if (involvesExchange) {
    timeline.to(navigation, {
      autoAlpha: nextScreen === "exchange" ? 0 : 1,
      duration: nextScreen === "exchange" ? 0.18 : 0.38,
      ease: nextScreen === "exchange"
        ? "power2.inOut"
        : "power3.out",
    }, nextScreen === "exchange" ? 0 : 0.14);
  }

  screenTransitionRef.current = timeline;
}, []);`;

const DRAGGABLE_SHEET_CORE = String.raw`useLayoutEffect(() => {
  if (!isDraggableSheet) return;

  const sheet = sheetRef.current;
  const overlay = overlayRef.current;
  const handle = handleRef.current;
  if (!sheet || !overlay || !handle) return;

  const height = Math.max(sheet.offsetHeight, 1);
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  gsap.set(sheet, {
    y: reduceMotion ? 0 : height,
    willChange: reduceMotion ? "auto" : "transform",
  });
  gsap.set(overlay, { "--sheet-backdrop-opacity": 0 });

  let lastY = 0;
  let lastTime = performance.now();
  let velocity = 0;

  const [draggable] = Draggable.create(sheet, {
    type: "y",
    trigger: handle,
    bounds: { minY: 0, maxY: height },
    edgeResistance: 0.9,
    minimumMovement: 6,
    force3D: true,
    onPress: () => {
      gsap.killTweensOf([sheet, overlay]);
      lastY = draggable.y;
      lastTime = performance.now();
      velocity = 0;
    },
    onDrag: () => {
      const now = performance.now();
      const elapsed = Math.max(now - lastTime, 1);
      const instantVelocity = (draggable.y - lastY) / elapsed;
      velocity = velocity * 0.55 + instantVelocity * 0.45;
      lastY = draggable.y;
      lastTime = now;

      const progress = Math.min(Math.max(draggable.y / height, 0), 1);
      gsap.set(overlay, {
        "--sheet-backdrop-opacity": 0.6 * (1 - progress * 0.88),
      });
    },
    onDragEnd: () => {
      const recentVelocity =
        performance.now() - lastTime <= 120 ? velocity : 0;
      const flickThreshold = Math.max(0.55, (height * 2.2) / 1000);
      const shouldDismiss = draggable.y >= height * 0.24
        || (draggable.y >= height * 0.04
          && recentVelocity >= flickThreshold);

      if (shouldDismiss) dismissSheet();
      else snapSheetOpen(sheet, overlay, draggable);
    },
  });

  const opening = reduceMotion ? null : gsap.timeline()
    .to(overlay, {
      "--sheet-backdrop-opacity": 0.6,
      duration: 0.14,
      ease: "power1.out",
    }, 0)
    .to(sheet, {
      y: 0,
      duration: 0.22,
      ease: "power3.out",
    }, 0);

  return () => {
    opening?.kill();
    draggable.kill();
    gsap.killTweensOf([sheet, overlay]);
    gsap.set(sheet, { clearProps: "transform,willChange" });
  };
}, [dismissSheet, isDraggableSheet]);`;

const SHEET_ACCESSIBILITY = String.raw`useEffect(() => {
  closeButtonRef.current?.focus({ preventScroll: true });

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      dismissSheet();
      return;
    }

    if (event.key !== "Tab") return;
    const focusable = getFocusableElements(dialogRef.current);
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  document.addEventListener("keydown", onKeyDown);
  return () => document.removeEventListener("keydown", onKeyDown);
}, [dismissSheet]);`;

export const PROTOTYPE_V1_ANIMATIONS: readonly PrototypeV1AnimationSource[] = [
  {
    id: "country-switch",
    index: "01",
    category: "Country regions",
    title: "Country region switch",
    shortTitle: "Country switch",
    runtime: "React + GSAP",
    duration: "1.16s",
    trigger: "Select a work country or return to the Philippines wallet.",
    overview: "A covered state change keeps the wallet swap invisible. The destination artwork follows a shallow 3D arc, settles, and then reveals the new country wallet.",
    timeline: [
      { time: "0.00–0.18s", label: "Cover", detail: "The white transition layer rises over the current wallet." },
      { time: "0.04–0.46s", label: "Cruise", detail: "Destination artwork enters with perspective and rotation." },
      { time: "0.46–0.70s", label: "Approach", detail: "A small positional overshoot preserves momentum." },
      { time: "0.70–0.88s", label: "Settle", detail: "Translation and rotation resolve to their resting values." },
      { time: "1.02–1.16s", label: "Reveal", detail: "The cover fades after the wallet state has been committed." },
    ],
    implementationNotes: [
      "Preload the destination artwork before starting the timeline.",
      "Commit the country and wallet state from onCovered, while the interface is hidden.",
      "Kill the timeline and clear transform properties when the destination changes or the component unmounts.",
    ],
    accessibility: "The overlay uses role=status and an aria-live announcement. Reduced motion replaces the travel path with a short covered state change.",
    files: [
      {
        id: "component",
        label: "Component",
        fileName: "country-region-transition.tsx",
        language: "TSX",
        code: String.raw`"use client";

import { gsap } from "gsap";
import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";

const MOTION = {
  from: { x: "-26cqw", y: "11cqw", rotationY: -8, rotationZ: -7 },
  cruise: { x: "-6cqw", y: "-3cqw", rotationY: -2, rotationZ: -3 },
  approach: { x: "2cqw", y: "-1.1cqw", rotationY: 0, rotationZ: -1 },
} as const;

export function CountryRegionTransition({
  destination,
  assetSrc,
  onCovered,
  onComplete,
}: {
  destination: string;
  assetSrc: string;
  onCovered: () => void;
  onComplete: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const artworkRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    if (!ready) return;
    const overlay = overlayRef.current;
    const artwork = artworkRef.current;
    if (!overlay || !artwork) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      gsap.set([overlay, artwork], { autoAlpha: 1 });
      onCovered();
      const timer = window.setTimeout(onComplete, 400);
      return () => window.clearTimeout(timer);
    }

    gsap.set(artwork, {
      transformPerspective: 900,
      transformStyle: "preserve-3d",
      willChange: "transform,opacity",
    });

    const timeline = gsap.timeline({
      onComplete,
      defaults: { overwrite: "auto" },
    });

    timeline
      .fromTo(overlay,
        { autoAlpha: 0, yPercent: 100 },
        { autoAlpha: 1, yPercent: 0, duration: 0.18, ease: "power3.out", onComplete: onCovered },
        0)
      .fromTo(artwork,
        { autoAlpha: 0, ...MOTION.from, transformOrigin: "64% 52%" },
        { autoAlpha: 1, ...MOTION.cruise, duration: 0.42, ease: "power3.out" },
        0.04)
      .to(artwork, { ...MOTION.approach, duration: 0.24, ease: "sine.out" }, 0.46)
      .to(artwork, { x: 0, y: 0, rotationY: 0, rotationZ: 0, duration: 0.18, ease: "sine.out" }, 0.70)
      .to(overlay, { autoAlpha: 0, duration: 0.14, ease: "power1.in" }, 1.02);

    return () => {
      timeline.kill();
      gsap.killTweensOf([overlay, artwork]);
      gsap.set([overlay, artwork], { clearProps: "all" });
    };
  }, [assetSrc, destination, onComplete, onCovered, ready]);

  return (
    <div ref={overlayRef} className="countryTransition" role="status" aria-live="polite">
      <span className="srOnly">Switching to {destination}</span>
      <div ref={artworkRef} className="countryArtwork">
        <Image src={assetSrc} alt="" fill priority onLoad={() => setReady(true)} />
      </div>
    </div>
  );
}`,
      },
      {
        id: "integration",
        label: "Integration",
        fileName: "wallet-screen.tsx",
        language: "TSX",
        code: String.raw`const [loadingCountry, setLoadingCountry] = useState<Country | null>(null);
const [activeWallet, setActiveWallet] = useState<WalletId>("php");

function selectWorkCountry(country: Country) {
  setPanel(null);
  setLoadingCountry(country);
}

function showSelectedWallet() {
  if (!loadingCountry) return;
  setActiveWallet(walletIdForCountry(loadingCountry));
}

function finishCountryTransition() {
  setLoadingCountry(null);
  requestAnimationFrame(() => walletHeadingRef.current?.focus());
}

{loadingCountry && (
  <CountryRegionTransition
    destination={loadingCountry}
    assetSrc={artworkForCountry(loadingCountry)}
    onCovered={showSelectedWallet}
    onComplete={finishCountryTransition}
  />
)}`,
      },
      {
        id: "styles",
        label: "Styles",
        fileName: "country-region-transition.module.css",
        language: "CSS",
        code: String.raw`.countryTransition {
  position: absolute;
  z-index: 30;
  inset: 0;
  overflow: hidden;
  background: #fff;
  container-type: inline-size;
}

.countryArtwork {
  position: absolute;
  inset: 0;
  transform-origin: 64% 52%;
}

.countryArtwork img {
  object-fit: cover;
  user-select: none;
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .countryArtwork { transform: none; }
}`,
      },
    ],
  },
  {
    id: "work-sheet",
    index: "02",
    category: "Bottom sheets",
    title: "Work-country bottom sheet",
    shortTitle: "Work-country sheet",
    runtime: "GSAP + Draggable",
    duration: "0.22s + gesture",
    trigger: "Tap Where you work in the country selector.",
    overview: "The sheet rises with a synchronized backdrop, follows the pointer during a drag, and decides between dismissal and snap-back using distance and recent velocity.",
    timeline: [
      { time: "0.00–0.14s", label: "Backdrop", detail: "The phone chrome and overlay darken together." },
      { time: "0.00–0.22s", label: "Enter", detail: "The sheet moves from its measured height to zero." },
      { time: "Gesture", label: "Track", detail: "Backdrop opacity is derived continuously from drag progress." },
      { time: "Release", label: "Decide", detail: "A 24% drag or qualifying flick dismisses the sheet." },
      { time: "0.00–0.24s", label: "Recover", detail: "An incomplete gesture snaps back with power3.out." },
    ],
    implementationNotes: [
      "Measure the rendered sheet so bounds and velocity thresholds adapt to content height.",
      "Use the handle as the Draggable trigger so controls inside the sheet remain clickable.",
      "Disable Draggable before running the programmatic close timeline.",
    ],
    accessibility: "Focus moves to the close control, Escape dismisses the sheet, Tab stays inside the dialog, and focus returns to the country trigger.",
    files: [
      { id: "motion", label: "Motion", fileName: "use-draggable-sheet.ts", language: "TypeScript", code: DRAGGABLE_SHEET_CORE },
      { id: "accessibility", label: "Accessibility", fileName: "sheet-focus.ts", language: "TypeScript", code: SHEET_ACCESSIBILITY },
      {
        id: "integration",
        label: "Integration",
        fileName: "work-country-sheet.tsx",
        language: "TSX",
        code: String.raw`<div ref={overlayRef} className={styles.overlay}>
  <button
    className={styles.backdrop}
    type="button"
    aria-label="Close work-country selection"
    onClick={() => dismissSheet()}
  />
  <section
    ref={dialogRef}
    className={styles.sheet}
    role="dialog"
    aria-modal="true"
    aria-labelledby="work-country-title"
  >
    <button ref={handleRef} className={styles.handle} aria-label="Drag to close">
      <span aria-hidden="true" />
    </button>
    <h2 id="work-country-title">Where do you work?</h2>
    <CountryOptions onSelect={onWorkCountryChange} />
  </section>
</div>`,
      },
    ],
  },
  {
    id: "wallet-sheet",
    index: "03",
    category: "Bottom sheets",
    title: "All-wallets bottom sheet",
    shortTitle: "Wallets sheet",
    runtime: "GSAP + Draggable",
    duration: "0.22s + gesture",
    trigger: "Tap All Wallets on the active wallet card.",
    overview: "The wallet picker reuses the same measured draggable-sheet engine, while its integration keeps selection state and focus restoration separate from the motion primitive.",
    timeline: [
      { time: "0.00s", label: "Measure", detail: "The sheet height becomes the initial translation and drag bound." },
      { time: "0.00–0.22s", label: "Present", detail: "Sheet and backdrop animate as one coordinated surface." },
      { time: "Gesture", label: "Scrub", detail: "Translation and backdrop respond directly to pointer movement." },
      { time: "Release", label: "Resolve", detail: "The sheet closes or returns to its stable open position." },
    ],
    implementationNotes: [
      "Share the motion hook, not the sheet content or selection state.",
      "Keep wallet buttons native so keyboard activation works without gesture code.",
      "Close the sheet before changing the active wallet to avoid content flashing beneath the backdrop.",
    ],
    accessibility: "The selected wallet uses aria-current, the sheet is a labelled modal dialog, and the original All Wallets button regains focus after closing.",
    files: [
      { id: "motion", label: "Motion", fileName: "use-draggable-sheet.ts", language: "TypeScript", code: DRAGGABLE_SHEET_CORE },
      {
        id: "component",
        label: "Component",
        fileName: "wallet-picker-sheet.tsx",
        language: "TSX",
        code: String.raw`export function WalletPickerSheet({
  wallets,
  activeWallet,
  onSelect,
  onClose,
}: WalletPickerSheetProps) {
  const selectWallet = (walletId: WalletId) => {
    dismissSheet(() => {
      onSelect(walletId);
      onClose();
    });
  };

  return (
    <SheetFrame title="All Wallets" onClose={onClose}>
      <ul className={styles.walletList}>
        {wallets.map((wallet) => (
          <li key={wallet.id}>
            <button
              type="button"
              aria-current={wallet.id === activeWallet ? "true" : undefined}
              onClick={() => selectWallet(wallet.id)}
            >
              <WalletFlag wallet={wallet} />
              <span>{wallet.currency} Wallet</span>
              <small>{wallet.country}</small>
            </button>
          </li>
        ))}
      </ul>
    </SheetFrame>
  );
}`,
      },
      { id: "accessibility", label: "Accessibility", fileName: "sheet-focus.ts", language: "TypeScript", code: SHEET_ACCESSIBILITY },
    ],
  },
  {
    id: "currency-sheet",
    index: "04",
    category: "Bottom sheets",
    title: "Exchange currency sheet",
    shortTitle: "Currency sheet",
    runtime: "React + CSS",
    duration: "0.24s + gesture",
    trigger: "Tap a Send or Receive currency pill on Exchange.",
    overview: "A compact pointer-driven sheet uses CSS keyframes for deterministic opening and closing. Currency selection is queued first, then committed only after the same 240ms exit transition used by the close button, backdrop, Escape key, and swipe dismissal.",
    timeline: [
      { time: "0.00–0.20s", label: "Dim", detail: "The backdrop fades in independently." },
      { time: "0.00–0.24s", label: "Enter", detail: "The currency list translates upward from 100%." },
      { time: "Gesture", label: "Drag", detail: "Positive pointer delta is applied as an inline transform." },
      { time: "Release", label: "Threshold", detail: "Dragging beyond 22% of sheet height closes it." },
      { time: "0.00–0.22s", label: "Snap", detail: "A short transition returns an incomplete drag to zero." },
      { time: "Select", label: "Queue", detail: "The chosen currency is stored without unmounting or updating the screen." },
      { time: "0.00–0.24s", label: "Close", detail: "The selected row follows the same backdrop fade and downward sheet transition." },
      { time: "0.24s", label: "Commit", detail: "The currency updates after the exit completes, then the sheet unmounts." },
    ],
    implementationNotes: [
      "Store the selected currency in a pending ref, start the shared closing state, and commit the value only from finishClose after the exit animation.",
      "Convert screen-space pointer movement using the prototype scale before applying the transform.",
      "Ignore drag starts originating from buttons so currency rows remain reliable.",
      "Use the same finishClose callback for selection, backdrop, close button, Escape, and swipe dismissal so every closing path stays consistent.",
    ],
    accessibility: "The close button receives focus, Escape follows the same animated close path, disabled currencies are native disabled controls, and reduced motion unmounts immediately.",
    files: [
      {
        id: "component",
        label: "Component",
        fileName: "currency-bottom-sheet.tsx",
        language: "TSX",
        code: String.raw`function CurrencyBottomSheet({ onClose, onSelect }: Props) {
  const sheetRef = useRef<HTMLElement>(null);
  const dragRef = useRef({ pointerId: -1, startY: 0, delta: 0 });
  const pendingSelectionRef = useRef<CurrencyCode | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const finishClose = useCallback(() => {
    const pendingSelection = pendingSelectionRef.current;
    pendingSelectionRef.current = null;
    if (pendingSelection) onSelect(pendingSelection);
    onClose();
  }, [onClose, onSelect]);

  const closeSheet = useCallback(() => {
    if (isClosing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishClose();
      return;
    }
    setIsClosing(true);
  }, [finishClose, isClosing]);

  useEffect(() => {
    if (!isClosing) return;
    const timeout = window.setTimeout(finishClose, 240);
    return () => window.clearTimeout(timeout);
  }, [finishClose, isClosing]);

  function startDrag(event: React.PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button")) return;
    dragRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      delta: 0,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    sheetRef.current?.classList.add(styles.dragging);
  }

  function dragSheet(event: React.PointerEvent<HTMLDivElement>) {
    if (dragRef.current.pointerId !== event.pointerId || !sheetRef.current) return;
    const scale = sheetRef.current.getBoundingClientRect().width / 375;
    const delta = Math.max(0, event.clientY - dragRef.current.startY);
    dragRef.current.delta = delta;
    sheetRef.current.style.transform =
      "translateY(" + delta / Math.max(scale, 0.01) + "px)";
  }

  function finishDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (dragRef.current.pointerId !== event.pointerId || !sheetRef.current) return;
    const sheet = sheetRef.current;
    const shouldClose = dragRef.current.delta >
      sheet.getBoundingClientRect().height * 0.22;
    dragRef.current.pointerId = -1;
    sheet.classList.remove(styles.dragging);

    if (shouldClose) closeSheet();
    else {
      sheet.classList.add(styles.snapping);
      sheet.style.transform = "translateY(0)";
    }
  }

  function selectCurrency(currency: CurrencyCode) {
    if (isClosing) return;
    pendingSelectionRef.current = currency;
    closeSheet();
  }

  return <CurrencySheetView {...{ sheetRef, startDrag, dragSheet, finishDrag, closeSheet, selectCurrency, isClosing }} />;
}`,
      },
      {
        id: "selection",
        label: "Selection flow",
        fileName: "currency-selection-flow.tsx",
        language: "TSX",
        code: String.raw`const pendingSelectionRef = useRef<CurrencyCode | null>(null);

// All close paths finish here. A selection is applied only after the
// sheet and backdrop have completed their shared exit transition.
const finishClose = useCallback(() => {
  const pendingSelection = pendingSelectionRef.current;
  pendingSelectionRef.current = null;

  if (pendingSelection) {
    onSelect(pendingSelection);
  }

  onClose();
}, [onClose, onSelect]);

const closeSheet = useCallback(() => {
  if (isClosing) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    finishClose();
    return;
  }

  setIsClosing(true);
}, [finishClose, isClosing]);

useEffect(() => {
  if (!isClosing) return;

  // Matches the sheetOut keyframe duration.
  const timeout = window.setTimeout(finishClose, 240);
  return () => window.clearTimeout(timeout);
}, [finishClose, isClosing]);

function selectCurrency(currency: CurrencyCode) {
  if (isClosing) return;
  pendingSelectionRef.current = currency;
  closeSheet();
}

{currencies.map((currency) => (
  <button
    key={currency}
    type="button"
    disabled={isClosing || currency === disabledCurrency}
    onClick={() => selectCurrency(currency)}
  >
    <CurrencyFlag currency={currency} />
    <strong>{currency}</strong>
  </button>
)}`,
      },
      {
        id: "styles",
        label: "Styles",
        fileName: "currency-bottom-sheet.module.css",
        language: "CSS",
        code: String.raw`.overlay { animation: backdropIn 0.2s ease-out both; }
.sheet { animation: sheetIn 0.24s cubic-bezier(.2, .8, .2, 1) both; }
.dragging { animation: none; }
.snapping { transition: transform 0.22s cubic-bezier(.2, .8, .2, 1); }
.closing { animation: backdropOut 0.22s ease-in both; }
.closing .sheet { animation: sheetOut 0.24s cubic-bezier(.4, 0, 1, 1) both; }

@keyframes sheetIn {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@keyframes sheetOut {
  from { transform: translateY(0); }
  to { transform: translateY(100%); }
}

@keyframes backdropIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes backdropOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .overlay, .sheet, .closing { animation: none; }
  .snapping { transition: none; }
}`,
      },
    ],
  },
  {
    id: "bottom-navigation",
    index: "05",
    category: "Navigation",
    title: "Home and Profile navigation",
    shortTitle: "Home / Profile",
    runtime: "React + GSAP",
    duration: "0.52s",
    trigger: "Tap Home or Profile in the bottom navigation.",
    overview: "The active pill travels between destinations while button widths, labels, icons, and page sections transition on one coordinated GSAP timeline.",
    timeline: [
      { time: "0.00–0.18s", label: "Exit", detail: "Current screen sections fade and shift by 12px." },
      { time: "0.00–0.42s", label: "Morph", detail: "The pill moves while both navigation buttons resize." },
      { time: "0.00–0.20s", label: "Release", detail: "The current label and active icon disappear." },
      { time: "0.12–0.32s", label: "Activate", detail: "The destination label and icon take over." },
      { time: "0.14–0.52s", label: "Enter", detail: "Destination sections appear with a 35ms stagger." },
    ],
    implementationNotes: [
      "Animate numeric left, width, and padding values to create a stable pill morph.",
      "Keep screen layers mounted so interrupted navigation can reverse cleanly.",
      "Pointer events change immediately, preventing interaction with outgoing content.",
    ],
    accessibility: "Buttons expose aria-current=page, hidden screen layers use aria-hidden and inert, and reduced motion updates every state without tweening.",
    files: [
      { id: "motion", label: "Motion", fileName: "change-screen.ts", language: "TypeScript", code: SCREEN_TRANSITION_ENGINE },
      {
        id: "navigation",
        label: "Navigation",
        fileName: "bottom-navigation.tsx",
        language: "TSX",
        code: String.raw`<nav ref={navigationRef} aria-label="App navigation">
  <span ref={navPillRef} className={styles.navPill} aria-hidden="true" />
  <button
    ref={homeNavRef}
    type="button"
    aria-label="Home"
    aria-current={activeScreen === "home" ? "page" : undefined}
    onClick={() => changeScreen("home")}
  >
    <NavIcon active={activeScreen === "home"} name="home" />
    <span ref={homeNavLabelRef}>Home</span>
  </button>
  <button
    ref={profileNavRef}
    type="button"
    aria-label="Profile"
    aria-current={activeScreen === "profile" ? "page" : undefined}
    onClick={() => changeScreen("profile")}
  >
    <NavIcon active={activeScreen === "profile"} name="profile" />
    <span ref={profileNavLabelRef}>Profile</span>
  </button>
</nav>`,
      },
      {
        id: "states",
        label: "Motion states",
        fileName: "navigation-motion.ts",
        language: "TypeScript",
        code: String.raw`const NAV_STATES = {
  home: {
    pillLeft: 12,
    home: { left: 12, width: 89, paddingLeft: 12 },
    profile: { left: 109, width: 24, paddingLeft: 0 },
  },
  profile: {
    pillLeft: 56,
    home: { left: 24, width: 24, paddingLeft: 0 },
    profile: { left: 56, width: 89, paddingLeft: 12 },
  },
} as const;

timeline
  .to(navPill, {
    left: NAV_STATES[nextScreen].pillLeft,
    duration: 0.42,
    ease: "power3.inOut",
  }, 0)
  .to(homeNav, {
    ...NAV_STATES[nextScreen].home,
    duration: 0.42,
    ease: "power3.inOut",
  }, 0)
  .to(profileNav, {
    ...NAV_STATES[nextScreen].profile,
    duration: 0.42,
    ease: "power3.inOut",
  }, 0);`,
      },
    ],
  },
  {
    id: "enter-exchange",
    index: "06",
    category: "Page transitions",
    title: "Enter the Exchange page",
    shortTitle: "Enter Exchange",
    runtime: "React + GSAP",
    duration: "0.52s",
    trigger: "Tap Exchange in the wallet action card.",
    overview: "The home content exits first, Exchange sections enter in reading order, and the bottom navigation fades away so the dedicated back control becomes the navigation anchor.",
    timeline: [
      { time: "0.00s", label: "Commit", detail: "Exchange becomes the active and interactive screen layer." },
      { time: "0.00–0.18s", label: "Exit home", detail: "Home sections fade and travel 12px left." },
      { time: "0.00–0.18s", label: "Hide nav", detail: "Bottom navigation leaves with the outgoing content." },
      { time: "0.14–0.52s", label: "Enter exchange", detail: "Header, cards, details, and action enter with stagger." },
    ],
    implementationNotes: [
      "Tag Exchange sections with data-exchange-content to control entrance order from the DOM.",
      "Keep the screen layer mounted and inert while hidden so local form state survives navigation.",
      "Kill any previous timeline before building the next transition.",
    ],
    accessibility: "The hidden Home layer becomes inert immediately. The Exchange heading and back button remain in normal reading order, and reduced motion performs an atomic visibility update.",
    files: [
      { id: "engine", label: "Transition engine", fileName: "change-screen.ts", language: "TypeScript", code: SCREEN_TRANSITION_ENGINE },
      {
        id: "integration",
        label: "Integration",
        fileName: "home-wallet.tsx",
        language: "TSX",
        code: String.raw`<button type="button" onClick={() => changeScreen("exchange")}>
  <ExchangeIcon aria-hidden="true" />
  <span>
    <strong>Exchange</strong>
    <small>Convert currencies</small>
  </span>
</button>

<ExchangeScreen
  ref={transferScreenRef}
  active={activeScreen === "exchange"}
  onBack={() => changeScreen("home")}
/>

// Inside ExchangeScreen, these markers define the stagger order.
<header data-exchange-content>...</header>
<section data-exchange-content>...</section>
<section data-exchange-content>...</section>
<button data-exchange-content>Next</button>`,
      },
    ],
  },
  {
    id: "return-home",
    index: "07",
    category: "Page transitions",
    title: "Return from Exchange",
    shortTitle: "Return home",
    runtime: "React + GSAP",
    duration: "0.52s",
    trigger: "Tap the back arrow in the Exchange header.",
    overview: "The transition reverses direction, closes any Exchange-owned currency sheet, restores the bottom navigation, and resets the wallet scroll position before Home becomes visible.",
    timeline: [
      { time: "0.00s", label: "Reset", detail: "Currency-sheet state closes and wallet scroll returns to the top." },
      { time: "0.00–0.18s", label: "Exit exchange", detail: "Exchange sections fade and shift to the right." },
      { time: "0.14–0.52s", label: "Restore", detail: "Home sections and bottom navigation return together." },
      { time: "0.52s", label: "Clean", detail: "Temporary transforms and will-change hints are removed." },
    ],
    implementationNotes: [
      "Use the same transition engine with a negative direction instead of maintaining a second reverse animation.",
      "Clear child overlays before changing layers so a sheet cannot remain visually attached to Exchange.",
      "Normalize transform state in onComplete so later navigation always starts from a known baseline.",
    ],
    accessibility: "The back control has an explicit Back to wallet label. Reduced motion restores Home immediately, and the Exchange layer becomes inert before it fades.",
    files: [
      { id: "engine", label: "Transition engine", fileName: "change-screen.ts", language: "TypeScript", code: SCREEN_TRANSITION_ENGINE },
      {
        id: "back",
        label: "Back control",
        fileName: "exchange-header.tsx",
        language: "TSX",
        code: String.raw`function returnHome() {
  setCurrencySheet(null);
  setTransferSheetOpen(false);
  walletScrollRef.current?.scrollTo({
    top: 0,
    behavior: "instant",
  });
  changeScreen("home");
}

<header data-exchange-content>
  <button
    type="button"
    aria-label="Back to wallet"
    onClick={returnHome}
  >
    <ArrowLeftIcon aria-hidden="true" />
  </button>
  <h2>Exchange</h2>
</header>`,
      },
      {
        id: "cleanup",
        label: "Cleanup",
        fileName: "screen-layers.tsx",
        language: "TSX",
        code: String.raw`useLayoutEffect(() => {
  const homeContent = homeRef.current?.querySelectorAll(
    "[data-screen-content]",
  );
  const exchangeContent = exchangeRef.current?.querySelectorAll(
    "[data-exchange-content]",
  );
  if (!homeContent || !exchangeContent) return;

  gsap.set(homeContent, { autoAlpha: 1, x: 0, y: 0 });
  gsap.set(exchangeContent, { autoAlpha: 0, x: 0, y: 10 });

  return () => {
    screenTransitionRef.current?.kill();
    gsap.killTweensOf([...homeContent, ...exchangeContent]);
  };
}, []);`,
      },
    ],
  },
] as const;
