import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
    try {
        // For now, return empty array since we haven't implemented the database queries yet
        // In a real implementation, this would query the database for conversations

        return json({
            success: true,
            data: []
        });
    } catch (error) {
        console.error('Failed to fetch conversations:', error);
        return json({
            success: false,
            error: {
                code: 'FETCH_ERROR',
                message: 'Failed to fetch conversations'
            }
        }, { status: 500 });
    }
};
