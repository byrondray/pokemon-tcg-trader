# Pokemon TCG Pocket Tr## Key Implementation Patterns

1. **Turso Database Connection**: Use @libsql/client with drizzle-orm/libsql
2. **Kinde Authentication**: Use @kinde-oss/kinde-auth-sveltekit with handleAuth
3. **TCGdx Integration**: Always use the SDK for card data, never store card content
4. **Image Handling**: User uploads go to S3, use Cloudinary for transformation
5. **WebSocket Events**: Implement real-time features with Socket.io
6. **SvelteKit Data Loading Pattern**: Always follow the proper data flow:
   - **API Routes** (`+server.ts`): Define all API endpoints with proper handlers
   - **Load Functions** (`+page.ts` or `+page.server.ts`): Use SvelteKit's special `fetch` to call internal API routes
   - **Components** (`+page.svelte`): Receive data as props from load functions
   - **Exception**: `onMount` with `fetch` is only acceptable for:
     - Global authentication state in `+layout.svelte`
     - Real-time updates (WebSocket connections)
     - User interactions (form submissions, button clicks)
   - **Never use `onMount` with `fetch`** for initial page data loading

## SvelteKit Data Loading Rules

**✅ CORRECT Pattern:**

```typescript
// +server.ts - API endpoint
export const GET: RequestHandler = async ({ url }) => {
  const data = await db.query();
  return json({ success: true, data });
};

// +page.ts - Load function
export const load: PageLoad = async ({ fetch }) => {
  const response = await fetch('/api/endpoint');
  const result = await response.json();
  return { data: result.data };
};

// +page.svelte - Component
export let data: PageData;
```

**❌ INCORRECT Pattern:**

```svelte
<!-- DON'T DO THIS -->
<script>
  import { onMount } from 'svelte';
  let data = [];

  onMount(async () => {
    const response = await fetch('/api/endpoint');
    data = await response.json();
  });
</script>
```

**Key Benefits of Correct Pattern:**

- Server-side rendering (SSR) support
- Better SEO and performance
- No loading states needed
- Proper error handling
- Type safety with generated typespp - Development Assistant

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

You are helping build a Pokemon TCG Pocket trading and Wonder Pick sharing web application.

## Project Context

This is a SvelteKit application that facilitates trading between Pokemon TCG Pocket players. Users can list cards they want, optionally list cards for trade, chat with potential traders, and share Wonder Pick opportunities.

## Tech Stack Knowledge

- **SvelteKit**: Full-stack framework with file-based routing
- **Turso**: Edge SQLite database with @libsql/client
- **Drizzle ORM**: Type-safe ORM with schema-first approach
- **Kinde**: Authentication service with @kinde-oss/kinde-auth-sveltekit
- **Socket.io**: WebSocket library for real-time chat
- **TCGdex SDK**: @tcgdex/sdk for Pokemon card data
- **AWS S3**: For image storage
- **Cloudinary**: For image optimization and transformation
- **Shadcn**: For UI library and interface for app
- **Tailwind**: Style the app with tailwind instead of css

## Key Implementation Patterns

1. **Turso Database Connection**: Use @libsql/client with drizzle-orm/libsql
2. **Kinde Authentication**: Use @kinde-oss/kinde-auth-sveltekit with handleAuth
3. **TCGdex Integration**: Always use the SDK for card data, never store card content
4. **Image Handling**: User uploads go to S3, use Cloudinary for transformation
5. **WebSocket Events**: Implement real-time features with Socket.io

## Security Requirements

- Encrypt TCG Pocket friend IDs
- Rate limit API endpoints
- Validate all user inputs
- Sanitize chat messages
- Implement CORS properly
- Use Kinde's permission system

## API Response Patterns

Always return consistent responses:

```typescript
// Success
{ success: true, data: {...} }

// Error
{ success: false, error: { code: 'ERROR_CODE', message: 'Human readable' } }
```

## Development Priorities

1. Core trading functionality first
2. Real-time chat second
3. Wonder Pick sharing third
4. Reputation system fourth

## Common Pitfalls to Avoid

- Don't store card images in database
- Don't expose friend IDs without mutual agreement
- Don't allow unlimited message sending
- Don't trust client-side trade agreements
- Don't forget to implement connection pooling for Turso
- **Don't use `onMount` with `fetch` for initial page data** - Use load functions instead
- **Exception**: `onMount` + `fetch` is acceptable for global auth state, real-time updates, or user interactions
- **Don't make external API calls in components** - Use `+server.ts` and load functions
- **Don't skip the API layer** - Always use `+server.ts` for database operations
- **Don't use `any` types** - Define proper TypeScript interfaces for API responses
- **Don't forget `export const prerender = false`** for authenticated routes

When asked to implement features, always consider:

- Type safety with TypeScript
- Database query optimization
- Real-time synchronization
- Mobile responsiveness
- Accessibility standards
- **Proper SvelteKit data loading patterns** (load functions + API routes)
- **Server-side rendering compatibility**
- **Error handling in load functions**
- **Parallel data fetching with Promise.all() when possible**

## File Structure Patterns

### Pages with Data:

```
src/routes/example/
├── +page.svelte          # Component (receives data prop)
├── +page.ts              # Load function (calls API)
└── +server.ts            # API endpoint (database operations)
```

### API-Only Routes:

```
src/routes/api/example/
└── +server.ts            # API handlers (GET, POST, etc.)
```

### Type Safety:

- Always import `PageData` types: `import type { PageData } from './$types';`
- Define interfaces for API responses
- Use `RequestHandler` type for API routes
- Use `PageLoad` or `PageServerLoad` for load functions
