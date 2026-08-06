import type {
  DashboardIconKey,
  DashboardIconName,
  DashboardStatistic,
  DashboardTheme,
  NavigationItem,
  ShowcaseSample,
  ShowcaseTheme,
  ThemeColor,
} from "@/types/dashboard";

export const DASHBOARD_ICONS = {
  closeMenu: "solar:close-circle-linear",
  ctaArrow: "solar:arrow-right-linear",
  directionStatistic: "solar:layers-minimalistic-linear",
  moreOptions: "solar:menu-dots-bold",
  openMenu: "solar:hamburger-menu-linear",
  overviewBadge: "solar:stars-minimalistic-bold",
  overviewNavigation: "solar:widget-5-linear",
  palette: "solar:palette-linear",
  previousSample: "solar:arrow-left-linear",
  prototypeNavigation: "solar:smartphone-2-linear",
  revisionsNavigation: "solar:clipboard-check-linear",
  sampleStatistic: "solar:smartphone-2-linear",
  showcaseNavigation: "solar:smartphone-linear",
  themeSummary: "solar:lightbulb-bolt-linear",
  zoomIn: "solar:magnifer-zoom-in-linear",
  zoomOut: "solar:magnifer-zoom-out-linear",
} as const satisfies Readonly<Record<DashboardIconKey, DashboardIconName>>;

export const DASHBOARD_THEME = {
  label: "3 Themes",
  name: "3 Homepage UI Themes for Review",
  summary: "Inspired by Payso’s brand colors and the Philippine flag.",
} as const satisfies DashboardTheme;

export const NAVIGATION_ITEMS = [
  {
    id: "overview",
    label: "Overview",
    href: "/#overview",
    icon: DASHBOARD_ICONS.overviewNavigation,
  },
  {
    id: "showcase",
    label: "UI Showcase",
    href: "/#showcase",
    icon: DASHBOARD_ICONS.showcaseNavigation,
  },
  {
    id: "brand",
    label: "Brand System",
    href: "/#brand",
    icon: DASHBOARD_ICONS.palette,
  },
  {
    id: "refinements",
    label: "Refinements",
    href: "/refinements",
    icon: DASHBOARD_ICONS.revisionsNavigation,
  },
  {
    id: "prototype",
    label: "Prototype",
    href: "/prototype",
    icon: DASHBOARD_ICONS.prototypeNavigation,
  },
] as const satisfies readonly NavigationItem[];

export const DASHBOARD_STATISTICS = [
  {
    id: "samples",
    icon: DASHBOARD_ICONS.sampleStatistic,
    value: "18",
    label: "Interface samples",
  },
  {
    id: "colors",
    icon: DASHBOARD_ICONS.palette,
    value: "2",
    label: "Brand colors",
  },
  {
    id: "direction",
    icon: DASHBOARD_ICONS.directionStatistic,
    value: "3",
    label: "Design themes",
  },
] as const satisfies readonly DashboardStatistic[];

export const SHOWCASE_SAMPLES = [
  {
    id: "sample-01",
    image: "/assets/sample-01.png",
    label: "Sample 01",
    title: "Bold Active Navigation",
    description: "Use Blue Gem for the active bottom navigation. Notifications include a headline and subheadline 'New update available', open when tapped, close using the icon, and swipe left or right to dismiss. The top navigation displays the user’s Philippine account 2 letter country code tab button and includes a country dropdown for switching to Hong Kong, Singapore, and other locations account.",
    tags: ["Contained active tab", "Two-line actions", "Color status icons"],
  },
  {
    id: "sample-02",
    image: "/assets/sample-02.png",
    label: "Sample 02",
    title: "Minimal Navigation",
    description: "A lighter bottom navigation treatment with less visual weight and remove the headline for notification 'We've improve your app for better user experience.'",
    tags: ["Minimal active tab", "Two-line actions", "Color status icons"],
  },
  {
    id: "sample-03",
    image: "/assets/sample-03.png",
    label: "Sample 03",
    title: "Soft Tile Navigation",
    description: "A softer selected active state bottom navigation.",
    tags: ["Soft active tile", "Single-line actions", "Color status icons"],
  },
  {
    id: "sample-04",
    image: "/assets/sample-04.png",
    label: "Sample 04",
    title: "Structured Message Header",
    description: "Remove the background from the “Latest Messages” header, use a white background with a divider line for visual consistency, and simplify the Transfer and Exchange buttons with short text and  icons only.",
    tags: ["Soft active tile", "Single-line actions", "Section divider"],
  },
  {
    id: "sample-05",
    image: "/assets/sample-05.png",
    label: "Sample 05",
    title: "Top Tab Direction",
    description: "Country selection appears as a top tab with an active color and underline. The active bottom navigation item also uses a top underline. Latest messages section use a monochrome Blue Gem color icon.",
    tags: ["Top tab selector", "Neutral actions", "Monochrome icons"],
  },
] as const satisfies readonly ShowcaseSample[];

export const THEME_02_SAMPLES = [
  {
    id: "theme-02-sample-01",
    image: "/assets/theme-02/iPhone 13 mini - 410.png",
    label: "Sample 01",
    title: "Top Tab Direction",
    description: "Country selection appears as a top tab with an active color and underline. The active bottom navigation item also uses a top underline. Latest messages section use a monochrome Brick red color icon.",
    tags: ["Top tab selector", "Rose accent", "Neutral actions"],
  },
  {
    id: "theme-02-sample-02",
    image: "/assets/theme-02/iPhone 13 mini - 411.png",
    label: "Sample 02",
    title: "Bold Active Navigation",
    description: "Use Brick red for the active bottom navigation. Notifications include a headline and subheadline 'New update available', open when tapped, close using the icon, and swipe left or right to dismiss. The top navigation displays the user’s Philippine account 2 letter country code tab button and includes a country dropdown for switching to Hong Kong, Singapore, and other locations account.",
    tags: ["Contained active tab", "Primary transfer", "Two-line actions"],
  },
  {
    id: "theme-02-sample-03",
    image: "/assets/theme-02/iPhone 13 mini - 412.png",
    label: "Sample 03",
    title: "Minimal Home Navigation",
    description: "A compact country selector and shortened update message keep the header light while the Home state remains minimal.",
    tags: ["Compact selector", "Minimal navigation", "Rose wallet"],
  },
  {
    id: "theme-02-sample-04",
    image: "/assets/theme-02/iPhone 13 mini - 413.png",
    label: "Sample 04",
    title: "Soft Home Tile",
    description: "A soft rose tile gives Home more presence while preserving the same wallet hierarchy and paired actions.",
    tags: ["Soft active tile", "Balanced actions", "Rose accent"],
  },
  {
    id: "theme-02-sample-05",
    image: "/assets/theme-02/iPhone 13 mini - 414.png",
    label: "Sample 05",
    title: "Compact Action Labels",
    description: "Shorter Transfer and Exchange labels reduce visual weight while the selected Home treatment stays clear.",
    tags: ["Compact labels", "Soft navigation", "Focused actions"],
  },
  {
    id: "theme-02-sample-06",
    image: "/assets/theme-02/iPhone 13 mini - 415.png",
    label: "Sample 06",
    title: "Soft gray background for latest messages header",
    description: "A soft gray header creates clearer separation for Latest Messages.",
    tags: ["Primary action", "Secondary action", "Two-line content"],
  },
  {
    id: "theme-02-sample-07",
    image: "/assets/theme-02/iPhone 13 mini - 417.png",
    label: "Sample 07",
    title: "Brighter Wallet Card",
    description: "A brighter red wallet card increases energy while keeping the surrounding rose interface soft and familiar.",
    tags: ["Bright wallet", "Rose system", "Color contrast"],
  },
  {
    id: "theme-02-sample-08",
    image: "/assets/theme-02/iPhone 13 mini - 425.png",
    label: "Sample 08",
    title: "Less shadow in soft pink buttons",
    description: "Softer shadows keep the pink buttons clean and lightweight.",
    tags: ["Refined controls", "Calm surfaces", "Rose navigation"],
  },
] as const satisfies readonly ShowcaseSample[];

export const THEME_03_SAMPLES = [
  {
    id: "theme-03-sample-01",
    image: "/assets/theme-03/1.png",
    label: "Sample 01",
    title: "Philippine Flag Card",
    description: "A Philippine-inspired card with a clear balance, subtle local accents, and an underlined active country tab from top navigation",
    tags: ["Flag card", "Local accents", "Clear hierarchy"],
  },
  {
    id: "theme-03-sample-02",
    image: "/assets/theme-03/2.png",
    label: "Sample 02",
    title: "Soft Tile Navigation.",
    description: "A softer selected active state bottom navigation. The top navigation displays the user’s Philippine account 2 letter country code tab button and includes a country dropdown for switching to Hong Kong, Singapore, and other locations account.",
    tags: ["Primary action", "Warm accents", "Focused labels"],
  },
  {
    id: "theme-03-sample-03",
    image: "/assets/theme-03/3.png",
    label: "Sample 03",
    title: "Top Navigation Tab Country Switch",
    description: "Card switched to Hong Kong when selected country account is Hong Kong",
    tags: ["Top tab", "Lifted Home", "Local language"],
  },
  {
    id: "theme-03-sample-04",
    image: "/assets/theme-03/4.png",
    label: "Sample 04",
    title: "Top Navigation Tab Country Switch",
    description: "Card switched to Singapore when selected country account is Singapore",
    tags: ["Soft tile", "Balanced actions", "Rounded visuals"],
  },
  {
    id: "theme-03-sample-05",
    image: "/assets/theme-03/5.png",
    label: "Sample 05",
    title: "Top Navigation Tab Country Switch",
    description: "Card switched to Saudi Arabia when selected country account is Saudi Arabia",
    tags: ["Compact", "Two-line", "Light header"],
  },
] as const satisfies readonly ShowcaseSample[];

export const SHOWCASE_THEMES = [
  {
    id: "theme-01",
    label: "Theme 01",
    name: "Blue Gem",
    summary: "Five Blue Gem interface directions.",
    samples: SHOWCASE_SAMPLES,
  },
  {
    id: "theme-02",
    label: "Theme 02",
    name: "Brick Red",
    summary: "Eight rose-led interface directions.",
    samples: THEME_02_SAMPLES,
  },
  {
    id: "theme-03",
    label: "Theme 03",
    name: "Country Card Theme",
    summary: "Five Philippine-themed interface directions.",
    samples: THEME_03_SAMPLES,
  },
] as const satisfies readonly ShowcaseTheme[];

export const THEME_COLORS = [
  {
    hex: "#381C8D",
    name: "Blue Gem",
    value: "#381c8d",
  },
  {
    hex: "#BA3245",
    name: "Brick Red",
    value: "#ba3245",
  },
] as const satisfies readonly ThemeColor[];
