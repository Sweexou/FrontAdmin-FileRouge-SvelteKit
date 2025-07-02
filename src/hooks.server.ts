process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Récupère le cookie de session
  const sessionCookie = event.cookies.get('session');
  
  if (sessionCookie) {
    event.locals.token = sessionCookie;
  }

  return await resolve(event);
};