import { userStatsService } from '$lib/api/userStats';
import { error } from '@sveltejs/kit';

export const load = async ({ locals }) => {
  const token = locals.token;
  if (!token) {
    throw error(401, 'Unauthorized');
  }

  const users = await userStatsService.getUsers(token);

  // Calcul des statistiques basées uniquement sur les données API
  const totalUsers = users.length;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const recentlyConnectedUsers = users.filter((user: any) => {
    if (!user.lastConnection) return false;
    return new Date(user.lastConnection) >= oneWeekAgo;
  }).length;

  const averageScore = totalUsers === 0 ? 0 : Math.round(users.reduce((sum: number, user: any) => sum + (user.score || 0), 0) / totalUsers * 100) / 100;

  const scores = users.map((user: any) => user.score || 0).filter(score => score > 0);
  const sortedScores = scores.sort((a: number, b: number) => a - b);
  let medianScore = 0;
  if (sortedScores.length > 0) {
    const middle = Math.floor(sortedScores.length / 2);
    medianScore = sortedScores.length % 2 === 0 ? (sortedScores[middle - 1] + sortedScores[middle]) / 2 : sortedScores[middle];
  }

  const activityRate = totalUsers === 0 ? 0 : Math.round((recentlyConnectedUsers / totalUsers) * 100);

  return {
    totalUsers,
    recentlyConnectedUsers,
    averageScore,
    medianScore,
    activityRate
  };
};
