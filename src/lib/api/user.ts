process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import { API_BASE_URL } from '$env/static/private';

export const userService = {
  getUsers: async (token: string) => {
    console.log('Fetching users from:', `${API_BASE_URL}/api/User`);
    console.log('Token:', token ? 'Present' : 'Missing');
    const response = await fetch(`${API_BASE_URL}/api/User`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
      
    });
    console.log('Response status:', response.status);

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return response.json();
  }
};
