"use client";

import { type KeyboardEvent, useState } from "react";
import { Icon } from "@iconify/react";
import { PrototypeIcon, type PrototypeIconName } from "@/components/prototype/prototype-icon";
import { PrototypeV1AnimationSource } from "./prototype-v1-animation-source";
import styles from "./prototype-v1-page.module.css";

type ExperienceTab = "guide" | "motion";

const TABS: readonly ExperienceTab[] = ["guide", "motion"];

const JOURNEY_STEPS: readonly {
  readonly icon: PrototypeIconName | "country";
  readonly title: string;
}[] = [
  { icon: "country", title: "Choose a country" },
  { icon: "wallet", title: "Switch wallets" },
  { icon: "exchange", title: "Exchange currency" },
  { icon: "check", title: "Open your profile" },
] as const;

export function PrototypeV1ExperiencePanel() {
  const [activeTab, setActiveTab] = useState<ExperienceTab>("guide");

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, currentTab: ExperienceTab) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const currentIndex = TABS.indexOf(currentTab);
    const nextTab = TABS[(currentIndex + direction + TABS.length) % TABS.length];
    setActiveTab(nextTab);
    requestAnimationFrame(() => document.getElementById(`prototype-v1-tab-${nextTab}`)?.focus());
  }

  return (
    <aside className={styles.experiencePanel} aria-label="Prototype V1 guide and motion documentation">
      <div className={styles.experienceTabs} role="tablist" aria-label="Prototype V1 information">
        <button
          id="prototype-v1-tab-guide"
          type="button"
          role="tab"
          aria-selected={activeTab === "guide"}
          aria-controls="prototype-v1-panel-guide"
          tabIndex={activeTab === "guide" ? 0 : -1}
          className={activeTab === "guide" ? styles.experienceTabActive : undefined}
          onClick={() => setActiveTab("guide")}
          onKeyDown={(event) => handleTabKeyDown(event, "guide")}
        >
          <PrototypeIcon name="sparkles" size={17} />
          Guide
        </button>
        <button
          id="prototype-v1-tab-motion"
          type="button"
          role="tab"
          aria-selected={activeTab === "motion"}
          aria-controls="prototype-v1-panel-motion"
          tabIndex={activeTab === "motion" ? 0 : -1}
          className={activeTab === "motion" ? styles.experienceTabActive : undefined}
          onClick={() => setActiveTab("motion")}
          onKeyDown={(event) => handleTabKeyDown(event, "motion")}
        >
          <PrototypeIcon name="play-circle" size={17} />
          Motion
        </button>
      </div>

      {activeTab === "guide" ? (
        <div
          id="prototype-v1-panel-guide"
          className={styles.experiencePanelBody}
          role="tabpanel"
          aria-labelledby="prototype-v1-tab-guide"
        >
          <div className={styles.experiencePanelHeading}>
            <div>
              <h2>Try the main flows</h2>
              <p>Four quick interactions.</p>
            </div>
            <span>Interactive</span>
          </div>

          <ol className={styles.journeyList}>
            {JOURNEY_STEPS.map((step, index) => (
              <li key={step.title}>
                <span className={styles.journeyIcon} aria-hidden="true">
                  {step.icon === "country"
                    ? <Icon icon="solar:global-linear" width="19" height="19" />
                    : <PrototypeIcon name={step.icon} size={18} />}
                </span>
                <span className={styles.journeyCopy}>
                  <strong>{step.title}</strong>
                </span>
                <span className={styles.journeyIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <div
          id="prototype-v1-panel-motion"
          className={styles.experiencePanelBody}
          role="tabpanel"
          aria-labelledby="prototype-v1-tab-motion"
        >
          <div className={styles.experiencePanelHeading}>
            <div>
              <h2>Animation source</h2>
              <p>See how each transition works.</p>
            </div>
            <span>7 interactions</span>
          </div>

          <div className={styles.motionSource}>
            <PrototypeV1AnimationSource />
          </div>
        </div>
      )}
    </aside>
  );
}
