import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
    try {
        const response = await fetch('/api/wonder-picks');
        if (response.ok) {
            const result = await response.json();
            return {
                wonderPicks: result.success ? result.data : []
            };
        }
    } catch (error) {
        console.error('Failed to load wonder picks:', error);
    }

    return {
        wonderPicks: []
    };
};
