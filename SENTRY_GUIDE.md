# Sentry Setup Guide (Next.js)

This guide outlines how to set up Sentry for error tracking and user feedback loops in this Next.js project.

---

## Step 1: Create Sentry Account & Project

1. Go to [sentry.io](https://sentry.io) and sign up for a free developer account.
2. Once logged in, click **Create Project**.
3. Select **Next.js** as your platform.
4. Name the project `auralixa-aesthetics` and assign it to your team/workspace.
5. Click **Create Project**.

---

## Step 2: Configure the Next.js Project

The easiest way to integrate Sentry is to run the interactive command-line wizard:

1. Open your terminal at the root of the project.
2. Run the Sentry Next.js Wizard:
   ```bash
   npx @sentry/wizard@latest -i nextjs
   ```
3. The wizard will:
   * Open a browser window to authenticate with your Sentry account.
   * Ask you to select your Sentry project (`auralixa-aesthetics`).
   * Automatically generate the configuration files (`sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`).
   * Wrap your `next.config.mjs` configuration with `withSentryConfig`.
   * Add a `SENTRY_AUTH_TOKEN` to your local environment file (`.env.local`).

> [!IMPORTANT]
> Make sure to add `SENTRY_AUTH_TOKEN` to your Vercel (or deployment platform) Environment Variables so Sentry can upload source maps during build time.

---

## Step 3: Verify the Integration

After completing the wizard:
1. Start the dev server: `npm run dev` or `pnpm dev`.
2. Visit the automatically generated test page: `http://localhost:3000/sentry-example-page`.
3. Click the button on the page to trigger a sample error.
4. Check your Sentry Dashboard under **Issues** to verify the error was received.
5. Once verified, you can delete `app/sentry-example-page` and `pages/api/sentry-example-api` if they were generated.
