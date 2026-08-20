# Payso Remittance UI Exploration

![Payso logo](public/payso-logo.svg)

A multi-route design-review workspace and interactive front-end prototype for a Payso remittance app. It brings the early wireframes, three visual directions, 18 high-fidelity mobile samples, refinement history, live wallet interactions, and country-transition motion studies into one Next.js project.

> This repository is a presentation prototype. It does not process money and does not include authentication, API routes, a database, persistent user data, or real remittance transactions.

## Table of contents

- [Project at a glance](#project-at-a-glance)
- [Route map](#route-map)
- [Core experiences](#core-experiences)
- [Design and prototype themes](#design-and-prototype-themes)
- [Interactive prototype](#interactive-prototype)
- [Country-transition motion](#country-transition-motion)
- [Animation 1 developer handoff](#animation-1-developer-handoff)
- [Technology](#technology)
- [Getting started](#getting-started)
- [Available scripts](#available-scripts)
- [Project structure](#project-structure)
- [Architecture and data flow](#architecture-and-data-flow)
- [Content and customization](#content-and-customization)
- [Localization](#localization)
- [Assets and styling](#assets-and-styling)
- [Interaction and accessibility](#interaction-and-accessibility)
- [Verification](#verification)
- [Deployment](#deployment)
- [Current boundaries](#current-boundaries)

## Project at a glance

| Area | Current implementation |
| --- | --- |
| Framework | Next.js 16 App Router with React 19 and strict TypeScript |
| Review content | 3 showcase themes and 18 mobile UI samples |
| Prototype styles | Violet, Soft Pink, and Royal Blue |
| Motion studies | 4 selectable country transitions; a fifth option is marked Coming soon |
| Localization | English plus partial Simplified Chinese UI translation |
| Data | Local TypeScript constants and local image assets |
| State | In-memory React state that resets on reload |
| Backend | None |
| Required environment variables | None |

The repository supports two related activities:

1. Reviewing how the homepage evolved from wireframes through themed concepts and refinements.
2. Testing a responsive remittance-wallet prototype, including its country-transition motion and the copy-ready developer handoff for Animation 1.

## Route map

Every route is wrapped by the shared dashboard shell, language provider, desktop sidebar, sticky header, and mobile navigation.

| Route | Source | Purpose |
| --- | --- | --- |
| `/` | `app/page.tsx` | Overview, rotating theme preview, 18-sample UI showcase, and brand system. |
| `/wireframes` | `app/wireframes/page.tsx` | Three low-fidelity boards covering homepage structure, work-country selection, and navigation on scroll. |
| `/refinements` | `app/refinements/page.tsx` | Before-and-after review of the old annotated homepage and the updated prototype reference. |
| `/prototype` | `app/prototype/page.tsx` | Standalone interactive wallet, style configurator, motion selector, and Animation 1 source-code modal. |
| `/revisions` | `app/revisions/page.tsx` | Legacy route that redirects to `/refinements`. |

The home route also supports direct section links:

- `/#overview`
- `/#showcase`
- `/#brand`

Navigation highlighting is route-aware. On `/`, it also follows the active section while the page scrolls.

## Core experiences

### Shared dashboard shell

- Sticky route title and language controls.
- Desktop sidebar from the `lg` breakpoint and a mobile navigation drawer below it.
- Fullscreen API control on supported browsers at the `sm` breakpoint and wider.
- Route-aware active navigation and scroll-aware home-section highlighting.
- Shared English/Simplified Chinese language state for the active page session.

### Home design review

- GSAP-powered hero rotation through a representative screen from each showcase theme.
- Pause/resume control and page-visibility handling for the hero rotation.
- A three-theme carousel covering all 18 interface directions.
- Previous/Next navigation that crosses theme boundaries.
- Pointer/touch swipe navigation and Left/Right Arrow keyboard navigation.
- LightGallery previews with zoom, rotate, fullscreen, autoplay, thumbnails, counter, and download controls.
- Brand guidance for Blue Gem `#381C8D`, Brick Red `#BA3245`, and the Philippine-flag inspiration.

### Wireframes

The `/wireframes` page presents three early design boards:

1. Homepage structure
2. Work-country selection
3. Top navigation on scroll

Each board can be opened in LightGallery. The page also links directly to the current interactive prototype.

### Refinements

The `/refinements` page compares:

- the annotated old homepage review; and
- the current prototype reference.

Both artifacts use the shared LightGallery configuration, and the page includes calls to action for testing the live prototype.

## Design and prototype themes

The showcase and live prototype use two related but independent theme collections. Do not assume their IDs or names are interchangeable.

### Showcase catalog

Defined in `content/dashboard.ts`:

| Theme | Name | Samples | Direction |
| --- | --- | ---: | --- |
| Theme 01 | Blue Gem | 5 | Blue-led homepage treatments. |
| Theme 02 | Brick Red | 8 | Rose and brick-red homepage treatments. |
| Theme 03 | Country Card Theme | 5 | Country-card concepts inspired by the Philippine flag. |

### Live prototype styles

Defined locally in `components/prototype/remittance-prototype.tsx`:

| Style | Name | Primary color | Notes |
| --- | --- | --- | --- |
| Theme 1 | Violet | `#38168D` | Violet surfaces and the theme-specific asset set. |
| Theme 2 | Soft Pink | `#B14261` | Rose surfaces and alternate exported icons/artwork. |
| Theme 3 | Royal Blue | `#2853BB` | Blue surfaces and the default exported icon set. |

Changing the prototype style updates CSS custom properties and theme-specific assets while preserving the current in-memory prototype state.

## Interactive prototype

The primary implementation is `components/prototype/remittance-prototype.tsx`. It owns the phone state, theme and motion controls, selectors, feedback, sheets, and responsive prototype behavior.

### Active interactions

- Switch among Violet, Soft Pink, and Royal Blue from the accessible Style tab.
- Choose one of four available transition styles from the Motion tab.
- Open the work-region sheet and select Hong Kong, Singapore, or Saudi Arabia.
- Return to the Philippines with the home-country control.
- Switch between PHP and HKD wallet experiences when moving between the Philippines and Hong Kong.
- Show or hide the active balance.
- Copy the safe demo receiving-account value.
- Open the SGD or SAR wallet placeholder and receive a Coming soon status message.
- Select message rows, quick actions, and bottom-navigation destinations to receive demo feedback.
- Scroll the simulated phone to see the announcement and wallet summary move into sticky header states.
- Dismiss the work-region sheet with its handle, backdrop, `Escape`, or a downward drag gesture.

Country behavior is intentionally specific:

- Hong Kong uses the selected transition and activates the HKD wallet after the loader completes.
- Returning to the Philippines resets the PHP state before its transition starts; completion then clears the loader, reports status, and restores focus.
- Singapore and Saudi Arabia currently bypass the animated transition and show unopened SGD or SAR wallet states.

Several controls are intentionally visual-only in the shipped prototype. `All Wallets`, `Transfer`, `Exchange`, `View All`, the wallet action buttons, and `Send now` are disabled. Supporting panel markup and USD demo data remain in the source but are not reachable through the current interface.

### Responsive behavior

- At `xl`, the phone is sticky on the left and the configurator sits on the right.
- At narrower widths, the configurator appears before the phone.
- Below the desktop layout, the phone experience can become a fixed `100vw` by `100dvh` view as its stage reaches the top of the viewport.
- The phone is designed around a 381px inline-size query container, allowing internal dimensions and motion offsets to use `cqw` units consistently.

## Country-transition motion

The Motion tab controls the transition used when switching between the Philippines and Hong Kong.

| Choice | Name | Production component | Status |
| --- | --- | --- | --- |
| Animation 1 | Takeoff arc | `components/prototype/takeoff-arc-transition.tsx` | Available; includes source-code handoff. |
| Animation 2 | World route | `components/prototype/work-location-world-loader.tsx` | Available; uses GSAP `MotionPathPlugin`. |
| Animation 3 | Flag swoosh | `components/prototype/flag-swoosh-loader.tsx` | Available; masked flag reveal with scale and flash. |
| Animation 4 | Editorial curtain | `components/prototype/country-curtain-loader.tsx` | Available; clip-path curtain with blur, settle, and sheen. |
| Animation 5 | Soft landing | No active component | Disabled and labelled Coming soon. |

Animation artwork is stored in `public/assets/prototype-figma/`:

- Animation 1 uses the Philippines and Hong Kong `work-location-*-loading.png` composites.
- Animation 2 composes `work-location-globe.png` and `work-location-airplane.png`.
- Animation 3 uses the `work-location-*-swoosh.png` variants.
- Animation 4 uses the `work-location-*-curtain.png` variants.

The loaders announce their pending destination and include reduced-motion behavior. Their `onComplete` callbacks end the loading state and finalize post-transition behavior. Hong Kong defers HKD wallet activation until completion, while the Philippines return path resets PHP state before its loader starts.

`components/prototype/globe-landing-loader.tsx` is an unreferenced experiment. It is not the shipped implementation of Animation 5.

## Animation 1 developer handoff

The in-app source documentation is specifically for **Animation 1 - Takeoff arc**. It does not describe Animations 2, 3, or 4.

To open it:

1. Visit `/prototype`.
2. Select the **Motion** tab.
3. Select **01**.
4. Choose **Source code**.

The modal provides:

- an implementation overview and five-stage timeline;
- runtime, duration, and reduced-motion metadata;
- setup, asset, and accessibility notes;
- Component, Styles, and Integration source tabs;
- line numbers and lightweight token highlighting;
- per-tab clipboard copying with success/error feedback; and
- keyboard tab navigation with Left/Right Arrow, Home, and End.

### Canonical files

| Concern | File |
| --- | --- |
| Live transition | `components/prototype/takeoff-arc-transition.tsx` |
| Modal UI and behavior | `components/prototype/animation-source-modal.tsx` |
| Copy-ready code strings and timeline | `content/animation-source.ts` |
| Production styles | `app/globals.css` under the `.prototype-work-location-loading*` selectors |
| Destination artwork | `public/assets/prototype-figma/work-location-philippines-loading.png` and `work-location-hongkong-loading.png` |

The source modal is a standalone handoff representation, not a byte-for-byte import of the production files. When Animation 1 changes, update the live component, production CSS, and the duplicated Component/Styles/Integration examples in `content/animation-source.ts` together.

### Runtime sequence

1. The country selector prepares the destination and loading state. Hong Kong leaves the current wallet active underneath the loader; the Philippines return path resets PHP state first.
2. `TakeoffArcTransition` selects the matching destination artwork.
3. The transition waits for the image `load` or `error` event before starting, preventing a blank first-run animation.
4. A GSAP timeline raises the overlay, moves the artwork through its arc, settles it, and fades the overlay.
5. `onComplete` finalizes the post-transition state and removes the loader. It activates HKD for Hong Kong; the Philippines path has already reset PHP.
6. Component cleanup kills the timeline and related tweens and clears the temporary GSAP properties.

### Timeline

| Time | Stage | Behavior |
| --- | --- | --- |
| `0.00-0.18s` | Enter | The white overlay rises into the phone viewport. |
| `0.04-0.46s` | Cruise | Country artwork accelerates along a shallow tilted 3D arc. |
| `0.46-0.70s` | Approach | A small overshoot adds arrival energy and direction. |
| `0.70-0.88s` | Settle | Position and rotation resolve to their final values. |
| `1.02-1.16s` | Reveal | The overlay fades and control returns to the updated wallet. |

With `prefers-reduced-motion: reduce`, the component shows a static destination state and completes after 400ms.

The transition uses `cqw` values, so its parent must establish `container-type: inline-size`. The copy-ready Styles tab includes the required `.prototype-screen` query-container and sizing contract.

## Technology

Versions below reflect `package.json`.

| Tool | Version | Role |
| --- | --- | --- |
| Next.js | `^16.2.10` | App Router, metadata, prerendering, and local image optimization. |
| React / React DOM | `^19.2.7` | Component rendering, context, refs, effects, and in-memory interaction state. |
| TypeScript | `^6.0.3` | Strict types with no emitted output during checking. |
| Tailwind CSS | `^4.3.2` | Responsive utility styling through PostCSS. |
| GSAP | `^3.15.0` | Hero/carousel motion, prototype transitions, draggable sheets, and motion paths. |
| LightGallery | `^2.9.0` | Showcase, wireframe, and refinement image viewing. |
| Iconify React | `^6.0.2` | Solar dashboard icons, MDI fullscreen icons, and circle-flag language icons. |
| Fontsource Inter | `^5.3.0` | Self-hosted Inter variable font. |

GSAP uses core plus `Draggable` and `MotionPathPlugin`; no paid GSAP plugin is required.

`swiper`, `three`, and `@types/three` are installed but are not imported by the current source. The carousel is implemented with React pointer state and GSAP instead of Swiper.

## Getting started

### Requirements

- Node.js `20.9.0` or newer
- npm

No `.env` file or environment variables are required.

### Install and run

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The most direct feature-review URLs are:

- [http://localhost:3000/](http://localhost:3000/)
- [http://localhost:3000/wireframes](http://localhost:3000/wireframes)
- [http://localhost:3000/refinements](http://localhost:3000/refinements)
- [http://localhost:3000/prototype](http://localhost:3000/prototype)

Use `npm install` instead of `npm ci` only when intentionally changing dependencies. Commit the resulting `package-lock.json` change with the dependency update.

### Production mode

```bash
npm run build
npm run start
```

`npm run start` serves an existing `.next` build and must follow `npm run build`.

## Available scripts

| Command | Underlying command | Purpose |
| --- | --- | --- |
| `npm run dev` | `next dev` | Start the development server. |
| `npm run build` | `next build` | Create an optimized production build. |
| `npm run start` | `next start` | Serve an existing production build. |
| `npm run lint` | `eslint .` | Lint the repository. |
| `npm run lint:fix` | `eslint . --fix` | Apply supported ESLint fixes. |
| `npm run typecheck` | `tsc --noEmit` | Run strict TypeScript checking without writing output. |
| `npm run verify` | lint + typecheck + build | Run the complete pre-merge verification gate. |

There is currently no unit, integration, or end-to-end test command.

## Project structure

```text
app/
  globals.css                         Tailwind, Inter, LightGallery, global UI, prototype, and modal styles
  layout.tsx                          Root metadata, LanguageProvider, and DashboardShell
  page.tsx                            Home overview, showcase, and brand sections
  prototype/page.tsx                  Interactive prototype route
  refinements/page.tsx                Refinement review route
  revisions/page.tsx                  Legacy redirect to /refinements
  wireframes/page.tsx                 Wireframe review route

components/
  layout/                             Header, sidebar, shared navigation, and mobile drawer
  providers/language-provider.tsx     Session-only language context and translation helper
  sections/                           Home sections and the prototype route wrapper
  showcase/                           Hero rotator, carousel, phone mockup, and LightGallery configuration
  wireframes/                         Wireframe gallery page
  revisions/                          Before/after refinement page and gallery
  prototype/
    remittance-prototype.tsx          Main phone state, configurator, interactions, and orchestration
    takeoff-arc-transition.tsx        Animation 1 production implementation
    work-location-world-loader.tsx    Animation 2 production implementation
    flag-swoosh-loader.tsx            Animation 3 production implementation
    country-curtain-loader.tsx        Animation 4 production implementation
    globe-landing-loader.tsx          Unreferenced motion experiment
    animation-source-modal.tsx        Animation 1 documentation dialog
    prototype-icon.tsx                Reusable inline SVG prototype controls
  ui/dashboard-icon.tsx               Shared Iconify renderer

content/
  dashboard.ts                        Navigation, showcase themes, samples, statistics, and brand colors
  translations.ts                     Exact-string Simplified Chinese translation dictionary
  animation-source.ts                 Animation 1 timeline and copy-ready source tabs
  revisions.ts                        Unused legacy refinement feedback content

types/
  dashboard.ts                        Dashboard content and icon domain types

public/
  payso-logo.svg                       Navigation logo
  assets/                              URL-addressed screenshots, wireframes, brand art, and prototype exports

assets/
  revisionsold-ui-review-enhanced.png  Statically imported old-UI review image
  ...                                  Source/duplicate images not used by the current runtime
```

Imports use `@/` as an alias for the repository root:

```ts
import { SHOWCASE_THEMES } from "@/content/dashboard";
```

## Architecture and data flow

```text
RootLayout
└─ LanguageProvider
   └─ DashboardShell
      ├─ DashboardSidebar
      ├─ DashboardHeader
      │  └─ MobileNavigation
      └─ Active route page
         ├─ HomePage
         │  ├─ OverviewSection -> HeroThemeRotator
         │  ├─ ShowcaseSection -> SampleCarousel -> LightGallery
         │  └─ BrandSection
         ├─ WireframesPage -> LightGallery
         ├─ RefinementsPage -> RevisionOverview -> LightGallery
         └─ PrototypePage -> PrototypeSection -> RemittancePrototype
            ├─ country-transition loaders
            └─ AnimationSourceModal
```

The application has no remote business-data layer. Its main flow is:

1. `content/dashboard.ts` supplies navigation, showcase records, and brand colors.
2. The active App Router page selects the relevant experience.
3. Client components translate visible copy and hold temporary interaction state.
4. Showcase/wireframe/refinement images resolve from local assets and open through LightGallery.
5. `RemittancePrototype` coordinates prototype themes, wallet/country state, selectors, feedback, and motion loaders.
6. A loader calls `onComplete` to end loading and finalize direction-specific state; Hong Kong activates HKD at this point, while the Philippines path has already reset PHP.

Route pages and `DashboardShell` can remain server components. Components that use context, browser APIs, local state, effects, or animation declare the client boundary with `"use client"`.

## Content and customization

### Update navigation, showcase content, or brand colors

Edit `content/dashboard.ts` for:

- navigation labels, paths, and icons;
- showcase theme names and summaries;
- sample titles, descriptions, tags, and image paths; and
- brand color names and values.

Collections use `as const satisfies` so TypeScript validates their shape while preserving useful literal types.

### Add a showcase sample

1. Add the screenshot to `public/assets/` or the appropriate theme subdirectory.
2. Add a unique record to the matching sample collection in `content/dashboard.ts`.
3. Use a browser path beginning with `/assets/`; `ShowcaseImagePath` enforces this convention.
4. Add exact-string Chinese translations for new visible text.
5. Run `npm run verify` and manually review the carousel and LightGallery preview.

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

### Add a showcase theme

Adding a fourth showcase theme requires coordinated changes to:

- the `ShowcaseTheme` ID/label unions in `types/dashboard.ts`;
- the sample collection and `SHOWCASE_THEMES` in `content/dashboard.ts`;
- the representative hero list in `components/showcase/hero-theme-rotator.tsx`;
- the fixed three-column theme selector in `components/showcase/sample-carousel.tsx`;
- translations, assets, accent styling, and responsive review.

### Modify a live prototype style

Update `PROTOTYPE_THEMES` and, when needed, the theme-specific asset maps near the top of `components/prototype/remittance-prototype.tsx`. The `themeVariables()` helper turns the selected theme into CSS custom properties consumed throughout `app/globals.css`.

Keep showcase themes and live prototype styles separate unless the product decision explicitly requires them to match.

### Add or change a country transition

1. Create or update a focused loader component under `components/prototype/`.
2. Add its label to `WORK_LOCATION_ANIMATIONS`.
3. Wire it into the conditional loader render in `remittance-prototype.tsx`.
4. Use `onComplete` to end loading and finalize the direction-specific post-transition state.
5. Add asset loading/error handling, cleanup, destination announcements, and a reduced-motion path.
6. Add translations for its visible name and status.
7. Verify both Philippines and Hong Kong directions at phone and desktop sizes.

If changing Animation 1, also update all duplicated developer-handoff content in `content/animation-source.ts`.

## Localization

`components/providers/language-provider.tsx` exposes:

- `language` (`en` or `zh`);
- `setLanguage()`; and
- `t()`, the translation helper.

English source strings are translation keys. `content/translations.ts` maps exact matches to Simplified Chinese, and missing keys fall back to the original English string.

When adding translated UI copy:

1. Add the English text to the component or content record.
2. Add the exact same key to `chineseTranslations`.
3. Render the source string through `t()`.

The provider updates the root document language to `en` or `zh-CN`. Language selection is not persisted and resets to English after a reload.

Localization is intentionally partial. Dashboard chrome, the review pages, showcase metadata, prototype configurator, and Animation 1 source modal are translated; substantial copy inside the simulated phone and its toast messages remains English.

## Assets and styling

### Asset conventions

- Put URL-addressed runtime files in `public/assets/` and reference them as `/assets/...`.
- `public/assets/prototype-figma/` contains the exported cards, flags, icons, banners, wallet states, and transition artwork used by the phone.
- Most local images render through `next/image`; `next.config.ts` does not configure remote image hosts.
- `assets/revisionsold-ui-review-enhanced.png` is an intentional exception imported statically by `components/revisions/revision-overview.tsx`.
- Other root-level `assets/` images are legacy/source duplicates and are not referenced by the current UI.
- `public/payso-logo.svg` is shared by desktop and mobile navigation.

Inter is bundled locally with Fontsource. Dashboard icons are referenced by Iconify string IDs; depending on cache and bundling behavior, those icons can require access to Iconify's API at runtime. Do not assume the complete interface is offline-ready without testing and, if necessary, bundling those icon data locally.

### Styling model

`app/globals.css` imports:

1. the Inter variable font;
2. Tailwind CSS; and
3. LightGallery core/plugin styles.

The project intentionally mixes:

- Tailwind utilities for component layout, spacing, responsive states, and common surfaces;
- global CSS classes for the phone, prototype configurator, motion loaders, LightGallery adjustments, and source-code modal; and
- CSS custom properties for prototype theme colors.

The desktop dashboard is a 272px sidebar plus flexible content at `lg`. Wider two-column showcase/prototype layouts wait until `xl` to preserve space for the phone and documentation.

## Interaction and accessibility

### Dashboard navigation

- Desktop and mobile views share `DashboardNavigation`.
- Home-section state follows clicks, hash changes, scrolling, resizing, and the bottom of the document.
- The mobile drawer closes on navigation, backdrop click, close-button click, or `Escape`.
- Opening the drawer locks body scrolling; closing restores focus to the menu trigger.
- The language control updates `<html lang>`.

### Showcase and galleries

- Theme controls use tab semantics.
- The focused sample carousel responds to Left/Right Arrow.
- Pointer and touch users can swipe horizontally with a 50px threshold.
- Custom hero/carousel GSAP durations collapse when reduced motion is requested.
- LightGallery supplies its own gallery keyboard, zoom, fullscreen, and media controls.

### Prototype

- Style/Motion controls use tabs with roving focus and Left/Right Arrow switching.
- Theme and animation options use radio/radiogroup semantics.
- The work-region selector is a labelled non-modal dialog with focus management, a Tab loop, `Escape`/backdrop dismissal, and trigger-focus restoration. The phone scroll area and bottom navigation become inert while it is open; the home-country control remains available.
- Prototype toasts use polite live regions; motion loaders announce the pending destination.
- The source modal is portalled to `document.body`, locks body scroll, traps focus, supports `Escape` and backdrop dismissal, and restores focus to the Source code button.
- Source-code tabs support Left/Right Arrow, Home, and End; copy results use a separate polite live status.
- Custom motion paths provide explicit reduced-motion handling and clean up timers, timelines, and tweens when unmounted.

Accessibility should still be manually verified after UI changes, particularly focus order, translated accessible names, 320px layouts, browser fullscreen behavior, and third-party gallery behavior.

## Verification

Run the repository gate before merging:

```bash
npm run verify
```

It runs ESLint, strict TypeScript checking, and a production build in sequence. There is no automated UI test suite, so complete a focused manual pass as well.

### Manual checklist

- Load `/` and test `/#overview`, `/#showcase`, and `/#brand` navigation highlighting.
- Visit `/wireframes`, `/refinements`, and `/prototype` directly.
- Confirm `/revisions` redirects to `/refinements`.
- Open showcase, wireframe, and refinement assets in LightGallery and exercise the relevant controls.
- Traverse all 18 showcase samples, including transitions between theme boundaries.
- Pause/resume the hero rotator and check its hidden-tab behavior.
- Switch English/Simplified Chinese and confirm the document language changes.
- Test the mobile drawer, desktop sidebar, and supported fullscreen control.
- On `/prototype`, test all three styles and all four enabled motion choices.
- Switch Philippines -> Hong Kong -> Philippines for every enabled transition.
- Confirm Singapore and Saudi Arabia show unopened wallet states without claiming a completed wallet switch.
- Test the balance toggle, account copy, work-region sheet, drag-to-dismiss, message rows, quick actions, bottom navigation, and status feedback.
- With Animation 1 selected, open Source code; test Component/Styles/Integration tabs, keyboard navigation, code scrolling, copying, `Escape`, backdrop close, focus trap, and focus restoration.
- Check `prefers-reduced-motion: reduce` behavior.
- Review at approximately 320px, tablet width, desktop width, and short landscape height.

Check patch whitespace separately:

```bash
git diff --check
```

## Deployment

The repository has no provider-specific deployment configuration and is not configured with `output: "export"`.

For a generic Node host:

```bash
npm ci
npm run build
npm run start
```

The default port is `3000`. Forward Next.js CLI arguments to choose another port:

```bash
npm run start -- -p 8080
```

Vercel can use its detected Next.js defaults. No environment variables are currently required.

The current routes are prerendered by `next build`, but this is not the same as a configured static HTML export. Use the documented Next.js server flow unless static-export support is deliberately added and verified.

## Current boundaries

- The app is a front-end design prototype, not a financial product.
- There are no API routes, server actions, remote business-data requests, authentication flows, database clients, or persisted transactions.
- Prototype, language, wallet, country, and navigation state resets after reload.
- Several phone controls are intentionally disabled, and their existing panel code is not reachable from the current UI.
- Simplified Chinese coverage is partial; much of the simulated phone remains English.
- Animation 5 is disabled and has no active production component.
- The in-app developer handoff documents only Animation 1.
- `StatsSection`, `DASHBOARD_STATISTICS`, `RevisionImage`, `REVISION_FEEDBACK_SOURCE`, and `GlobeLandingLoader` remain in the source tree but are not rendered.
- Swiper, Three.js, and `@types/three` are installed but unused.
- No unit, integration, browser-test suite, or CI workflow is configured.
- No Docker configuration, static-export configuration, or provider-specific hosting file is included.
- No `LICENSE` file is included; confirm distribution terms before using this project outside its intended context.
