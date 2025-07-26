// src/lib/stores/socket.ts
import { writable } from 'svelte/store';
import { io, type Socket } from 'socket.io-client';
import { browser } from '$app/environment';

export const socket = writable<Socket | null>(null);
export const isConnected = writable(false);
export const messages = writable<any[]>([]);

export function initializeSocket(userId: string) {
    if (!browser) return;

    const socketInstance = io('http://localhost:5173', {
        auth: {
            userId
        }
    });

    socketInstance.on('connect', () => {
        console.log('Connected to Socket.io server');
        isConnected.set(true);
    });

    socketInstance.on('disconnect', () => {
        console.log('Disconnected from Socket.io server');
        isConnected.set(false);
    });

    socketInstance.on('message:receive', (message) => {
        messages.update(msgs => [...msgs, message]);
    });

    socketInstance.on('listing:new', (listing) => {
        // Handle new listing notifications
        console.log('New listing:', listing);
    });

    socketInstance.on('trade:propose', (trade) => {
        // Handle trade proposals
        console.log('Trade proposed:', trade);
    });

    socketInstance.on('wonderpick:share', (wonderPick) => {
        // Handle new Wonder Pick shares
        console.log('New Wonder Pick:', wonderPick);
    });

    socket.set(socketInstance);

    return socketInstance;
}

export function disconnectSocket() {
    socket.update(s => {
        if (s) {
            s.disconnect();
        }
        return null;
    });
    isConnected.set(false);
}
