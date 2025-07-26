# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Pokemon TCG Pocket trading and Wonder Pick sharing web application built with SvelteKit. Users can list cards they want, offer cards for trade, chat with potential traders, and share Wonder Pick opportunities.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Tech Stack & Architecture

### Core Framework
- **SvelteKit**: Full-stack framework with file-based routing in `src/routes/`
- **TypeScript**: Strict typing throughout
- **Tailwind CSS**: Utility-first styling with shadcn/ui components in `src/lib/components/ui/`

### Database & ORM
- **Turso**: Edge SQLite database
- **Drizzle ORM**: Type-safe ORM with schema in `src/lib/server/db/schema.ts`
- **Connection**: Use `@libsql/client` with `drizzle-orm/libsql`

### Authentication & Services
- **Kinde**: Authentication service integrated via `@kinde-oss/kinde-auth-sveltekit`
- **Auth Setup**: Configured in `src/hooks.server.ts` with `handleAuth`
- **TCGdex SDK**: Pokemon card data via `@tcgdex/sdk` - never store card content locally
- **Socket.io**: Real-time chat and WebSocket functionality
- **AWS S3**: User image uploads
- **Cloudinary**: Image optimization and transformation

### Database Schema Structure
- **users**: Kinde user IDs, encrypted TCG Pocket IDs, reputation scores
- **listings**: Card trading posts with wants/offers
- **conversations**: Chat between traders
- **messages**: Real-time messaging
- **tradeAgreements**: Formal trade proposals
- **wonderPicks**: Shared Wonder Pick opportunities
- **feedback**: Post-trade reputation system

### Key Implementation Patterns

1. **API Responses**: Always return `{ success: true, data: {...} }` or `{ success: false, error: { code: 'ERROR_CODE', message: 'Human readable' } }`

2. **Security Requirements**:
   - Encrypt TCG Pocket friend IDs (see `src/lib/server/encryption.ts`)
   - Rate limit API endpoints
   - Validate all user inputs
   - Sanitize chat messages
   - Use Kinde's permission system

3. **Image Handling**: User uploads to S3, use Cloudinary for transformations

4. **Real-time Features**: Implement with Socket.io for chat and trade updates

### Development Priorities
1. Core trading functionality
2. Real-time chat
3. Wonder Pick sharing
4. Reputation system

### Critical Guidelines
- Don't store card images in database - use TCGdx SDK
- Don't expose friend IDs without mutual agreement
- Don't allow unlimited message sending
- Don't trust client-side trade agreements
- Implement connection pooling for Turso
- Follow mobile-first responsive design
- Maintain accessibility standards