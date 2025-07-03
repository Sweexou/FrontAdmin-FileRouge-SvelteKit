import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Récupère le cookie de session
  const sessionCookie = event.cookies.get('session');
  
  if (sessionCookie) {
    event.locals.token = sessionCookie;
  }

  // Routes qui ne nécessitent pas d'authentification
  const publicRoutes = ['/login'];
  
  // Routes protégées
  const isProtectedRoute = event.url.pathname.startsWith('/app');
  
  // Redirection vers /login si pas connecté et route protégée
  if (!sessionCookie && isProtectedRoute) {
    throw redirect(303, '/login');
  }
  
  // Redirection vers /app/users si connecté et sur /login
  if (sessionCookie && event.url.pathname === '/login') {
    throw redirect(303, '/app/users');
  }

  // Redirection de la racine
  if (event.url.pathname === '/') {
    throw redirect(303, sessionCookie ? '/app/users' : '/login');
  }

  return await resolve(event);
};
