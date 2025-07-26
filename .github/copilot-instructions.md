# Pokemon TCG Pocket Trading App - Development Assistant

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

When asked to implement features, always consider:

- Type safety with TypeScript
- Database query optimization
- Real-time synchronization
- Mobile responsiveness
- Accessibility standards
