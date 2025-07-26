import type { Config } from 'drizzle-kit';

export default {
    schema: './src/lib/server/db/schemas/*',
    out: './drizzle',
    dialect: 'turso',
    dbCredentials: {
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN!,
    },
} as Config;
