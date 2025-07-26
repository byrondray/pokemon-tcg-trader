// src/lib/server/tcgdex.ts
import TCGdex from '@tcgdex/sdk';

// Initialize TCGdex with English language
export const tcgdx = new TCGdx('en');

export interface CardSearchOptions {
    name?: string;
    set?: string;
    types?: string[];
    page?: number;
    limit?: number;
}

export async function searchCards(options: CardSearchOptions) {
    try {
        const { name, set, types, page = 1, limit = 20 } = options;

        // Build search query
        let cards = await tcgdx.fetchCards();

        if (name) {
            cards = cards.filter(card =>
                card.name.toLowerCase().includes(name.toLowerCase())
            );
        }

        if (set) {
            cards = cards.filter(card => card.set?.id === set);
        }

        if (types && types.length > 0) {
            cards = cards.filter(card =>
                card.types?.some(type => types.includes(type))
            );
        }

        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedCards = cards.slice(startIndex, endIndex);

        return {
            cards: paginatedCards,
            total: cards.length,
            page,
            totalPages: Math.ceil(cards.length / limit)
        };
    } catch (error) {
        console.error('Error searching cards:', error);
        throw new Error('Failed to search cards');
    }
}

export async function getCardById(cardId: string) {
    try {
        return await tcgdx.fetchCard(cardId);
    } catch (error) {
        console.error('Error fetching card:', error);
        throw new Error('Failed to fetch card');
    }
}

export async function getSets() {
    try {
        return await tcgdx.fetchSets();
    } catch (error) {
        console.error('Error fetching sets:', error);
        throw new Error('Failed to fetch sets');
    }
}
