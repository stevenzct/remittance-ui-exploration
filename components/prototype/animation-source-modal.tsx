"use client";

import { createPortal } from "react-dom";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { PrototypeIcon } from "@/components/prototype/prototype-icon";
import {
  ANIMATION_01_SOURCE_TABS,
  ANIMATION_01_TIMELINE,
  type AnimationSourceTabId,
} from "@/content/animation-source";

type CopyStatus = "idle" | "copied" | "error";

const FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const SOURCE_TOKEN_PATTERN = /(\/\/.*$|\/\*.*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:as|const|else|export|from|function|if|import|interface|new|readonly|return|string|type|typeof|void)\b|\b(?:false|null|true|undefined)\b|\b\d+(?:\.\d+)?\b)/g;
const SOURCE_KEYWORD_TOKENS = new Set([
  "as", "const", "else", "export", "from", "function", "if", "import", "interface",
  "new", "readonly", "return", "string", "type", "typeof", "void",
]);
const SOURCE_LITERAL_TOKENS = new Set(["false", "null", "true", "undefined"]);

function sourceTokenClassName(token: string) {
  if (token.startsWith("//") || token.startsWith("/*")) return "is-comment";
  if (token.startsWith('"') || token.startsWith("'")) return "is-string";
  if (/^\d/.test(token)) return "is-number";
  if (SOURCE_LITERAL_TOKENS.has(token)) return "is-literal";
  if (SOURCE_KEYWORD_TOKENS.has(token)) return "is-keyword";
  return null;
}

function highlightSourceLine(line: string) {
  return line.split(SOURCE_TOKEN_PATTERN).filter(Boolean).map((token, index) => {
    const className = sourceTokenClassName(token);
    if (!className) return token;

    return (
      <span className={className} key={`${token}-${index}`}>
        {token}
      </span>
    );
  });
}

export function AnimationSourceModal() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTabId, setActiveTabId] = useState<AnimationSourceTabId>("component");
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const tabRefs = useRef<Partial<Record<AnimationSourceTabId, HTMLButtonElement | null>>>({});
  const copyResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeSource = ANIMATION_01_SOURCE_TABS.find((source) => source.id === activeTabId)
    ?? ANIMATION_01_SOURCE_TABS[0];

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    const focusFrame = requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true }));

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusableElements = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
        .filter((element) => !element.hasAttribute("hidden"));
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (!firstElement || !lastElement) {
        event.preventDefault();
        dialog.focus({ preventScroll: true });
      } else if (!dialog.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? lastElement : firstElement).focus({ preventScroll: true });
      } else if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus({ preventScroll: true });
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus({ preventScroll: true });
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      requestAnimationFrame(() => trigger?.focus({ preventScroll: true }));
    };
  }, [isOpen]);

  useEffect(() => () => {
    if (copyResetTimerRef.current) clearTimeout(copyResetTimerRef.current);
  }, []);

  const selectSourceTab = (nextTabId: AnimationSourceTabId, moveFocus = false) => {
    setActiveTabId(nextTabId);
    setCopyStatus("idle");

    if (copyResetTimerRef.current) clearTimeout(copyResetTimerRef.current);
    if (moveFocus) requestAnimationFrame(() => tabRefs.current[nextTabId]?.focus());
  };

  const handleSourceTabKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    currentTabId: AnimationSourceTabId,
  ) => {
    const currentIndex = ANIMATION_01_SOURCE_TABS.findIndex((source) => source.id === currentTabId);
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % ANIMATION_01_SOURCE_TABS.length;
    if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + ANIMATION_01_SOURCE_TABS.length) % ANIMATION_01_SOURCE_TABS.length;
    }
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = ANIMATION_01_SOURCE_TABS.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    selectSourceTab(ANIMATION_01_SOURCE_TABS[nextIndex].id, true);
  };

  const copyActiveSource = async () => {
    if (copyResetTimerRef.current) clearTimeout(copyResetTimerRef.current);

    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(activeSource.code);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }

    copyResetTimerRef.current = setTimeout(() => setCopyStatus("idle"), 2200);
  };

  const copyLabel = copyStatus === "copied"
    ? t("Copied")
    : copyStatus === "error"
      ? t("Copy failed")
      : t("Copy code");

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="prototype-motion-source-button"
        onClick={() => {
          setCopyStatus("idle");
          setIsOpen(true);
        }}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? "animation-source-modal" : undefined}
        aria-label={t("Open source code for Animation 1")}
      >
        <PrototypeIcon name="code" size={17} />
        {t("Source code")}
      </button>

      {isOpen && createPortal(
        <div
          className="prototype-source-modal-overlay"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setIsOpen(false);
          }}
        >
          <div
            ref={dialogRef}
            id="animation-source-modal"
            className="prototype-source-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="animation-source-modal-title"
            aria-describedby="animation-source-modal-description"
            tabIndex={-1}
          >
            <header className="prototype-source-modal-header">
              <div className="prototype-source-modal-heading">
                <div>
                  <p>{t("Country transition")}</p>
                  <h2 id="animation-source-modal-title">
                    {t("Animation 1")} <span aria-hidden="true">—</span> {t("Takeoff arc")}
                  </h2>
                  <p id="animation-source-modal-description" className="sr-only">
                    {t("The production React and GSAP implementation for the country transition.")}
                  </p>
                </div>
              </div>

              <button
                ref={closeRef}
                type="button"
                className="prototype-source-modal-close"
                onClick={() => setIsOpen(false)}
                aria-label={t("Close source code")}
              >
                <PrototypeIcon name="close" size={20} />
              </button>
            </header>

            <div className="prototype-source-modal-body">
              <aside className="prototype-source-documentation" aria-label={t("Animation documentation")}>
                <dl className="prototype-source-metadata" aria-label={t("Implementation details")}>
                  <div><dt>{t("Runtime")}</dt><dd>React + GSAP</dd></div>
                  <div><dt>{t("Duration")}</dt><dd>1.16s</dd></div>
                  <div><dt>{t("Motion")}</dt><dd>{t("Reduced motion")}</dd></div>
                </dl>

                <section>
                  <h3>{t("Overview")}</h3>
                  <p>
                    {t("The artwork enters on a shallow 3D arc, overshoots the destination, settles, then reveals the updated wallet underneath.")}
                  </p>
                </section>

                <section>
                  <h3>{t("Timeline")}</h3>
                  <ol className="prototype-source-timeline">
                    {ANIMATION_01_TIMELINE.map((item) => (
                      <li key={item.time}>
                        <time>{item.time}</time>
                        <span><strong>{t(item.label)}</strong>{t(item.detail)}</span>
                      </li>
                    ))}
                  </ol>
                </section>

                <section>
                  <h3>{t("Setup")}</h3>
                  <ul className="prototype-source-checklist">
                    <li>{t("Install GSAP with npm install gsap.")}</li>
                    <li>{t("Copy both destination artwork files into the public assets folder.")}</li>
                    <li>{t("Keep the loader inside an inline-size query container because its transforms use cqw units.")}</li>
                    <li>{t("Commit the new country state in the onComplete callback.")}</li>
                  </ul>
                  <div className="prototype-source-inline-note">
                    <strong>{t("Accessibility included")}</strong>
                    <p>{t("The loader announces the destination, honors reduced motion, cleans up every tween, and returns control only after the reveal is complete.")}</p>
                  </div>
                </section>

                <section>
                  <h3>{t("Assets")}</h3>
                  <div className="prototype-source-assets">
                    <code>work-location-philippines-loading.png</code>
                    <span>1448 × 1086</span>
                    <code>work-location-hongkong-loading.png</code>
                    <span>1450 × 1085</span>
                  </div>
                </section>
              </aside>

              <section className="prototype-source-workspace" aria-label={t("Source files")}>
                <div
                  className="prototype-source-tabs"
                  role="tablist"
                  aria-label={t("Animation 1 source files")}
                >
                  {ANIMATION_01_SOURCE_TABS.map((source) => {
                    const isActive = source.id === activeTabId;
                    return (
                      <button
                        key={source.id}
                        ref={(node) => { tabRefs.current[source.id] = node; }}
                        id={`animation-source-tab-${source.id}`}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={isActive ? `animation-source-panel-${source.id}` : undefined}
                        tabIndex={isActive ? 0 : -1}
                        className={isActive ? "is-active" : undefined}
                        onClick={() => selectSourceTab(source.id)}
                        onKeyDown={(event) => handleSourceTabKeyDown(event, source.id)}
                      >
                        {t(source.label)}
                      </button>
                    );
                  })}
                </div>

                <div
                  key={activeSource.id}
                  id={`animation-source-panel-${activeSource.id}`}
                  className="prototype-source-code-panel"
                  role="tabpanel"
                  aria-labelledby={`animation-source-tab-${activeSource.id}`}
                >
                  <div className="prototype-source-code-toolbar">
                    <span>
                      <code>{activeSource.fileName}</code>
                    </span>
                    <button
                      type="button"
                      onClick={copyActiveSource}
                      aria-label={`${t("Copy")} ${activeSource.fileName}`}
                    >
                      <PrototypeIcon name={copyStatus === "copied" ? "check" : "copy"} size={15} />
                      <span>{copyLabel}</span>
                    </button>
                    <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                      {copyStatus === "idle" ? "" : copyLabel}
                    </span>
                  </div>

                  <pre
                    className="prototype-source-code"
                    tabIndex={0}
                    aria-label={`${activeSource.fileName} ${t("source code")}`}
                  >
                    <code>
                      {activeSource.code.split("\n").map((line, index) => (
                        <span className="prototype-source-code-line" key={`${activeSource.id}-${index}`}>
                          <span className="prototype-source-code-line-number" aria-hidden="true">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span>{line ? highlightSourceLine(line) : " "}</span>
                        </span>
                      ))}
                    </code>
                  </pre>
                </div>
              </section>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
