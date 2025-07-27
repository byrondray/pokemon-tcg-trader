import type { PageLoad } from './$types';

export const prerender = false;

export const load: PageLoad = async ({ fetch }) => {
    try {
        // Fetch recent listings and Wonder Picks in parallel for better performance
        const [listingsResponse, wonderPicksResponse] = await Promise.all([
            fetch('/api/listings?limit=6'),
            fetch('/api/wonder-picks?limit=4')
        ]);

        let recentListings: any[] = [];
        if (listingsResponse.ok) {
            const listingsData = await listingsResponse.json();
            if (listingsData.success) {
                recentListings = listingsData.data.listings || [];
            }
        }

        let recentWonderPicks: any[] = [];
        if (wonderPicksResponse.ok) {
            const wonderPicksData = await wonderPicksResponse.json();
            if (wonderPicksData.success) {
                recentWonderPicks = wonderPicksData.data.wonderPicks || [];
            }
        }

        return {
            recentListings,
            recentWonderPicks
        };
    } catch (error) {
        console.error('Error loading home page data:', error);
        // Return empty arrays instead of throwing error for better UX
        return {
            recentListings: [],
            recentWonderPicks: []
        };
    }
};
