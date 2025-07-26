// src/lib/server/db/schemas/feedback.ts
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { users } from './users.js';
import { tradeAgreements } from './trades.js';

export const feedback = sqliteTable('feedback', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    tradeAgreementId: text('trade_agreement_id').notNull().references(() => tradeAgreements.id),
    reviewerId: text('reviewer_id').notNull().references(() => users.id),
    reviewedUserId: text('reviewed_user_id').notNull().references(() => users.id),
    rating: integer('rating').notNull(), // 1-5
    comment: text('comment'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
    uniqueReview: index('unique_review_idx').on(table.tradeAgreementId, table.reviewerId),
}));

export type Feedback = typeof feedback.$inferSelect;
export type NewFeedback = typeof feedback.$inferInsert;
