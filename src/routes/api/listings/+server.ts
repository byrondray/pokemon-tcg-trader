// src/routes/api/listings/+server.ts
import { json } from '@sveltejs/kit';
import { kindeAuthClient, type SessionManager } from '@kinde-oss/kinde-auth-sveltekit';
import { db } from '$lib/server/db';
import { listings, listingWants, listingOffers } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, request }) => {
    try {
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '20');
        const offset = (page - 1) * limit;

        const allListings = await db
            .select()
            .from(listings)
            .where(eq(listings.status, 'active'))
            .orderBy(desc(listings.createdAt))
            .limit(limit)
            .offset(offset);

        // Get wants and offers for each listing
        const listingsWithDetails = await Promise.all(
            allListings.map(async (listing) => {
                const wants = await db
                    .select()
                    .from(listingWants)
                    .where(eq(listingWants.listingId, listing.id));

                const offers = await db
                    .select()
                    .from(listingOffers)
                    .where(eq(listingOffers.listingId, listing.id));

                return {
                    ...listing,
                    wants,
                    offers
                };
            })
        );

        return json({
            success: true,
            data: {
                listings: listingsWithDetails,
                page,
                hasMore: allListings.length === limit
            }
        });
    } catch (error) {
        console.error('Error fetching listings:', error);
        return json({
            success: false,
            error: {
                code: 'FETCH_FAILED',
                message: 'Failed to fetch listings'
            }
        }, { status: 500 });
    }
};

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const sessionManager: SessionManager = {
            getSessionItem: (key: string) => Promise.resolve(cookies.get(key)),
            setSessionItem: <T>(key: string, value: T) => Promise.resolve(cookies.set(key, JSON.stringify(value), { path: '/' })),
            removeSessionItem: (key: string) => Promise.resolve(cookies.delete(key, { path: '/' })),
            destroySession: () => Promise.resolve(cookies.getAll().forEach(cookie => cookies.delete(cookie.name, { path: '/' })))
        };

        const user = await kindeAuthClient.getUser(sessionManager);
        if (!user) {
            return json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Authentication required'
                }
            }, { status: 401 });
        }

        const body = await request.json();
        const { title, description, wants, offers, expiresAt } = body;

        // Validate input
        if (!title || !wants || wants.length === 0) {
            return json({
                success: false,
                error: {
                    code: 'INVALID_INPUT',
                    message: 'Title and at least one wanted card are required'
                }
            }, { status: 400 });
        }

        // Create listing
        const newListing = await db
            .insert(listings)
            .values({
                userId: user.id,
                title,
                description,
                createdAt: new Date(),
                expiresAt: expiresAt ? new Date(expiresAt) : null,
                updatedAt: new Date()
            })
            .returning();

        const listingId = newListing[0].id;

        // Add wanted cards
        if (wants && wants.length > 0) {
            await db.insert(listingWants).values(
                wants.map((want: any) => ({
                    listingId,
                    cardId: want.cardId,
                    quantity: want.quantity || 1
                }))
            );
        }

        // Add offered cards
        if (offers && offers.length > 0) {
            await db.insert(listingOffers).values(
                offers.map((offer: any) => ({
                    listingId,
                    cardId: offer.cardId,
                    quantity: offer.quantity || 1
                }))
            );
        }

        return json({
            success: true,
            data: newListing[0]
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating listing:', error);
        return json({
            success: false,
            error: {
                code: 'CREATE_FAILED',
                message: 'Failed to create listing'
            }
        }, { status: 500 });
    }
};
