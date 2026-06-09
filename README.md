## Docinate AI — AI-powered multi-tenant document analysis and collaboration.

## Project Overview

Docinate AI lets teams create workspaces, upload documents, and run AI analyses (summaries, QA, sentiment, entities, structured extraction) using Google Gemini. It stores results in a Prisma-backed PostgreSQL database, supports file storage via Vercel Blob, and synchronizes users and organizations with Clerk.

## Live URL & Repository

- **Live Application**: [https://multi-tenant-document-analysis-three.vercel.app/](https://multi-tenant-document-analysis-three.vercel.app/)

- **GitHub Repository**: [https://github.com/AishwaryaS9/MultiTenant-DocumentAnalysis.git](https://github.com/AishwaryaS9/MultiTenant-DocumentAnalysis.git)

---

## Tech Stack

- Next.js (App Router — uses the `app/` directory)
- TypeScript
- Tailwind CSS
- Authentication: Clerk (`@clerk/nextjs`)
- Database: Prisma with PostgreSQL (`prisma`, `@prisma/client`, `@prisma/adapter-pg`)
- AI: Google Generative AI (`@google/generative-ai`) — Gemini integration
- File storage: Vercel Blob (`@vercel/blob`)
- Webhook verification: Svix (`svix`)
- PDF generation: `jspdf`
- Analytics: `recharts`
- Animations: `framer-motion`
- Other notable libs: `react`, `react-dom`, `framer-motion`, `lucide-react`, `react-markdown`, `sonner`, `clsx`, `class-variance-authority`, `shadcn`, `tailwind-merge`

(Core dependencies were identified in `package.json`.)

## Features

- Multi-tenant organizations/workspaces with slug and membership management

- Authentication and user sync using Clerk
- Clerk webhook handling to sync users and organization memberships (`/api/webhooks/clerk`)
- Document upload (form + file), extraction of text content for analysis
- File upload/delete to Vercel Blob (`lib/blob.ts`)
- AI analysis via Google Gemini with multiple analysis modes (summary, QA, sentiment, entities, extract) (`lib/gemini.ts`)
- Persist AI results (summary, keywords, sentiment) on documents in the database
- Trigger analysis from UI hooks and API (`/api/analyze`)
- Generate downloadable AI analysis PDF reports (`lib/generate-analysis-pdf.ts`)
- Real-Time Analytics Dashboard provides interactive visualizations of document processing volumes, AI coverage, user uploads, and high-frequency keyword trends in real time.
- Organization Members Dashboard manages workspace access, roles, and user profiles through a centralized member directory with search, role-based filtering, and streamlined team administration.
- Prisma schema and migrations for `User`, `Organization`, `OrganizationMember`, and `Document`
- Client-side hooks for documents management and toasts/UX helpers
- Server-side route handlers (App Router route handlers) and client hooks for documents (`app/hooks/use-documents.ts`)

## Project Structure

```
MultiTenant-DocumentAnalysis/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/
│   │   │   ├── [[...sign-in]]/
│   │   ├── sign-up/
│   │   │   ├── [[...sign-up]]/
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── select-org/
│   │   ├── [orgSlug]/
│   │   │   ├── analytics/
│   │   │   ├── documents/
│   │   │   ├── layout.tsx
│   │   │   ├── org-members/
│   │   │   ├── page.tsx
│   │   │   ├── search/
│   ├── api/
│   │   ├── analyze/
│   │   │   ├── route.ts
│   │   ├── documents/
│   │   │   ├── route.ts
│   │   │   ├── search/
│   │   │   │   ├── route.ts
│   │   │   ├── [documentId]/
│   │   │   │   ├── route.ts
│   │   ├── organizations/
│   │   │   ├── check/
│   │   │   │   ├── route.ts
│   │   │   ├── invite/
│   │   │   │   ├── route.ts
│   │   │   ├── route.ts
│   │   │   ├── [orgSlug]/
│   │   │   │   ├── members/
│   │   │   │   │   ├── route.ts
│   │   ├── webhooks/
│   │   │   ├── clerk/
│   │   │   │   ├── route.ts
│   ├── data/
│   │   ├── data.ts
│   ├── globals.css
│   ├── hooks/
│   │   ├── use-documents.ts
│   │   ├── useActiveSection.ts
│   ├── layout.tsx
│   ├── page.tsx
├── assets/
│   ├── features/
│   ├── index.ts
├── components/
│   ├── analytics/
│   ├── common/
│   ├── dashboard/
│   ├── document/
│   ├── landing/
│   ├── org-members/
│   ├── search/
│   ├── ui/
├── lib/
│   ├── analytics.ts
│   ├── blob.ts
│   ├── gemini.ts
│   ├── generate-analysis-pdf.ts
│   ├── prisma.ts
│   ├── sync-user.ts
│   ├── utils.ts
├── middleware.ts
├── package.json
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
├── public/
├── README.md
├── tsconfig.json
├── types/
```

## Getting Started

### Prerequisites

- Node.js >= 18 (Node 18 or 20 recommended)

- A PostgreSQL database (connection string in `DATABASE_URL`)
- Clerk account and API keys for authentication
- Google Gemini API key (`GEMINI_API_KEY`)
- Vercel Blob token if using Vercel Blob storage

### Install dependencies

Using npm:

```bash
npm install
```

Using pnpm:

```bash
pnpm install
```

Using yarn:

```bash
yarn
```

### Environment variables

Create a `.env.local` (or use `.env`) in the project root and provide the values below. The repository already contains a `.env` with example/test values — replace them with secure production values.

Required environment variables (used across the codebase):

- `DATABASE_URL` — Postgres connection string

- `GEMINI_API_KEY` — Google Gemini API key
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob read/write token
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — Clerk publishable key
- `CLERK_SECRET_KEY` — Clerk secret key
- `CLERK_WEBHOOK_SECRET` — Clerk webhook secret (used to verify `/api/webhooks/clerk` signatures)
- `NEXT_PUBLIC_APP_URL` — e.g., `https://multi-tenant-document-analysis-three.vercel.app/`

### Database setup (Prisma)

Generate the Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate deploy
```

For local development migrations:

```bash
npx prisma migrate dev --name init
```

### Run the local development server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open http://localhost:3000

## Deployment

Build the project for production:

```bash
npm run build
```

Start in production mode:

```bash
npm run start
```

Recommended deployment platform: Vercel

1. Connect the repository: https://github.com/AishwaryaS9/MultiTenant-DocumentAnalysis.git

2. In the Vercel dashboard set the environment variables listed above.
3. Ensure the Clerk webhook in the Clerk dashboard points to `https://multi-tenant-document-analysis-three.vercel.app/api/webhooks/clerk` and that `CLERK_WEBHOOK_SECRET` matches.
4. Deploy — Vercel will automatically run the build.

Notes:

- `@vercel/blob` usage requires `BLOB_READ_WRITE_TOKEN` on the deployment environment.

- `GEMINI_API_KEY` must be set for AI features to work; `lib/gemini.ts` will throw if it's missing.

## Conclusion

Docinate AI is a scalable multi-tenant document analysis platform that combines Next.js, Prisma, PostgreSQL, Clerk, Vercel Blob, and Google Gemini AI to streamline document management and collaboration. It enables organizations to securely upload, analyze, and extract insights from documents through AI-powered features such as summarization, sentiment analysis, and entity extraction, improving productivity and decision-making.
