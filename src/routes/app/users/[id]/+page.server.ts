import { userDetailService } from '$lib/api/userDetail';
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ locals, params }) => {
  const token = locals.token;
  if (!token) {
    throw error(401, 'Unauthorized');
  }

  try {
    const rawUser = await userDetailService.getUserById(token, params.id);
    
    // Adapter les données pour la page
    const user = {
      uuid: rawUser.id,
      classement: rawUser.ranking || 0,
      name: rawUser.userName,
      username: rawUser.userName,
      email: rawUser.email,
      creation: rawUser.createdAt.split('T')[0],
      score: rawUser.score || 0,
      lastConnection: rawUser.lastConnection ? rawUser.lastConnection.split('T')[0] : null
    };

    return { user };
  } catch (err) {
    throw error(404, 'User not found');
  }
};

export const actions = {
  delete: async ({ locals, params }) => {
    const token = locals.token;
    if (!token) {
      throw error(401, 'Unauthorized');
    }

    try {
      await userDetailService.deleteUser(token, params.id);
      throw redirect(303, '/app/users');
    } catch (err) {
      throw error(500, 'Failed to delete user');
    }
  }
};
