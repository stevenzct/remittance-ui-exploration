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
  sampleStatistic: "solar:smartphone-2-linear",
  showcaseNavigation: "solar:smartphone-linear",
  themeSummary: "solar:lightbulb-bolt-linear",
  zoomIn: "solar:magnifer-zoom-in-linear",
  zoomOut: "solar:magnifer-zoom-out-linear",
} as const satisfies Readonly<Record<DashboardIconKey, DashboardIconName>>;

export const DASHBOARD_THEME = {
  label: "3 Themes",
  name: "Blue Gem + Rose + Philippine",
  summary: "Eighteen interface directions across three Payso remittance themes.",
} as const satisfies DashboardTheme;

export const NAVIGATION_ITEMS = [
  {
    id: "overview",
    label: "Overview",
    href: "#overview",
    icon: DASHBOARD_ICONS.overviewNavigation,
  },
  {
    id: "showcase",
    label: "UI Showcase",
    href: "#showcase",
    icon: DASHBOARD_ICONS.showcaseNavigation,
  },
  {
    id: "brand",
    label: "Brand System",
    href: "#brand",
    icon: DASHBOARD_ICONS.palette,
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
    description: "Use Blue Gem for the active bottom navigation. Notifications include a headline and subheadline 'New update available', open when tapped, close using the icon, and swipe left or right to dismiss. The top navigation displays the user’s Philippine account and includes a country dropdown for switching to Hong Kong, Singapore, and other locations account.",
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
    title: "Top Tab Country Direction",
    description: "Rose accents introduce a top country tab, a two-line update message, neutral wallet actions, and a lightweight active Home state.",
    tags: ["Top tab selector", "Rose accent", "Neutral actions"],
  },
  {
    id: "theme-02-sample-02",
    image: "/assets/theme-02/iPhone 13 mini - 411.png",
    label: "Sample 02",
    title: "Contained Home Navigation",
    description: "A stronger contained Home state pairs with the rose wallet treatment and a prominent Transfer action.",
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
    title: "Balanced Rose Actions",
    description: "The solid Transfer action and quieter Exchange action create a clear primary-secondary relationship.",
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
    title: "Refined Wallet Controls",
    description: "Refined wallet controls and action styling complete the rose-led direction with a calmer supporting surface.",
    tags: ["Refined controls", "Calm surfaces", "Rose navigation"],
  },
] as const satisfies readonly ShowcaseSample[];

export const THEME_03_SAMPLES = [
  {
    id: "theme-03-sample-01",
    image: "/assets/theme-03/1.png",
    label: "Sample 01",
    title: "Philippine Flag Card",
    description: "A bold Philippine-led card with a clear balance and local accents.",
    tags: ["Flag motif", "Local accents", "Clear hierarchy"],
  },
  {
    id: "theme-03-sample-02",
    image: "/assets/theme-03/2.png",
    label: "Sample 02",
    title: "Bright Wallet Actions",
    description: "Primary actions use warm accents and focused labels for clarity.",
    tags: ["Primary action", "Warm accents", "Focused labels"],
  },
  {
    id: "theme-03-sample-03",
    image: "/assets/theme-03/3.png",
    label: "Sample 03",
    title: "Top Tab Country Selector",
    description: "A localized top-tab selector with a lifted Home state and subtle shadows.",
    tags: ["Top tab", "Lifted Home", "Local language"],
  },
  {
    id: "theme-03-sample-04",
    image: "/assets/theme-03/4.png",
    label: "Sample 04",
    title: "Soft Home Tile",
    description: "A softer home tile with rounded visuals and a balanced action row.",
    tags: ["Soft tile", "Balanced actions", "Rounded visuals"],
  },
  {
    id: "theme-03-sample-05",
    image: "/assets/theme-03/5.png",
    label: "Sample 05",
    title: "Compact Notifications",
    description: "Short, two-line notifications that keep the header light and informative.",
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
    name: "Rose Remittance",
    summary: "Eight rose-led interface directions.",
    samples: THEME_02_SAMPLES,
  },
  {
    id: "theme-03",
    label: "Theme 03",
    name: "Philippine Theme",
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
