import Image from "next/image";
import styles from "./prototype-v1-profile.module.css";

const PROFILE_ASSETS = "/assets/prototype-v1/profile";

function ProfileAsset({ name, width, height = width }: {
  readonly name: string;
  readonly width: number;
  readonly height?: number;
}) {
  return <Image src={`${PROFILE_ASSETS}/${name}.svg`} alt="" width={width} height={height} unoptimized />;
}

const menuGroups = [
  [
    { label: "Orders", icon: "orders", composite: true },
    { label: "Payment activity", icon: "payment", composite: true },
  ],
  [
    { label: "Wallets", icon: "wallets", composite: true },
    { label: "Receiving accounts", icon: "receiving", composite: false },
  ],
  [
    { label: "Help Center", icon: "help", composite: false },
    { label: "Legal & Policies", icon: "legal", composite: false },
  ],
] as const;

export function PrototypeV1Profile({ onPreview }: {
  readonly onPreview: (label: string) => void;
}) {
  return (
    <div className={styles.screen} aria-label="Profile">
      <header className={styles.header} data-screen-content>
        <h2>Profile</h2>
        <button type="button" className={styles.settings} aria-label="Settings" onClick={() => onPreview("Settings")}>
          <ProfileAsset name="settings" width={21} height={22} />
        </button>
      </header>

      <section className={styles.identityCard} aria-label="Your profile and verification" data-screen-content>
        <button type="button" className={styles.identityRow} onClick={() => onPreview("Personal information")}>
          <ProfileAsset name="avatar" width={60} height={60} />
          <span className={styles.identityCopy}><strong>YC</strong><span>+63 95******86</span></span>
          <span className={styles.rowChevron}><ProfileAsset name="chevron" width={16} /></span>
        </button>
        <button type="button" className={styles.verification} onClick={() => onPreview("Identity verification")}>
          <span className={styles.verificationIcon}><ProfileAsset name="verification" width={16} height={20} /></span>
          <span className={styles.verificationCopy}><strong>Not Verified</strong><span>Complete identity verification to<br /> access more services.</span></span>
          <span className={styles.rowChevron}><ProfileAsset name="chevron" width={16} /></span>
        </button>
      </section>

      <div className={styles.menus}>
        {menuGroups.map((group, groupIndex) => (
          <section className={styles.menuCard} key={groupIndex} aria-label={["Activity", "Accounts", "Support"][groupIndex]} data-screen-content>
            {group.map((item) => (
              <button type="button" className={styles.menuRow} key={item.label} onClick={() => onPreview(item.label)}>
                <span className={styles.menuIcon}>
                  {item.composite ? <ProfileAsset name={item.icon} width={40} height={40} /> : <>
                    <ProfileAsset name={`${item.icon}-circle`} width={40} height={40} />
                    <span className={styles.menuGlyph}><ProfileAsset name={`${item.icon}-icon`} width={item.icon === "legal" ? 21 : 20} height={item.icon === "legal" ? 23 : 20} /></span>
                  </>}
                </span>
                <span className={styles.menuLabel}>{item.label}</span>
                <span className={styles.menuChevron}><ProfileAsset name="chevron" width={16} /></span>
              </button>
            ))}
          </section>
        ))}
      </div>

    </div>
  );
}
