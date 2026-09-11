export type V1WalletId = "php" | "hkd" | "sgd" | "sar";
export type V1WorkCountry = "Hong Kong" | "Singapore" | "Saudi Arabia";

interface V1Wallet {
  readonly id: V1WalletId;
  readonly country: "Philippines" | V1WorkCountry;
  readonly currency: string;
  readonly name: string;
  readonly symbol: string;
  readonly flag: string;
  readonly receivingBank: string | null;
}

export const V1_WALLETS = {
  php: { id: "php", country: "Philippines", currency: "PHP", name: "Philippine Peso", symbol: "₱", flag: "flag-ph.svg", receivingBank: "AUB" },
  hkd: { id: "hkd", country: "Hong Kong", currency: "HKD", name: "Hong Kong Dollar", symbol: "HK$", flag: "flag-hong-kong.svg", receivingBank: "DBS" },
  sgd: { id: "sgd", country: "Singapore", currency: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "flag-singapore.svg", receivingBank: null },
  // The dollar prefix matches the supplied SAR wallet design.
  sar: { id: "sar", country: "Saudi Arabia", currency: "SAR", name: "Saudi Riyal", symbol: "$", flag: "flag-saudi-arabia.svg", receivingBank: null },
} as const satisfies Record<V1WalletId, V1Wallet>;

export const V1_WORK_WALLETS = [V1_WALLETS.hkd, V1_WALLETS.sgd, V1_WALLETS.sar];

export const V1_WORK_ARTWORK = {
  "Hong Kong": { pill: "country-pill-hk-selected.svg", pillWidth: 129, transition: "/assets/prototype-figma/work-location-hongkong-loading.png" },
  Singapore: { pill: "country-pill-sg-selected.svg", pillWidth: 125, transition: "/assets/prototype-v1/transition-singapore.png" },
  "Saudi Arabia": { pill: "country-pill-sa-selected.svg", pillWidth: 139, transition: "/assets/prototype-v1/transition-saudi-arabia.png" },
} as const;
