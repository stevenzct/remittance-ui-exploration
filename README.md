# Payso Remittance UI Exploration

![Payso logo](public/payso-logo.svg)

A responsive design-review dashboard for comparing Payso remittance homepage concepts. The project presents three visual themes, 18 mobile interface samples, a live three-theme mobile wallet prototype, and the supporting brand system in a single Next.js page.

This repository is a front-end presentation prototype. It does not process remittances and does not include authentication, API routes, a database, or persistent user data.

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Technology](#technology)
- [Getting started](#getting-started)
- [Available scripts](#available-scripts)
- [Project structure](#project-structure)
- [Architecture and data flow](#architecture-and-data-flow)
- [Editing themes and samples](#editing-themes-and-samples)
- [Localization](#localization)
- [Assets and styling](#assets-and-styling)
- [Interaction and accessibility](#interaction-and-accessibility)
- [Verification](#verification)
- [Deployment](#deployment)
- [Current boundaries](#current-boundaries)

## Overview

The application has one route, `/`, composed of four anchor sections:

| Section | Anchor | Purpose |
| --- | --- | --- |
| Overview | `#overview` | Introduces the exploration and automatically previews one screen from each theme. |
| UI Showcase | `#showcase` | Compares every mobile sample with theme tabs, descriptions, tags, and image controls. |
| Prototype | `#prototype` | Provides a live mobile wallet with three switchable themes and working interface controls. |
| Brand System | `#brand` | Documents the Blue Gem and Brick Red colors and the Philippine flag inspiration. |

The current theme catalog is:

| Theme | Name | Samples | Direction |
| --- | --- | ---: | --- |
| Theme 01 | Blue Gem | 5 | Blue-led interface treatments. |
| Theme 02 | Brick Red | 8 | Rose and brick-red interface treatments. |
| Theme 03 | Country Card Theme | 5 | Country-card concepts inspired by the Philippine flag. |

The live prototype has three independent visual choices: Theme 1 Classic, Theme 2 Fresh, and Theme 3 Midnight. Changing the prototype theme updates its palette while keeping the current wallet and other phone state available for continued interaction.

All showcase copy, theme metadata, sample records, image paths, navigation items, and brand colors are local constants in `content/dashboard.ts`.

## Features

- Responsive dashboard shell with a desktop sidebar, sticky header, and mobile navigation drawer.
- Scroll-aware navigation that follows the current section and supports direct URL hashes.
- GSAP-powered hero rotation across all three themes with pause and resume controls.
- Theme tabs and sample navigation that continue across theme boundaries.
- Mouse, touch, and keyboard carousel controls, including horizontal swipe gestures.
- Full-screen image preview with previous/next navigation, zoom from 100% to 250%, and constrained pan controls.
- Live remittance phone with Classic, Fresh, and Midnight theme choices.
- Working country and workplace selectors, balance visibility, wallet selection, account copying, action sheets, bottom navigation, and status feedback.
- English and Simplified Chinese UI copy through a small client-side translation provider.
- Reduced-motion handling, focus restoration, body-scroll locking, semantic labels, and keyboard dismissal.
- Local image delivery through `next/image`; no remote asset host is required.

## Technology

| Tool | Role |
| --- | --- |
| Next.js 16 | App Router, page composition, metadata, and image optimization. |
| React 19 | Component rendering, context, and local interaction state. |
| TypeScript | Strict types for navigation, theme content, samples, icons, and colors. |
| Tailwind CSS 4 | Utility-first responsive styling through PostCSS. |
| GSAP | Hero, carousel, and image-preview transitions. |
| Iconify | Solar interface icons and language flag icons. |
| Fontsource | Self-hosted Inter variable font used by the dashboard and live prototype. |

Swiper is installed in `package.json`, but the current showcase carousel does not use it. Carousel behavior is implemented with React state, pointer events, and GSAP.

## Getting started

### Requirements

- Node.js `20.9.0` or newer
- npm

No environment variables are currently required.

### Install and run

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Use `npm install` instead of `npm ci` when intentionally changing dependencies. Commit the resulting `package-lock.json` update with the dependency change.

### Production mode

```bash
npm run build
npm run start
```

`npm run start` serves an existing production build and must be run after `npm run build`.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Next.js development server. |
| `npm run build` | Creates an optimized production build. |
| `npm run start` | Serves the production build. |
| `npm run lint` | Runs ESLint across the repository. |
| `npm run lint:fix` | Runs ESLint and applies supported fixes. |
| `npm run typecheck` | Runs TypeScript without emitting files. |
| `npm run verify` | Runs lint, type checking, and the production build in sequence. |

## Project structure

```text
app/
  globals.css                 Global tokens, showcase phone shell, and live prototype styling
  layout.tsx                  Metadata and LanguageProvider boundary
  page.tsx                    Single-page section composition
components/
  layout/                     Header, sidebar, mobile drawer, and navigation
  prototype/                  Live wallet state, controls, and inline SVG icons
  providers/                  Client-side language context
  sections/                   Overview, showcase, prototype, brand, and optional stats UI
  showcase/                   Hero rotator, carousel, phone, and image preview
  ui/                         Shared Iconify renderer
content/
  dashboard.ts                Primary UI content and theme catalog
  translations.ts             English-to-Chinese exact-string dictionary
public/
  assets/                     Runtime screenshots, prototype artwork, and brand references
  payso-logo.svg              Shared Payso logo
types/
  dashboard.ts                Content and component domain types
```

Imports use the `@/` alias for the repository root, for example:

```ts
import { SHOWCASE_THEMES } from "@/content/dashboard";
```

## Architecture and data flow

```text
RootLayout
`-- LanguageProvider
    `-- HomePage
        `-- DashboardShell
            |-- DashboardSidebar
            |   `-- DashboardNavigation
            `-- Main content
                |-- DashboardHeader
                |   `-- MobileNavigation
                |       `-- DashboardNavigation
                |-- OverviewSection
                |   `-- HeroThemeRotator
                |       `-- ImagePreview
                |-- ShowcaseSection
                |   `-- SampleCarousel
                |       |-- PhoneMockup
                |       |   `-- ImagePreview
                |       `-- CarouselControls
                |-- PrototypeSection
                |   `-- RemittancePrototype
                |       `-- PrototypeIcon
                `-- BrandSection
```

The main flow is deliberately simple:

1. `content/dashboard.ts` defines the navigation, themes, samples, icons, and brand colors.
2. `app/page.tsx` composes the four visible sections inside `DashboardShell`.
3. `ShowcaseSection` passes `SHOWCASE_THEMES` into `SampleCarousel`.
4. `PrototypeSection` renders `RemittancePrototype`, which owns its demo themes, wallets, selectors, panels, bottom navigation, and feedback state locally.
5. Interactive client components keep temporary state locally for language, section tracking, selected theme/sample, modal state, zoom, pan, and the live phone controls.
6. Images resolve from `public/assets` through paths such as `/assets/sample-01.png` and `/assets/prototype-figma/aub-card.png`.

`app/page.tsx` and `DashboardShell` are server components. Components that use browser APIs, context, effects, animation, or local interaction state explicitly use the client boundary.

## Editing themes and samples

### Update existing content

Edit `content/dashboard.ts` for:

- navigation labels and icons;
- dashboard summary copy;
- theme names and summaries;
- sample titles, descriptions, tags, and image paths;
- brand color names and values.

Keep shared content in this file rather than duplicating it inside rendering components. Collections use `as const satisfies` so TypeScript can validate their shape without discarding literal types.

### Add a sample

1. Add the screenshot under `public/assets` or an existing theme subdirectory.
2. Add a unique sample object to the appropriate sample collection in `content/dashboard.ts`.
3. Use a browser path beginning with `/assets/`; `ShowcaseImagePath` enforces this convention.
4. Add Simplified Chinese entries for any new user-facing strings in `content/translations.ts`.
5. Run `npm run verify` and manually inspect the theme on narrow and wide screens.

Example record:

```ts
{
  id: "theme-01-sample-06",
  image: "/assets/theme-01/sample-06.png",
  label: "Sample 06",
  title: "Clear Transfer Priority",
  description: "A short description of the design direction.",
  tags: ["Primary transfer", "Clear hierarchy"],
}
```

### Add a theme

Adding a fourth theme affects more than the content list. Update and review:

- `ShowcaseTheme` in `types/dashboard.ts`, whose theme IDs and labels are currently a three-item union;
- `SHOWCASE_THEMES` in `content/dashboard.ts`;
- the representative hero data in `components/showcase/hero-theme-rotator.tsx`;
- the fixed three-column theme tab layout in `components/showcase/sample-carousel.tsx`;
- new translation keys and responsive behavior.

## Localization

`LanguageProvider` exposes the current language, a setter, and the `t()` translation helper. English source strings act as translation keys. `content/translations.ts` maps those exact strings to Simplified Chinese.

When adding visible copy:

1. Write the English source string in the content or component.
2. Add the exact same key to `chineseTranslations`.
3. Render it through `t()`.

Missing keys fall back to the English input. The selected language starts in English on every page load and is not stored in cookies or local storage.

## Assets and styling

- Put runtime images in `public/assets`; this is the canonical asset directory used by the application.
- Reference public files from the site root, such as `/assets/theme-03/1.png`.
- Mobile screenshots are designed around a `750 / 1624` aspect ratio.
- `public/assets/prototype-figma/` contains the exact bank card, flag fabric, and interface icon exports from the linked Figma frame.
- `public/assets/ph-flag.png` is used by the brand section; the live phone uses the exact exported Figma flag and fabric artwork.
- `public/payso-logo.svg` is used by both desktop and mobile navigation.
- `components/prototype/prototype-icon.tsx` keeps supplementary prototype controls local as reusable inline SVG paths.
- `app/globals.css` defines the core color variables, base styles, shared showcase/prototype phone frame, prototype theme variables, and short-landscape adjustments.
- Tailwind responsive utilities handle most component layout and spacing.
- The desktop sidebar appears at `lg`; the showcase and other wide splits wait until `xl` so the 272px sidebar does not crowd the content.

The tracked root-level `assets/` directory is not referenced by the current runtime. New web assets should go in `public/assets`.

## Interaction and accessibility

### Navigation

- Desktop and mobile surfaces share `DashboardNavigation`.
- Active navigation follows clicks, URL hashes, scrolling, resizing, and the bottom of the document.
- The mobile drawer closes on link selection, overlay click, close-button click, or `Escape`.
- Opening the drawer locks body scrolling; closing it restores focus to the menu trigger.

### Hero and carousel

- The hero rotates automatically through a representative sample from each theme.
- The rotation can be paused manually and pauses while the browser tab is hidden.
- Carousel tabs jump to the first sample in a theme.
- Previous and Next continue into adjacent themes at collection boundaries.
- The focused carousel responds to Left Arrow and Right Arrow.
- Touch and pointer users can swipe horizontally across the phone presentation.

### Live prototype

- Theme 1 Classic, Theme 2 Fresh, and Theme 3 Midnight can be selected from the controls beside the phone on wide screens or above it on narrower screens.
- Country account and workplace buttons open selectable menus, while the eye control hides or reveals the active balance.
- All Wallets switches between PHP, USD, and HKD balances, and the receiving-account hit area copies a safe demo account value.
- Transfer, Exchange, and View All open modal sheets with demo inputs and actions; the backdrop and close button dismiss them.
- The announcement, message rows, action confirmations, and non-Home navigation items provide temporary status feedback.
- Theme choices use radio semantics, selector options use listbox semantics, modal sheets identify themselves as dialogs, and status messages are announced through a live region.

### Image preview

- Selecting a phone opens a modal preview rendered through a React portal.
- Left Arrow and Right Arrow navigate within the preview's sample collection.
- `Escape`, the close button, or the backdrop closes the preview.
- Zoom controls move in 25% steps from 100% to 250%.
- A zoomed image can be dragged within calculated bounds.
- Closing restores focus to the phone that opened the preview.

Motion durations collapse when the operating system requests reduced motion.

## Verification

Run the full repository check before merging:

```bash
npm run verify
```

This runs ESLint, strict TypeScript checking, and a production build. There is currently no unit, integration, or browser-test suite, so complete a focused manual pass as well:

- Load `/` and follow each section link.
- Check the desktop sidebar and mobile drawer.
- Switch between English and Simplified Chinese.
- Traverse all 18 samples, including the boundaries between themes.
- Open the image preview, navigate, zoom, pan, and close it with the keyboard.
- Follow `#prototype`, switch among all three prototype themes, and confirm the phone remains usable at each palette.
- Exercise the country and workplace menus, balance toggle, account copy control, wallet picker, message rows, and bottom navigation.
- Open the Transfer, Exchange, and All Messages sheets; test their inputs and actions, then dismiss each by its close button and backdrop.
- Confirm prototype toasts and selection states update without navigating or reloading the page.
- Check reduced-motion behavior.
- Review the layout and live phone at approximately 320px, tablet width, and desktop width.

For a quick formatting check on changed files, run:

```bash
git diff --check
```

## Deployment

The repository does not include provider-specific deployment configuration. It can be deployed to a platform that supports Next.js 16 and Node.js `20.9.0` or newer.

Use the repository-defined production flow:

```bash
npm ci
npm run build
npm run start
```

For Vercel, import the repository and use the detected Next.js defaults. No environment variables are currently needed.

This project is not configured with `output: "export"`, so do not treat the current build as a static HTML export.

## Current boundaries

- Only the `/` page exists.
- Content and images are bundled locally; there is no CMS or remote data source.
- There are no API routes, server actions, network requests, authentication flows, database clients, or remittance transactions.
- The live phone is an in-memory UI simulation; wallet changes, transfers, exchange quotes, copied account values, and messages are not persisted or submitted.
- Language selection is session-only React state and resets after a reload.
- `StatsSection` and `DASHBOARD_STATISTICS` remain in the source tree but are not rendered by the current page.
- Swiper is installed but unused by the current source.
- Automated tests and continuous-integration workflows are not configured.
- No `LICENSE` file is included; confirm distribution terms before reusing the project outside its intended context.
