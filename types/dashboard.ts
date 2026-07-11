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
  | "themeSummary";

export type ShowcaseImagePath = `/assets/sample-0${1 | 2 | 3 | 4 | 5}.png`;
export type ShowcaseSampleId = `sample-0${1 | 2 | 3 | 4 | 5}`;
export type ShowcaseSampleLabel = `Sample 0${1 | 2 | 3 | 4 | 5}`;
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

export interface ThemeColor {
  readonly hex: ThemeColorHex;
  readonly name: ThemeColorName;
  readonly value: ThemeColorValue;
}

export interface DashboardTheme {
  readonly label: "Theme 01";
  readonly name: "Blue Gem";
  readonly summary: string;
}
