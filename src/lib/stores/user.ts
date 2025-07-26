// src/lib/stores/user.ts
import { writable } from 'svelte/store';

export interface User {
    id: string;
    username: string;
    tcgPocketId?: string;
    avatarUrl?: string;
    reputationScore: number;
    totalTrades: number;
}

export const currentUser = writable<User | null>(null);
export const isAuthenticated = writable(false);
