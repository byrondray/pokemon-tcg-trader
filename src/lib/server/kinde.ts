// src/lib/server/kinde.ts
import { createKindeServerClient, GrantType } from '@kinde-oss/kinde-auth-sveltekit';
import {
    KINDE_CLIENT_ID,
    KINDE_CLIENT_SECRET,
    KINDE_DOMAIN,
    KINDE_REDIRECT_URI,
    KINDE_LOGOUT_REDIRECT_URI
} from '$env/static/private';

export const kindeAuthClient = createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
    authDomain: KINDE_DOMAIN,
    clientId: KINDE_CLIENT_ID,
    clientSecret: KINDE_CLIENT_SECRET,
    redirectURL: KINDE_REDIRECT_URI,
    logoutRedirectURL: KINDE_LOGOUT_REDIRECT_URI
});
