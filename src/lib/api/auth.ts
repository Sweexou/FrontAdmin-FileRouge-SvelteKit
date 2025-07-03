import { API_BASE_URL } from '$env/static/private';

const authService = {
  login: async (identifier: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ identifier, password })
    });

    const data = await response.json();
    console.log('Status:', response.status, 'Data:', data); // <-- Ajoute ce log

    if (!response.ok) {
      throw new Error('Login failed');
    }
    return data;
  }
};
console.log('API URL:', `${API_BASE_URL}/api/Auth/login`);

export default authService;
