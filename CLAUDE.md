# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a space exploration platform built with Next.js 16+, featuring real-time NASA data integration, a Gemini-powered AI assistant, and a comprehensive encyclopedia of space objects. The application uses Supabase as its backend database and integrates with various space APIs.

## Repository Structure

- `/frontend`: Main Next.js application (this directory)
- `/backend`: Supabase configuration and schema files

## Development Commands

### Running the Application
```bash
cd frontend
npm run dev
```

### Building for Production
```bash
cd frontend
npm run build
```

### Linting
```bash
cd frontend
npm run lint
```

## Architecture Overview

### Frontend (Next.js 16+)
- App Router structure with server components and client components
- API routes for external data integration (NASA APIs, Gemini AI)
- Dynamic imports for heavy components (3D visualizations)
- Tailwind CSS for styling
- Framer Motion for animations

### Backend (Supabase)
- PostgreSQL database with flexible schema
- Key tables:
  - `space_objects`: Core entities (planets, missions, asteroids, etc.)
  - `metadata`: Key-value pairs for object properties
  - `details`: Long-form descriptions
  - `facts`: Interesting facts about objects
  - `relationships`: Connections between objects

### Key Integrations
1. **Gemini AI API**: Powers the "Cosmic Assistant" chat feature
2. **NASA APIs**: Provides astronomy data (APOD, Mars rovers, asteroids, etc.)
3. **SpaceNews API**: Delivers space-related news
4. **SpaceDev API**: Provides rocket launch information
5. **Supabase**: Database for encyclopedia content

## Working with the Codebase

### Environment Variables
The application requires several environment variables:
- `GEMINI_API_KEY`: For the AI chat feature
- `NASA_API_KEY`: For NASA API access
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key

### Component Structure
- Pages are in `app/` directory with corresponding route files
- Reusable components are in `components/` directory
- Data fetching happens through:
  - API routes in `app/api/` for external services
  - Direct Supabase queries for encyclopedia content
  - Lib files in `lib/` for shared utilities

### Data Flow
1. External APIs → API Routes → Frontend Components
2. Supabase Database → Direct Queries → Encyclopedia Pages
3. User Input → AI Chat API → Response Display

## Important Considerations

### Next.js Version
This project uses Next.js 16+ which has breaking changes from earlier versions. Refer to `node_modules/next/dist/docs/` for updated APIs and conventions.

### Performance Optimization
- Heavy components (3D visualizations) are lazy-loaded
- API responses are cached appropriately
- Dynamic imports are used for non-critical components

### Supabase Integration
- Use `supabaseClient.js` for client-side queries
- Use `supabaseServer.js` for server-side queries
- Schema is defined in `backend/supabase/schema.sql`

## Testing Changes
1. For UI changes: Visit the relevant page in the browser
2. For API changes: Test the API endpoint directly
3. For database changes: Update the schema and seed files accordingly
4. For AI features: Test the chat interface with various prompts

## Deployment
The application is designed for deployment on Vercel with environment variables configured in the Vercel dashboard.

## Common Development Commands

All commands should be run from the repository root unless otherwise noted.

| Task | Command |
|------|---------|
| Start development server | `npm run dev` (runs `next dev` in `frontend`) |
| Build for production | `npm run build` |
| Start production server | `npm start` (runs `next start` in `frontend`) |
| Lint code | `npm run lint` |
| Run tests (if a test suite is added) | `npm test` – place test files next to the code under `__tests__` or with a `.test.` suffix. To run a single test file: `npm test -- path/to/file.test.ts` |

*Note:* The repository currently does not include a test framework; the above command is provided for future test additions.

## Additional Guidance

- The `frontend/AGENTS.md` file contains important notes about the custom Next.js version used in this project. Refer to it before making changes to routing, APIs, or component conventions.
- For detailed Next.js API changes, consult the documentation in `node_modules/next/dist/docs/`.
The application is designed for deployment on Vercel with environment variables configured in the Vercel dashboard.