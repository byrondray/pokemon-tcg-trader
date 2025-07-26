// src/lib/server/db/schema.ts
import { sqliteTable, text, integer, real, index, primaryKey } from 'drizzle-orm/sqlite-core';
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
    cardId: text('card_id').notNull(), // TCGdex card ID
    quantity: integer('quantity').default(1),
}, (table) => ({
    pk: primaryKey({ columns: [table.listingId, table.cardId] }),
}));

export const listingOffers = sqliteTable('listing_offers', {
    listingId: text('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
    cardId: text('card_id').notNull(), // TCGdex card ID
    quantity: integer('quantity').default(1),
}, (table) => ({
    pk: primaryKey({ columns: [table.listingId, table.cardId] }),
}));

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

export const tradeAgreements = sqliteTable('trade_agreements', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    conversationId: text('conversation_id').notNull().references(() => conversations.id),
    proposerId: text('proposer_id').notNull().references(() => users.id),
    agreedByProposer: integer('agreed_by_proposer', { mode: 'boolean' }).default(false),
    agreedByRecipient: integer('agreed_by_recipient', { mode: 'boolean' }).default(false),
    completedAt: integer('completed_at', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

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

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
    listings: many(listings),
    sentMessages: many(messages),
    initiatedConversations: many(conversations),
    wonderPicks: many(wonderPicks),
}));

export const listingsRelations = relations(listings, ({ one, many }) => ({
    user: one(users, {
        fields: [listings.userId],
        references: [users.id],
    }),
    wants: many(listingWants),
    offers: many(listingOffers),
    conversations: many(conversations),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
    listing: one(listings, {
        fields: [conversations.listingId],
        references: [listings.id],
    }),
    initiator: one(users, {
        fields: [conversations.initiatorId],
        references: [users.id],
    }),
    recipient: one(users, {
        fields: [conversations.recipientId],
        references: [users.id],
    }),
    messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
    conversation: one(conversations, {
        fields: [messages.conversationId],
        references: [conversations.id],
    }),
    sender: one(users, {
        fields: [messages.senderId],
        references: [users.id],
    }),
}));

export const listingWantsRelations = relations(listingWants, ({ one }) => ({
    listing: one(listings, {
        fields: [listingWants.listingId],
        references: [listings.id],
    }),
}));

export const listingOffersRelations = relations(listingOffers, ({ one }) => ({
    listing: one(listings, {
        fields: [listingOffers.listingId],
        references: [listings.id],
    }),
}));

export const tradeAgreementsRelations = relations(tradeAgreements, ({ one }) => ({
    conversation: one(conversations, {
        fields: [tradeAgreements.conversationId],
        references: [conversations.id],
    }),
    proposer: one(users, {
        fields: [tradeAgreements.proposerId],
        references: [users.id],
    }),
}));

export const wonderPicksRelations = relations(wonderPicks, ({ one }) => ({
    user: one(users, {
        fields: [wonderPicks.userId],
        references: [users.id],
    }),
}));

export const feedbackRelations = relations(feedback, ({ one }) => ({
    tradeAgreement: one(tradeAgreements, {
        fields: [feedback.tradeAgreementId],
        references: [tradeAgreements.id],
    }),
    reviewer: one(users, {
        fields: [feedback.reviewerId],
        references: [users.id],
    }),
    reviewedUser: one(users, {
        fields: [feedback.reviewedUserId],
        references: [users.id],
    }),
}));
