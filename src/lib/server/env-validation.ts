// src/lib/server/env-validation.ts
import {
    KINDE_DOMAIN,
    KINDE_CLIENT_ID,
    KINDE_CLIENT_SECRET,
    KINDE_REDIRECT_URI,
    ENCRYPTION_KEY
} from '$env/static/private';

export function validateEnvironment() {
    const errors: string[] = [];

    if (!KINDE_DOMAIN || KINDE_DOMAIN === 'https://your-domain.kinde.com') {
        errors.push('KINDE_DOMAIN is not set or using default value');
    }

    if (!KINDE_CLIENT_ID || KINDE_CLIENT_ID === 'your_kinde_client_id_here') {
        errors.push('KINDE_CLIENT_ID is not set or using default value');
    }

    if (!KINDE_CLIENT_SECRET || KINDE_CLIENT_SECRET === 'your_kinde_client_secret_here') {
        errors.push('KINDE_CLIENT_SECRET is not set or using default value');
    }

    if (!KINDE_REDIRECT_URI) {
        errors.push('KINDE_REDIRECT_URI is not set');
    } else {
        try {
            new URL(KINDE_REDIRECT_URI);
        } catch {
            errors.push('KINDE_REDIRECT_URI is not a valid URL');
        }
    }

    if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length < 32) {
        errors.push('ENCRYPTION_KEY must be at least 32 characters long');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

export function logEnvironmentStatus() {
    const validation = validateEnvironment();

    if (!validation.isValid) {
        console.warn('⚠️  Environment configuration issues detected:');
        validation.errors.forEach(error => console.warn(`   - ${error}`));
        console.warn('   App may not function properly until these are resolved.');
    } else {
        console.log('✅ Environment configuration validated successfully');
    }

    return validation;
}
