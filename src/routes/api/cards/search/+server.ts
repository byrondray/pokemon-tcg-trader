// src/routes/api/cards/search/+server.ts
import { json } from '@sveltejs/kit';
import { searchCards } from '$lib/server/tcgdx';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
    try {
        const name = url.searchParams.get('name') || undefined;
        const set = url.searchParams.get('set') || undefined;
        const types = url.searchParams.get('types')?.split(',') || undefined;
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const limit = parseInt(url.searchParams.get('limit') || '20', 10);

        const result = await searchCards({
            name,
            set,
            types,
            page,
            limit
        });

        return json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error in card search API:', error);
        return json({
            success: false,
            error: {
                code: 'SEARCH_FAILED',
                message: 'Failed to search cards'
            }
        }, { status: 500 });
    }
};
