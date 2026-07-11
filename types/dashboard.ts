export type DashboardSectionId = "overview" | "showcase" | "brand";
export type DashboardStatisticId = "samples" | "colors" | "direction";

export type DashboardIconName =
  | "solar:arrow-left-linear"
  | "solar:arrow-right-linear"
  | "solar:close-circle-linear"
  | "solar:hamburger-menu-linear"
  | "solar:layers-minimalistic-linear"
  | "solar:lightbulb-bolt-linear"
  | "solar:menu-dots-bold"
  | "solar:magnifer-zoom-in-linear"
  | "solar:magnifer-zoom-out-linear"
  | "solar:palette-linear"
  | "solar:smartphone-2-linear"
  | "solar:smartphone-linear"
  | "solar:stars-minimalistic-bold"
  | "solar:widget-5-linear";

export type DashboardIconKey =
  | "closeMenu"
  | "ctaArrow"
  | "directionStatistic"
  | "moreOptions"
  | "openMenu"
  | "overviewBadge"
  | "overviewNavigation"
  | "palette"
  | "previousSample"
  | "sampleStatistic"
  | "showcaseNavigation"
  | "themeSummary"
  | "zoomIn"
  | "zoomOut";

export type ShowcaseImagePath = `/assets/${string}.png`;
export type ShowcaseSampleId = string;
export type ShowcaseSampleLabel = string;
export type ThemeColorName = "Blue Gem" | "Brick Red";
export type ThemeColorHex = "#381C8D" | "#BA3245";
export type ThemeColorValue = "#381c8d" | "#ba3245";

export interface NavigationItem {
  readonly id: DashboardSectionId;
  readonly label: string;
  readonly href: `#${DashboardSectionId}`;
  readonly icon: DashboardIconName;
}

export interface DashboardStatistic {
  readonly id: DashboardStatisticId;
  readonly icon: DashboardIconName;
  readonly value: string;
  readonly label: string;
}

export interface ShowcaseSample {
  readonly id: ShowcaseSampleId;
  readonly image: ShowcaseImagePath;
  readonly label: ShowcaseSampleLabel;
  readonly title: string;
  readonly description: string;
  readonly tags: readonly string[];
}

export interface ShowcaseTheme {
  readonly id: "theme-01" | "theme-02" | "theme-03";
  readonly label: "Theme 01" | "Theme 02" | "Theme 03";
  readonly name: string;
  readonly summary: string;
  readonly samples: readonly ShowcaseSample[];
}

export interface ThemeColor {
  readonly hex: ThemeColorHex;
  readonly name: ThemeColorName;
  readonly value: ThemeColorValue;
}

export interface DashboardTheme {
  readonly label: string;
  readonly name: string;
  readonly summary: string;
}
