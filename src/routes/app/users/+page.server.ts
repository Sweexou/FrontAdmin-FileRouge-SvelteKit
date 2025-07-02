import { userService } from '$lib/api/user';

export const load = async ({ locals }) => {
  const token = locals.token;
  const rawUsers = await userService.getUsers(token);

  // On adapte les champs pour correspondre à ce que la page attend
  const users = rawUsers.map((u, i) => ({
    uuid: u.id,
    classement: i + 1,
    name: u.userName,
    creation: u.createdAt.split('T')[0],
    score: u.score
  }));

  return { users };
};
