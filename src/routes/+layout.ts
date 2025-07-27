export const prerender = false;

export async function load({ fetch }) {
    try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
            const userData = await response.json();
            if (userData.success) {
                return {
                    user: userData.data,
                    isAuthenticated: true
                };
            }
        }
    } catch (error) {
        console.error('Failed to check authentication:', error);
    }

    return {
        user: null,
        isAuthenticated: false
    };
};
