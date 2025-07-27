// src/lib/server/db/schemas/listings.ts
import { sqliteTable, text, integer, index, primaryKey } from 'drizzle-orm/sqlite-core';
import { users } from './users';

export const listings = sqliteTable('listings', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id').notNull().references(() => users.id),
    status: text('status', { enum: ['active', 'pending', 'completed', 'cancelled'] }).default('active'),
    title: text('title'),
    description: text('description'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    expiresAt: integer('expires_at', { mode: 'timestamp' }),
    updatedAt: integer('updated_at', { mode: 'timestamp' }),
}, (table) => ({
    userIdx: index('listing_user_idx').on(table.userId),
    statusIdx: index('listing_status_idx').on(table.status),
}));

export const listingWants = sqliteTable('listing_wants', {
    listingId: text('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
    cardId: text('card_id').notNull(), // TCGdx card ID
    quantity: integer('quantity').default(1),
}, (table) => ({
    pk: primaryKey({ columns: [table.listingId, table.cardId] }),
}));

export const listingOffers = sqliteTable('listing_offers', {
    listingId: text('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
    cardId: text('card_id').notNull(), // TCGdx card ID
    quantity: integer('quantity').default(1),
}, (table) => ({
    pk: primaryKey({ columns: [table.listingId, table.cardId] }),
}));

export type Listing = typeof listings.$inferSelect;
export type NewListing = typeof listings.$inferInsert;
export type ListingWant = typeof listingWants.$inferSelect;
export type NewListingWant = typeof listingWants.$inferInsert;
export type ListingOffer = typeof listingOffers.$inferSelect;
export type NewListingOffer = typeof listingOffers.$inferInsert;
