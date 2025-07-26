// src/lib/server/db/schemas/users.ts
import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const users = sqliteTable('users', {
    id: text('id').primaryKey(), // Kinde user ID
    username: text('username').notNull().unique(),
    tcgPocketId: text('tcg_pocket_id'), // Encrypted
    avatarUrl: text('avatar_url'),
    reputationScore: real('reputation_score').default(0),
    totalTrades: integer('total_trades').default(0),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    lastActive: integer('last_active', { mode: 'timestamp' }),
}, (table) => ({
    usernameIdx: index('username_idx').on(table.username),
}));

// Relations will be defined in a separate relations file
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
