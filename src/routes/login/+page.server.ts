import { redirect, fail } from '@sveltejs/kit';
import authService from '$lib/api/auth';

export const actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const identifier = formData.get('identifier');
    const password = formData.get('password');

    let token: string | undefined;
    try {
      const result = await authService.login(identifier, password);
      token = result?.token;
    } catch (error) {
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

    throw redirect(303, '/app/users');
  }
};
