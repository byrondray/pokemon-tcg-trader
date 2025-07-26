import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
    try {
        const response = await fetch('/api/listings');
        if (response.ok) {
            const result = await response.json();
            return {
                listings: result.success ? result.data : []
            };
        }
    } catch (error) {
        console.error('Failed to load listings:', error);
    }

    return {
        listings: []
    };
};
