"use client";

import { createPortal } from "react-dom";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { PrototypeIcon } from "@/components/prototype/prototype-icon";
import {
  PROTOTYPE_V1_ANIMATIONS,
  type PrototypeV1AnimationId,
} from "@/content/prototype-v1-animation-source";

type CopyStatus = "idle" | "copied" | "error";

const FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const SOURCE_TOKEN_PATTERN = /(\/\/.*$|\/\*.*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:as|async|await|break|case|class|const|continue|default|else|export|extends|for|from|function|if|import|in|interface|let|new|readonly|return|string|switch|throw|type|typeof|void|while)\b|\b(?:false|null|true|undefined)\b|\b\d+(?:\.\d+)?\b)/g;
const SOURCE_KEYWORD_TOKENS = new Set([
  "as", "async", "await", "break", "case", "class", "const", "continue",
  "default", "else", "export", "extends", "for", "from", "function", "if",
  "import", "in", "interface", "let", "new", "readonly", "return", "string",
  "switch", "throw", "type", "typeof", "void", "while",
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

export function PrototypeV1AnimationSource() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeAnimationId, setActiveAnimationId] = useState<PrototypeV1AnimationId>("country-switch");
  const [activeFileId, setActiveFileId] = useState("component");
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const fileTabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const copyResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const codeDragRef = useRef({
    pointerId: -1,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });

  const activeAnimation = PROTOTYPE_V1_ANIMATIONS.find(
    (animation) => animation.id === activeAnimationId,
  ) ?? PROTOTYPE_V1_ANIMATIONS[0];
  const activeFile = activeAnimation.files.find((file) => file.id === activeFileId)
    ?? activeAnimation.files[0];

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
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
        .filter((element) => !element.hasAttribute("hidden"));
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) {
        event.preventDefault();
        dialog.focus({ preventScroll: true });
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
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

  function selectAnimation(animationId: PrototypeV1AnimationId) {
    const animation = PROTOTYPE_V1_ANIMATIONS.find((item) => item.id === animationId);
    if (!animation) return;
    setActiveAnimationId(animationId);
    setActiveFileId(animation.files[0].id);
    setCopyStatus("idle");
    if (copyResetTimerRef.current) clearTimeout(copyResetTimerRef.current);
  }

  function selectFile(fileId: string, moveFocus = false) {
    setActiveFileId(fileId);
    setCopyStatus("idle");
    if (copyResetTimerRef.current) clearTimeout(copyResetTimerRef.current);
    if (moveFocus) requestAnimationFrame(() => fileTabRefs.current[fileId]?.focus());
  }

  function handleFileTabKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>, fileId: string) {
    const currentIndex = activeAnimation.files.findIndex((file) => file.id === fileId);
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % activeAnimation.files.length;
    if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + activeAnimation.files.length) % activeAnimation.files.length;
    }
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = activeAnimation.files.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    selectFile(activeAnimation.files[nextIndex].id, true);
  }

  async function copyActiveSource() {
    if (copyResetTimerRef.current) clearTimeout(copyResetTimerRef.current);
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(activeFile.code);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
    copyResetTimerRef.current = setTimeout(() => setCopyStatus("idle"), 2200);
  }

  function startCodeDrag(event: ReactPointerEvent<HTMLPreElement>) {
    if (event.button !== 0 || !window.matchMedia("(max-width: 780px)").matches) return;
    const code = event.currentTarget;
    codeDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: code.scrollLeft,
      scrollTop: code.scrollTop,
    };
    code.setPointerCapture(event.pointerId);
    code.classList.add("is-dragging");
  }

  function dragCode(event: ReactPointerEvent<HTMLPreElement>) {
    if (codeDragRef.current.pointerId !== event.pointerId) return;
    event.preventDefault();
    event.currentTarget.scrollLeft = codeDragRef.current.scrollLeft
      - (event.clientX - codeDragRef.current.startX);
    event.currentTarget.scrollTop = codeDragRef.current.scrollTop
      - (event.clientY - codeDragRef.current.startY);
  }

  function finishCodeDrag(event: ReactPointerEvent<HTMLPreElement>) {
    if (codeDragRef.current.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    codeDragRef.current.pointerId = -1;
    event.currentTarget.classList.remove("is-dragging");
  }

  const copyLabel = copyStatus === "copied"
    ? "Copied"
    : copyStatus === "error"
      ? "Copy failed"
      : "Copy code";
  const activeAnimationIndex = PROTOTYPE_V1_ANIMATIONS.findIndex(
    (animation) => animation.id === activeAnimation.id,
  );
  const sourceFileCount = PROTOTYPE_V1_ANIMATIONS.reduce(
    (count, animation) => count + animation.files.length,
    0,
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="prototype-v1-source-trigger"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? "prototype-v1-source-modal" : undefined}
        onClick={() => {
          setCopyStatus("idle");
          setIsOpen(true);
        }}
      >
        <span className="prototype-v1-source-trigger-icon" aria-hidden="true">
          <PrototypeIcon name="code" size={17} />
        </span>
        <span className="prototype-v1-source-trigger-copy">
          <strong>Animation source</strong>
          <span>{PROTOTYPE_V1_ANIMATIONS.length} interactions · {sourceFileCount} source files</span>
        </span>
        <span className="prototype-v1-source-trigger-action" aria-hidden="true">
          <span>View code</span>
          <span>→</span>
        </span>
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
            id="prototype-v1-source-modal"
            className="prototype-source-modal prototype-v1-source-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="prototype-v1-source-title"
            aria-describedby="prototype-v1-source-description"
            tabIndex={-1}
          >
            <header className="prototype-source-modal-header prototype-v1-source-modal-header">
              <div className="prototype-source-modal-heading prototype-v1-source-modal-heading">
                <p>Prototype V1 · Animation {activeAnimationIndex + 1} of {PROTOTYPE_V1_ANIMATIONS.length}</p>
                <h2 id="prototype-v1-source-title">{activeAnimation.title}</h2>
                <p id="prototype-v1-source-description" className="sr-only">
                  Detailed implementation source for seven Prototype V1 animations.
                </p>
              </div>
              <div className="prototype-v1-source-header-actions">
                <button
                  ref={closeRef}
                  type="button"
                  className="prototype-source-modal-close"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close animation source"
                >
                  <PrototypeIcon name="close" size={20} />
                </button>
              </div>
            </header>

            <div className="prototype-source-modal-body prototype-v1-source-modal-body">
              <nav className="prototype-v1-source-catalog" aria-label="Prototype V1 animations">
                <p>Animations</p>
                <div className="prototype-v1-source-catalog-list">
                  {PROTOTYPE_V1_ANIMATIONS.map((animation) => (
                    <button
                      key={animation.id}
                      type="button"
                      className={animation.id === activeAnimation.id ? "is-active" : undefined}
                      aria-current={animation.id === activeAnimation.id ? "true" : undefined}
                      onClick={() => selectAnimation(animation.id)}
                    >
                      <span className="prototype-v1-source-catalog-index">{animation.index}</span>
                      <span className="prototype-v1-source-catalog-copy">
                        <strong>{animation.shortTitle}</strong>
                      </span>
                    </button>
                  ))}
                </div>
              </nav>

              <aside key={activeAnimation.id} className="prototype-source-documentation prototype-v1-source-documentation" aria-label="Animation documentation">
                <dl className="prototype-source-metadata" aria-label="Implementation details">
                  <div><dt>Runtime</dt><dd>{activeAnimation.runtime}</dd></div>
                  <div><dt>Duration</dt><dd>{activeAnimation.duration}</dd></div>
                  <div><dt>Source</dt><dd>{activeAnimation.files.length} files</dd></div>
                </dl>

                <section>
                  <h3>Trigger</h3>
                  <p>{activeAnimation.trigger}</p>
                </section>

                <section>
                  <h3>Overview</h3>
                  <p>{activeAnimation.overview}</p>
                </section>

                <section>
                  <h3>Timeline</h3>
                  <ol className="prototype-source-timeline">
                    {activeAnimation.timeline.map((item, index) => (
                      <li key={`${item.time}-${index}`}>
                        <time>{item.time}</time>
                        <span><strong>{item.label}</strong>{item.detail}</span>
                      </li>
                    ))}
                  </ol>
                </section>

                <section>
                  <h3>Implementation notes</h3>
                  <ul className="prototype-source-checklist">
                    {activeAnimation.implementationNotes.map((note) => <li key={note}>{note}</li>)}
                  </ul>
                  <div className="prototype-source-inline-note">
                    <strong>Accessibility included</strong>
                    <p>{activeAnimation.accessibility}</p>
                  </div>
                </section>
              </aside>

              <section className="prototype-source-workspace prototype-v1-source-workspace" aria-label="Source files">
                <div className="prototype-source-tabs" role="tablist" aria-label={`${activeAnimation.title} source files`}>
                  {activeAnimation.files.map((file) => {
                    const isActive = file.id === activeFile.id;
                    return (
                      <button
                        key={file.id}
                        ref={(node) => { fileTabRefs.current[file.id] = node; }}
                        id={`prototype-v1-file-tab-${activeAnimation.id}-${file.id}`}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={isActive ? `prototype-v1-file-panel-${activeAnimation.id}-${file.id}` : undefined}
                        tabIndex={isActive ? 0 : -1}
                        className={isActive ? "is-active" : undefined}
                        onClick={() => selectFile(file.id)}
                        onKeyDown={(event) => handleFileTabKeyDown(event, file.id)}
                      >
                        {file.label}
                      </button>
                    );
                  })}
                </div>

                <div
                  key={`${activeAnimation.id}-${activeFile.id}`}
                  id={`prototype-v1-file-panel-${activeAnimation.id}-${activeFile.id}`}
                  className="prototype-source-code-panel"
                  role="tabpanel"
                  aria-labelledby={`prototype-v1-file-tab-${activeAnimation.id}-${activeFile.id}`}
                >
                  <div className="prototype-source-code-toolbar">
                    <span>
                      <code>{activeFile.fileName}</code>
                      <small className="prototype-v1-source-language">{activeFile.language}</small>
                    </span>
                    <button
                      type="button"
                      data-status={copyStatus}
                      onClick={copyActiveSource}
                      aria-label={`Copy ${activeFile.fileName}`}
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
                    aria-label={`${activeFile.fileName} source code. Drag to scroll on mobile.`}
                    onPointerDown={startCodeDrag}
                    onPointerMove={dragCode}
                    onPointerUp={finishCodeDrag}
                    onPointerCancel={finishCodeDrag}
                  >
                    <code>
                      {activeFile.code.split("\n").map((line, index) => (
                        <span className="prototype-source-code-line" key={`${activeFile.id}-${index}`}>
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
