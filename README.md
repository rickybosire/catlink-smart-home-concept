# Catlink Smart Home — Portfolio Concept

A responsive React portfolio project that reimagines how Catlink's connected cat-care products could be presented across a focused multi-page website.

## Overview

The project organizes a broad product range—self-cleaning litter boxes, feeders, and water fountains—into a clearer browsing experience. It combines an editorial homepage, full catalogue, product detail pages, comparison guidance, an interactive litter-box finder, and a customer-review section.

The design takes general inspiration from Apple's restrained layouts, typography, spacing, and product storytelling without reproducing an Apple page or presenting itself as an official Catlink website.

## Main features

- Responsive homepage and complete product catalogue
- Individual detail pages with scrollable image galleries and key specifications
- Structured “How to choose” guidance with an interactive recommendation filter
- Customer-review page using publicly available review content and customer imagery
- Route-specific titles, descriptions, canonical URLs, and Open Graph metadata
- Custom not-found state and generated static route entries
- Official Catlink product imagery served responsively from its original sources

## Tech stack

- React 18
- Vite 5
- Framer Motion
- Lucide React
- Tailwind/PostCSS build tooling
- Plain CSS for the project-specific responsive design system

## UX and technical decisions

- Product data remains centralized in `src/App.jsx` to keep this portfolio iteration easy to review.
- Static route entry files are generated after each production build for direct navigation and route-specific metadata.
- Product pages prioritize comparison-friendly summaries, highlighted specifications, and identifiable product photography.
- Images use lazy loading where appropriate, responsive `srcset` hints, and eager loading only for priority content.
- The interface retains a minimal, presentation-led visual direction while differentiating the information architecture and content from its references.

## Responsive design and accessibility

Layouts are designed for mobile, tablet, and desktop widths, including 320, 375, 768, and 1440 px review targets. Accessibility work includes:

- A skip-to-content link and stable main-content landmark
- Visible keyboard focus states
- Semantic navigation labels and mobile-menu ARIA relationships
- Escape-to-close behavior with focus returned to the menu button
- Reduced-motion handling in both CSS and Framer Motion
- Descriptive image alternative text and accessible gallery controls
- Higher-contrast secondary text across the site

## Project structure

```text
src/
  App.jsx             Page components, catalogue data, and interactions
  index.css           Responsive styles and component presentation
  main.jsx            React entry point
  metadata.js         Route titles, descriptions, and canonical metadata
scripts/
  create-route-entries.mjs
  smoke-test.mjs
index.html
```

Generated output in `dist/` and private hosting configuration in `.openai/` are intentionally excluded from version control.

## Local setup

Requires a current Node.js LTS release and npm.

```bash
git clone <repository-url>
cd catlink-smart-home-concept
npm install
npm run dev
```

Vite prints the local development URL after startup.

For a public deployment, set `VITE_SITE_ORIGIN` to the final site origin before building so generated canonical and Open Graph URLs use the correct domain. A safe example is included in `.env.example`.

## Build and checks

```bash
npm run build
npm run smoke
npm run preview
```

`npm run build` creates the production bundle and route-specific static entries in `dist/`. The smoke test validates generated routes, metadata, and referenced build assets. Browser-level checks can also run when `SMOKE_BASE_URL` and a Playwright browser or CDP endpoint are available.

## Preview

The working hosted preview is private. For a local preview of the production build, run `npm run build` followed by `npm run preview`.

## Disclaimer

This is an independent, non-commercial portfolio concept. It is not affiliated with, endorsed by, or an official website of Catlink or Catlink EU. Product names, trademarks, product information, and official imagery belong to their respective owners. Public review content is presented for design demonstration and remains attributable to its original sources.
