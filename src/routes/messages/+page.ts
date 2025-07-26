import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
    try {
        const response = await fetch('/api/conversations');
        if (response.ok) {
            const result = await response.json();
            return {
                conversations: result.success ? result.data : []
            };
        }
    } catch (error) {
        console.error('Failed to load conversations:', error);
    }

    return {
        conversations: []
    };
};
