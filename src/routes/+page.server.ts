import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
  // Redirection côté serveur uniquement
  if (locals.token) {
    throw redirect(303, '/app/users');
  }
  
  throw redirect(303, '/login');
};
