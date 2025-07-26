// src/lib/server/db/schemas/wonder-picks.ts
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { users } from './users.js';

export const wonderPicks = sqliteTable('wonder_picks', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id').notNull().references(() => users.id),
    cardIds: text('card_ids').notNull(), // JSON array
    imageUrl: text('image_url'), // S3/Cloudinary URL
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
    expiresIdx: index('wonder_expires_idx').on(table.expiresAt),
}));

export type WonderPick = typeof wonderPicks.$inferSelect;
export type NewWonderPick = typeof wonderPicks.$inferInsert;
