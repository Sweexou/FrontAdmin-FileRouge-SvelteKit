import { API_BASE_URL } from '$env/static/private';

export const userDetailService = {
  getUserById: async (token: string, userId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/User/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return response.json();
  },

  deleteUser: async (token: string, userId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/User/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }

    return response.ok;
  }
};
