import { questionnaireService } from '$lib/api/questionnaire';

function mapLevelToText(level: number | string): string {
  if (typeof level === 'string') return level; // Si c'est déjà du texte, on le garde
  
  switch (level) {
    case 0:
      return 'Débutant';
    case 1:
      return 'Intermédiaire';
    case 2:
      return 'Avancé';
    case 3:
      return 'Expert';
    default:
      return 'Débutant'; // Valeur par défaut
  }
}

export const load = async ({ locals }) => {
  const token = locals.token;
  const rawQuestionnaires = await questionnaireService.getQuestionnaires(token);

  // Adapter les champs pour la page Svelte
  const questionnaires = rawQuestionnaires.map((q) => ({
    uuid: q.id,
    title: q.title || 'Sans titre',
    creation: q.createdAt.split('T')[0],
    niveau: mapLevelToText(q.level), // Utiliser la fonction de mapping
    dateExam: q.examDate ? q.examDate.split('T')[0] : q.createdAt.split('T')[0]
  }));

  return { questionnaires };
};
