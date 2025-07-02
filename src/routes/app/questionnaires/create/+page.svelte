<script lang="ts">
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';

  let { form } = $props();

  type Question = {
    id: number;
    number1: string;
    operator: string;
    number2: string;
    result: string;
  };

  let title = $state('');
  let description = $state('');
  let difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé' = $state('Débutant');
  let examDate = $state('');
  let showTooltip = $state(false);

  // Initialisation de 10 questions vides
  let questions: Question[] = $state(Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    number1: '',
    operator: '',
    number2: '',
    result: ''
  })));

  // Variable dérivée pour l'indicateur de progression
  let validQuestionsCount = $derived(questions.filter(q => validateQuestion(q).isValid).length);

  function isValidDate(dateStr: string): boolean {
    if (!dateStr || dateStr.trim() === '') return false;
    
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return !isNaN(date.getTime()) && date >= today;
  }

  function validateQuestion(question: Question): { isValid: boolean; error: string } {
    const { number1, operator, number2, result } = question;
    
    const fields = [number1, operator, number2, result];
    const xCount = fields.filter(field => field.toLowerCase() === 'x').length;
    
    if (xCount !== 1) {
      return { isValid: false, error: 'Il doit y avoir exactement un "x" par question' };
    }

    const nonXFields = fields.filter(field => field.toLowerCase() !== 'x');
    if (nonXFields.some(field => field.trim() === '')) {
      return { isValid: false, error: 'Tous les champs doivent être remplis' };
    }

    if (operator.toLowerCase() !== 'x' && !['+', '-', '*', '/'].includes(operator.trim())) {
      return { isValid: false, error: 'Opérateur invalide' };
    }

    const numberFields = [
      { value: number1, name: 'Nombre 1' },
      { value: number2, name: 'Nombre 2' },
      { value: result, name: 'Résultat' }
    ];

    for (const field of numberFields) {
      if (field.value.toLowerCase() !== 'x') {
        const trimmedValue = field.value.trim();
        if (trimmedValue === '') {
          return { isValid: false, error: `${field.name} vide` };
        }
        const num = parseFloat(trimmedValue);
        if (isNaN(num)) {
          return { isValid: false, error: `${field.name} n'est pas un nombre valide` };
        }
      }
    }

    return { isValid: true, error: '' };
  }

  let isFormValid = $derived(() => {
    if (!title.trim() || !description.trim()) return false;
    if (!isValidDate(examDate)) return false;
    
    const allQuestionsValid = questions.every(question => {
      const validation = validateQuestion(question);
      return validation.isValid;
    });
    
    return allQuestionsValid;
  });

  function goBack() {
    goto('/app/questionnaires');
  }
</script>

<header>
  <nav>
    <a href="/app/users" class="nav-item">Users</a>
    <a href="/app/questionnaires" class="nav-item active">Questionnaires</a>
    <a href="/app/stats" class="nav-item">Stats</a>
  </nav>
</header>

<main>
  <div class="create-container">
    <div class="create-header">
      <button class="back-btn" onclick={goBack}>
        ← Retour aux questionnaires
      </button>
      <h1>Créer un questionnaire</h1>
    </div>

    <form method="POST" use:enhance class="form-container">
      {#if form?.error}
        <div class="error-message">
          {form.error}
        </div>
      {/if}

      <!-- Configuration générale -->
      <div class="config-section">
        <div class="form-group">
          <label for="title">Titre du questionnaire *</label>
          <input 
            id="title" 
            name="title"
            type="text" 
            bind:value={title}
            placeholder="Ex: Questionnaire de mathématiques niveau débutant"
            required
          >
        </div>

        <div class="form-group">
          <label for="description">Description *</label>
          <textarea 
            id="description" 
            name="description"
            bind:value={description}
            placeholder="Décrivez le contenu et les objectifs de ce questionnaire..."
            rows="3"
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label for="difficulty">Difficulté</label>
          <select id="difficulty" name="difficulty" bind:value={difficulty}>
            <option value="Débutant">Débutant</option>
            <option value="Intermédiaire">Intermédiaire</option>
            <option value="Avancé">Avancé</option>
          </select>
        </div>

        <div class="form-group">
          <label for="exam-date">Date d'examen *</label>
          <input id="exam-date" name="examDate" type="date" bind:value={examDate} required>
        </div>
      </div>

      <!-- Instructions -->
      <div class="instructions">
        <div class="tooltip-container">
          <button 
            type="button" 
            class="info-btn" 
            onmouseenter={() => showTooltip = true}
            onmouseleave={() => showTooltip = false}
          >
            ℹ️ Comment ça marche ?
          </button>
          {#if showTooltip}
            <div class="tooltip">
              <p><strong>Instructions :</strong></p>
              <ul>
                <li>Remplacez la valeur à deviner par "x"</li>
                <li>Une seule valeur "x" par question</li>
                <li>Types de questions :</li>
                <ul>
                  <li><strong>Résultat :</strong> 5 + 3 = x</li>
                  <li><strong>Nombre :</strong> x + 3 = 8</li>
                  <li><strong>Opérateur :</strong> 5 x 3 = 15</li>
                </ul>
              </ul>
            </div>
          {/if}
        </div>
      </div>

      <!-- Tableau des questions -->
      <div class="questions-section">
        <h2>Questions (10 au total)</h2>
        
        <!-- Indicateur de progression -->
        <div class="progress-indicator">
          <div class="progress-bar">
            <div class="progress-fill" style="width: {(validQuestionsCount / 10) * 100}%"></div>
          </div>
          <p class="progress-text">
            {validQuestionsCount}/10 questions valides
            {#if title.trim() && description.trim()}
              • Titre et description ✅
            {:else}
              • Titre et description ❌
            {/if}
            {#if isValidDate(examDate)}
              • Date d'examen ✅
            {:else}
              • Date d'examen ❌
            {/if}
          </p>
        </div>

        <div class="table-wrapper">
          <table class="questions-table">
            <thead>
              <tr>
                <th>N°</th>
                <th>Nombre 1</th>
                <th>Opérateur</th>
                <th>Nombre 2</th>
                <th>=</th>
                <th>Résultat</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {#each questions as question, index}
                {@const validation = validateQuestion(question)}
                <tr class:error={!validation.isValid}>
                  <td>{question.id}</td>
                  <td>
                    <input 
                      type="text" 
                      bind:value={question.number1}
                      placeholder="5 ou x"
                      class:highlight={question.number1 === 'x'}
                    >
                  </td>
                  <td>
                    <input 
                      type="text" 
                      bind:value={question.operator}
                      placeholder="+, -, *, / ou x"
                      class:highlight={question.operator === 'x'}
                      maxlength="1"
                    >
                  </td>
                  <td>
                    <input 
                      type="text" 
                      bind:value={question.number2}
                      placeholder="3 ou x"
                      class:highlight={question.number2 === 'x'}
                    >
                  </td>
                  <td>=</td>
                  <td>
                    <input 
                      type="text" 
                      bind:value={question.result}
                      placeholder="8 ou x"
                      class:highlight={question.result === 'x'}
                    >
                  </td>
                  <td>
                    {#if validation.isValid}
                      <span class="status-valid">✅</span>
                    {:else}
                      <span class="status-error" title={validation.error}>❌</span>
                    {/if}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Champ caché pour les questions -->
      <input type="hidden" name="questions" value={JSON.stringify(questions)}>

      <!-- Bouton de création -->
      <div class="create-action">
        <button 
          type="submit"
          class="create-btn" 
          disabled={!isFormValid}
        >
          Créer le questionnaire
        </button>
        {#if !isFormValid}
          <div class="validation-messages">
            {#if !title.trim() || !description.trim()}
              <p class="validation-message error">
                ⚠️ Veuillez remplir le titre et la description
              </p>
            {/if}
            {#if !isValidDate(examDate)}
              <p class="validation-message error">
                ⚠️ Veuillez sélectionner une date d'examen valide (dans le futur)
              </p>
            {/if}
            {#if title.trim() && description.trim() && examDate && isValidDate(examDate)}
              {@const invalidQuestions = questions.filter(q => !validateQuestion(q).isValid)}
              {#if invalidQuestions.length > 0}
                <p class="validation-message error">
                  ⚠️ {invalidQuestions.length} question(s) invalide(s) : {invalidQuestions.map(q => q.id).join(', ')}
                </p>
              {/if}
            {/if}
          </div>
        {/if}
      </div>
    </form>
  </div>
</main>

<style>
  :global(html, body) {
  height: 100%;
  margin: 0;
  padding: 0;
  background: #f5f8fa !important;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

:global(#app) {
  background: #f5f8fa !important;
  min-height: 100vh;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 64px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(33,84,162,0.04);
  z-index: 100;
}

nav {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 1rem;
  gap: 2rem;
}

.nav-item {
  color: #2154a2;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-bottom: 2.5px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  text-decoration: none;
  font-size: 1.1rem;
  font-family: inherit;
  height: 100%;
  display: flex;
  align-items: center;
}

.nav-item.active {
  border-bottom-color: #2154a2;
}

.nav-item:hover {
  background: rgba(33, 84, 162, 0.05);
}

main {
  background: #f5f8fa;
  min-height: 100vh;
  padding-top: 96px;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 2rem;
}

.create-container {
  max-width: 1200px;
  margin: 0 auto;
  background: transparent;
}

.create-header {
  margin-bottom: 2rem;
}

.back-btn {
  background: #f8f9fa;
  border: 1px solid #e3eaf6;
  color: #2154a2;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
  margin-bottom: 1rem;
}

.back-btn:hover {
  background: #e9ecef;
  border-color: #2154a2;
}

.create-header h1 {
  margin: 0;
  color: #2154a2;
  font-size: 2rem;
  font-weight: 600;
}

.form-container {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(33,84,162,0.08);
  padding: 2rem;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border: 1px solid #f5c6cb;
}

.config-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e3eaf6;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
}

.form-group select,
.form-group input {
  padding: 0.75rem;
  border: 1px solid #e3eaf6;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #e3eaf6;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: border-color 0.2s;
  font-family: inherit;
  resize: vertical;
}

.form-group select:focus,
.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #2154a2;
  box-shadow: 0 0 0 2px rgba(33, 84, 162, 0.1);
}

.instructions {
  margin-bottom: 2rem;
}

.tooltip-container {
  position: relative;
  display: inline-block;
}

.info-btn {
  background: #e8f4fd;
  border: 1px solid #2154a2;
  color: #2154a2;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.info-btn:hover {
  background: #d1ecf1;
}

.tooltip {
  position: absolute;
  top: 100%;
  left: 0;
  background: #2c3e50;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 1000;
  min-width: 300px;
  margin-top: 0.5rem;
}

.tooltip p {
  margin: 0 0 0.5rem 0;
}

.tooltip ul {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.tooltip li {
  margin: 0.25rem 0;
}

.questions-section h2 {
  color: #2154a2;
  margin-bottom: 1rem;
}

.progress-indicator {
  margin-bottom: 1.5rem;
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #28a745, #20c997);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.9rem;
  color: #6c757d;
  margin: 0;
}

.table-wrapper {
  overflow-x: auto;
  margin-bottom: 2rem;
}

.questions-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.questions-table th {
  background: #2154a2;
  color: white;
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
}

.questions-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e3eaf6;
  vertical-align: middle;
}

.questions-table tr.error {
  background: #fff5f5;
}

.questions-table input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e3eaf6;
  border-radius: 4px;
  font-size: 0.9rem;
  background: #fff;
  color: #2c3e50;
}

.questions-table input.highlight {
  background: #fff3cd;
  border-color: #ffc107;
  font-weight: bold;
  color: #856404;
}

.questions-table input::placeholder {
  color: #adb5bd;
  font-style: italic;
}

.questions-table input:not(.highlight) {
  background: #fff;
  color: #2c3e50;
}

.questions-table tr.error input {
  border-color: #dc3545;
  background: #fff5f5;
}

.questions-table tr.error input.highlight {
  background: #fff3cd;
  border-color: #ffc107;
}

.status-valid {
  color: #28a745;
  font-size: 1.2rem;
}

.status-error {
  color: #dc3545;
  font-size: 1.2rem;
  cursor: help;
}

.create-action {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #e3eaf6;
}

.create-btn {
  background: #28a745;
  border: none;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.2s;
}

.create-btn:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.create-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.validation-messages {
  margin-top: 1rem;
}

.validation-message {
  color: #dc3545;
  font-size: 0.9rem;
  margin: 0.5rem 0;
}

.validation-message.error {
  color: #dc3545;
}

@media (max-width: 768px) {
  .config-section {
    grid-template-columns: 1fr;
  }

  .tooltip {
    min-width: 250px;
  }

  .questions-table {
    font-size: 0.8rem;
  }

  .questions-table th,
  .questions-table td {
    padding: 0.5rem;
  }

  .create-container {
    max-width: 100%;
  }

  .form-container {
    padding: 1.5rem;
  }

  .create-header h1 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .progress-indicator {
    font-size: 0.8rem;
  }

  .questions-table th,
  .questions-table td {
    padding: 0.25rem;
  }

  .questions-table input {
    padding: 0.25rem;
    font-size: 0.8rem;
  }
}

  
  .form-group textarea {
    padding: 0.75rem;
    border: 1px solid #e3eaf6;
    border-radius: 8px;
    font-size: 0.9rem;
    transition: border-color 0.2s;
    font-family: inherit;
    resize: vertical;
  }

  .form-group textarea:focus {
    outline: none;
    border-color: #2154a2;
    box-shadow: 0 0 0 2px rgba(33, 84, 162, 0.1);
  }

  .error-message {
    background: #f8d7da;
    color: #721c24;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    border: 1px solid #f5c6cb;
  }
</style>
