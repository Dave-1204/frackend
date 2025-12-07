This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Enabling Claude Haiku 4.5 (optional)

If you want the application to use the `claude-haiku-4.5` model by default or toggle it for all clients, set the following environment variables in your deployment or local `.env.local` file:

```
NEXT_PUBLIC_AI_MODEL=claude-haiku-4.5
NEXT_PUBLIC_ENABLE_CLAUDE_HAIKU=true
```

- Locally: create a `.env.local` file at the project root and add the lines above, then restart the dev server.
- In production: add the same variables in your hosting provider's environment settings (Vercel, Render, etc.) and redeploy.

Note: This repo exposes these vars client-side with the `NEXT_PUBLIC_` prefix so UI code can read them. Enabling a model here only configures the app to use that model — actually granting access to Anthropic/Claude or another provider still requires the provider-side settings and API keys in your server environment.
