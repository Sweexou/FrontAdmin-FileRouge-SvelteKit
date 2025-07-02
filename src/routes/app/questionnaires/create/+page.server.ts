import { questionnaireService } from '$lib/api/questionnaire';
import { error, redirect } from '@sveltejs/kit';

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

    console.log('Form data received:', { title, description, difficulty, examDate });

    try {
      const questions = JSON.parse(questionsData);
      console.log('Questions parsed:', questions);
      
      const questionnaire = {
        title,
        description,
        level: difficulty, // Garde le texte ou utilise mapTextToLevel() si nécessaire
        examDate,
        questions: questions.map((q: any) => ({
          number1: q.number1,
          operator: q.operator,
          number2: q.number2,
          result: q.result
        }))
      };

      console.log('Questionnaire to send:', questionnaire);
      
      const result = await questionnaireService.createQuestionnaire(token, questionnaire);
      console.log('API response:', result);
      
      
    } catch (err) {
      console.error('Error creating questionnaire:', err);
      return {
        error: `Failed to create questionnaire: ${err.message}`
      };
    }
    throw redirect(303, '/app/questionnaires');
  }
};
