import { API_BASE_URL } from '$env/static/private';

export const userStatsService = {
  getUsers: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/User`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return response.json();
  }
};
