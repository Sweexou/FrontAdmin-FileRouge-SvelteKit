import { API_BASE_URL } from '$env/static/private';

export const questionnaireService = {
  getQuestionnaires: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/Questionnaire`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch questionnaires');
    }

    return response.json();
  },

  createQuestionnaire: async (token: string, questionnaire: any) => {
    const response = await fetch(`${API_BASE_URL}/api/Questionnaire`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(questionnaire)
    });

    if (!response.ok) {
      throw new Error('Failed to create questionnaire');
    }

    return response.json();
  }
};
