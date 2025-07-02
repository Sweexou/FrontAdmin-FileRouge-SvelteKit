import { questionnaireService } from '$lib/api/questionnaire';
import { error, redirect } from '@sveltejs/kit';

function mapTextToLevel(difficulty: string): number {
  switch (difficulty) {
    case 'Débutant':
      return 0;
    case 'Intermédiaire':
      return 1;
    case 'Avancé':
      return 2;
    case 'Expert':
      return 3;
    default:
      return 0;
  }
}

export const actions = {
  default: async ({ locals, request }) => {
    const token = locals.token;
    if (!token) {
      throw error(401, 'Unauthorized');
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const difficulty = formData.get('difficulty') as string;
    const examDate = formData.get('examDate') as string;
    const questionsData = formData.get('questions') as string;

    try {
      const questions = JSON.parse(questionsData);
      
      const questionnaire = {
        title,
        description,
        level: mapTextToLevel(difficulty), // Convertir en nombre
        examDate,
        questions: questions.map((q: any) => ({
          number1: q.number1,
          operator: q.operator,
          number2: q.number2,
          result: q.result
        }))
      };

      await questionnaireService.createQuestionnaire(token, questionnaire);
      throw redirect(303, '/app/questionnaires');
    } catch (err) {
      return {
        error: 'Failed to create questionnaire'
      };
    }
  }
};
