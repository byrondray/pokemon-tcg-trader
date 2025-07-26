// src/lib/server/tcgdx.ts
import TCGdx from '@tcgdex/sdk';

// Initialize TCGdx with English language
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

        let cards: any[] = [];

        if (set) {
            // If searching by set, get cards from that specific set
            const setCards = await tcgdx.fetch('sets', set, 'cards');
            cards = Array.isArray(setCards) ? setCards : [];
        } else {
            // Otherwise, get all cards
            const allCards = await tcgdx.fetch('cards');
            cards = Array.isArray(allCards) ? allCards : [];
        }

        // Filter by name if provided
        if (name && cards.length > 0) {
            cards = cards.filter((card: any) =>
                card.name && card.name.toLowerCase().includes(name.toLowerCase())
            );
        }

        // Filter by types if provided  
        if (types && types.length > 0 && cards.length > 0) {
            cards = cards.filter((card: any) =>
                card.types?.some((type: any) => types.includes(type))
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
} export async function getCardById(cardId: string) {
    try {
        return await tcgdx.fetch('cards', cardId);
    } catch (error) {
        console.error('Error fetching card:', error);
        throw new Error('Failed to fetch card');
    }
}

export async function getSets() {
    try {
        return await tcgdx.fetch('sets');
    } catch (error) {
        console.error('Error fetching sets:', error);
        throw new Error('Failed to fetch sets');
    }
}

export async function getTypes() {
    try {
        return await tcgdx.fetch('types');
    } catch (error) {
        console.error('Error fetching types:', error);
        throw new Error('Failed to fetch types');
    }
}

export async function getSetById(setId: string) {
    try {
        return await tcgdx.fetch('sets', setId);
    } catch (error) {
        console.error('Error fetching set:', error);
        throw new Error('Failed to fetch set');
    }
}

export async function getCardsFromSet(setId: string) {
    try {
        return await tcgdx.fetch('sets', setId, 'cards');
    } catch (error) {
        console.error('Error fetching cards from set:', error);
        throw new Error('Failed to fetch cards from set');
    }
}
