import type {
  DashboardIconKey,
  DashboardIconName,
  DashboardStatistic,
  DashboardTheme,
  NavigationItem,
  ShowcaseSample,
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
  label: "Theme 01",
  name: "Blue Gem",
  summary: "Five interface directions for the Payso remittance experience.",
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
    value: "5",
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
    value: "1",
    label: "Design direction",
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
    description: "Country selection appears as a top tab with an active color and underline. The active bottom navigation item also uses a top underline.",
    tags: ["Top tab selector", "Neutral actions", "Monochrome icons"],
  },
] as const satisfies readonly ShowcaseSample[];

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
