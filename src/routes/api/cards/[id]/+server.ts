// src/routes/api/cards/[id]/+server.ts
import { json } from '@sveltejs/kit';
import { getCardById } from '$lib/server/tcgdx';
import type { RequestHandler } from './$types';


export const GET: RequestHandler = async ({ params }) => {
    try {
        const card = await getCardById(params.id);

        return json({
            success: true,
            data: card
        });
    } catch (error) {
        console.error('Error in card detail API:', error);
        return json({
            success: false,
            error: {
                code: 'CARD_NOT_FOUND',
                message: 'Card not found'
            }
        }, { status: 404 });
    }
};
