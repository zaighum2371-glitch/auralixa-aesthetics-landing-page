# SEO, AEO, and GEO Implementation Strategy

This document outlines the architecture and execution plan for Search Engine Optimization (SEO), Answer Engine Optimization (AEO), and Generative Engine Optimization (GEO) on the Auralixa Aesthetics landing page.

## 1. On-Page: Content & Freshness
*   **FAQ Section:** Implemented 10 authoritative, concise Q&As on the landing page. Formatted for direct answers to cater to AI-driven Answer Engines (AEO).
*   **Articles Hub:** Created a static `/articles` page with 3 initial articles to signal content freshness and authority (GEO).
*   **Footer Freshness:** Added a dynamic "Last Updated" timestamp to the footer to signal active maintenance to crawlers.

## 2. In-Code: Structured Data (JSON-LD)
*   **Global Schema:** Injected `HealthAndBeautyBusiness` (or `MedicalBusiness`) JSON-LD into the root layout to establish brand entity, location, and services.
*   **FAQ Schema:** Added `FAQPage` JSON-LD to the homepage to qualify for Google Search Rich Snippets.
*   **Article Schema:** Added `Article` JSON-LD to the `/articles` page to enhance visibility in news feeds and generative summaries.
*   **Metadata Upgrade:** Configured Next.js Metadata API in `app/layout.tsx` for OpenGraph (`og:image`, `og:title`), Twitter cards, and established a `metadataBase` to ensure absolute URLs.

## 3. Mapping: `sitemap.xml`
*   Created `app/sitemap.ts` to dynamically generate a `sitemap.xml` compliant with Next.js App Router. This ensures all static pages (`/`, `/terms`, `/privacy`, `/articles`) are indexed.

## 4. Gatekeeping: `robots.txt`
*   Created `app/robots.ts` to output a `robots.txt` file that points crawlers to the `sitemap.xml` and disallows private/auth routes.

## SPA Caveat & Best Approach
**The Caveat:** Single Page Applications (SPAs) often rely on client-side rendering (CSR), which means search engine crawlers (especially older or less sophisticated ones) might see a blank page before the JavaScript executes, potentially hurting indexing.
**The Solution:** Since we are using Next.js **App Router**, we are already utilizing **Server Components** by default. This means pages are pre-rendered on the server (SSR/SSG), sending fully populated HTML to the client and search engines. 
*   **Best Approach:** Keep SEO-critical pages (like `/`, `/articles`, `/faq`) as Server Components (`use client` should be avoided at the page level if possible). We will inject JSON-LD using standard `<script>` tags within Server Components to ensure they are present in the initial HTML payload.
