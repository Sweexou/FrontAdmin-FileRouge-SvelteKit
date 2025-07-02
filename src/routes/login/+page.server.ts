import { redirect, fail } from '@sveltejs/kit';
import authService from '$lib/api/auth';

export const actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const result = await authService.login(email, password);
      const token = result?.token;
    if (!token) {
  return fail(401, { error: 'Identifiants incorrects' });
}

      if (!token) {
        return fail(401, { error: 'Identifiants incorrects' });
      }

      cookies.set('session', token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 60 * 60 * 24
      });

    } catch (error) {
      return fail(401, { error: 'Identifiants incorrects' });
    }
    throw redirect(303, '/app/users');
  }
};
