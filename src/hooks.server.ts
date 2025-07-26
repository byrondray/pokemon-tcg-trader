// src/hooks.server.ts
import { handleAuth } from '@kinde-oss/kinde-auth-sveltekit';
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';

const authHandle: Handle = handleAuth;

const customHandle: Handle = async ({ event, resolve }) => {
    // Add custom logic here if needed
    return resolve(event);
};

export const handle = sequence(authHandle, customHandle);
