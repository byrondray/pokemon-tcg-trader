// src/lib/server/db/schemas/conversations.ts
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { users } from './users.js';
import { listings } from './listings.js';

export const conversations = sqliteTable('conversations', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    listingId: text('listing_id').notNull().references(() => listings.id),
    initiatorId: text('initiator_id').notNull().references(() => users.id),
    recipientId: text('recipient_id').notNull().references(() => users.id),
    status: text('status', { enum: ['open', 'agreed', 'completed', 'cancelled'] }).default('open'),
    lastMessageAt: integer('last_message_at', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
    participantsIdx: index('conv_participants_idx').on(table.initiatorId, table.recipientId),
}));

export const messages = sqliteTable('messages', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    conversationId: text('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
    senderId: text('sender_id').notNull().references(() => users.id),
    content: text('content').notNull(),
    readAt: integer('read_at', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
    conversationIdx: index('msg_conversation_idx').on(table.conversationId),
}));

export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
