// src/lib/server/db/schemas/trades.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { users } from './users';
import { conversations } from './conversations';

export const tradeAgreements = sqliteTable('trade_agreements', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    conversationId: text('conversation_id').notNull().references(() => conversations.id),
    proposerId: text('proposer_id').notNull().references(() => users.id),
    agreedByProposer: integer('agreed_by_proposer', { mode: 'boolean' }).default(false),
    agreedByRecipient: integer('agreed_by_recipient', { mode: 'boolean' }).default(false),
    completedAt: integer('completed_at', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export type TradeAgreement = typeof tradeAgreements.$inferSelect;
export type NewTradeAgreement = typeof tradeAgreements.$inferInsert;
