// src/lib/server/db/schemas/relations.ts
import { relations } from 'drizzle-orm';
import { users } from './users.js';
import { listings, listingWants, listingOffers } from './listings.js';
import { conversations, messages } from './conversations.js';
import { tradeAgreements } from './trades.js';
import { wonderPicks } from './wonder-picks.js';
import { feedback } from './feedback.js';

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
