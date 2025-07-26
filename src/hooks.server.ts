// src/hooks.server.ts
import { handleAuth } from '@kinde-oss/kinde-auth-sveltekit';
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';

const authHandle: Handle = async ({ event, resolve }) => {
    try {
        // Only handle auth for auth-related routes
        if (event.url.pathname.startsWith('/api/auth/')) {
            const authResponse = await handleAuth(event);
            if (authResponse) return authResponse;
        }
    } catch (error) {
        console.warn('Auth handling error:', error);
        // Continue without auth in development
    }
    return resolve(event);
};

const customHandle: Handle = async ({ event, resolve }) => {
    // Add custom logic here if needed
    return resolve(event);
};

export const handle = sequence(authHandle, customHandle);
