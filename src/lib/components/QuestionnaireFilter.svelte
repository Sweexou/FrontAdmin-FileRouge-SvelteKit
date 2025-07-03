<script lang="ts">

   interface Props {
    filterUuid?: string;
    filterCreationDateType?: string;
    filterCreationDate?: string;
    filterNiveau?: string;
    filterExamDateType?: string;
    filterExamDate?: string;
    usersPerPage?: number;
    currentPage?: number;
    resultCount?: number;
    totalPages?: number;
    setCurrentPage?: (page: 'users' | 'questionnaires' | 'userDetail' | 'stats' | 'createQuestionnaire') => void;
  }

  let {
    filterUuid = $bindable(''),
    filterCreationDateType = $bindable('any'),
    filterCreationDate = $bindable(''),
    filterNiveau = $bindable('any'),
    filterExamDateType = $bindable('any'),
    filterExamDate = $bindable(''),
    usersPerPage = $bindable(25),
    currentPage = $bindable(1),
    resultCount = 0,
    totalPages = 0,
    setCurrentPage
  }: Props = $props();

  function clearFilters() {
    filterUuid = '';
    filterCreationDateType = 'any';
    filterCreationDate = '';
    filterNiveau = 'any';
    filterExamDateType = 'any';
    filterExamDate = '';
    currentPage = 1;
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
    }
  }

  function nextPage() {
    if (currentPage < totalPages) currentPage++;
  }

  function prevPage() {
    if (currentPage > 1) currentPage--;
  }

  function handleUsersPerPageChange() {
    currentPage = 1;
  }
</script>

<div class="filter-panel">
  <div class="filter-header">
    <h3>Filtres</h3>
    <button class="clear-btn" onclick={clearFilters}>Effacer</button>
  </div>

  <div class="filter-group">
    <label for="uuid-filter">UUID</label>
    <input id="uuid-filter" type="text" bind:value={filterUuid} placeholder="Rechercher par UUID">
  </div>

  <div class="filter-group">
    <label for="creation-date-type">Date de création</label>
    <select id="creation-date-type" bind:value={filterCreationDateType}>
      <option value="any">Toutes</option>
      <option value="before">Avant le</option>
      <option value="after">Après le</option>
    </select>
    {#if filterCreationDateType !== 'any'}
      <input type="date" bind:value={filterCreationDate}>
    {/if}
  </div>

  <div class="filter-group">
    <label for="niveau-filter">Niveau</label>
    <select id="niveau-filter" bind:value={filterNiveau}>
      <option value="any">Tous</option>
      <option value="Débutant">Débutant</option>
      <option value="Intermédiaire">Intermédiaire</option>
      <option value="Avancé">Avancé</option>
    </select>
  </div>

  <div class="filter-group">
    <label for="exam-date-type">Date d'examen</label>
    <select id="exam-date-type" bind:value={filterExamDateType}>
      <option value="any">Toutes</option>
      <option value="before">Avant le</option>
      <option value="after">Après le</option>
    </select>
    {#if filterExamDateType !== 'any'}
      <input type="date" bind:value={filterExamDate}>
    {/if}
  </div>

  <div class="filter-group">
    <label for="users-per-page">Questionnaires par page</label>
    <select id="users-per-page" bind:value={usersPerPage} onchange={handleUsersPerPageChange}>
      <option value={10}>10</option>
      <option value={25}>25</option>
      <option value={50}>50</option>
      <option value={100}>100</option>
    </select>
  </div>

  <div class="pagination">
    <div class="pagination-info">
      Page {currentPage} sur {totalPages}
    </div>
    <div class="pagination-controls">
      <button class="page-btn" onclick={prevPage} disabled={currentPage === 1}>
        ←
      </button>
      <span class="page-numbers">
        {#if totalPages <= 5}
          {#each Array(totalPages) as _, i}
            <button 
              class="page-number" 
              class:active={currentPage === i + 1}
              onclick={() => goToPage(i + 1)}
            >
              {i + 1}
            </button>
          {/each}
        {:else}
          <button 
            class="page-number" 
            class:active={currentPage === 1}
            onclick={() => goToPage(1)}
          >
            1
          </button>
          {#if currentPage > 3}
            <span class="dots">...</span>
          {/if}
          {#if currentPage > 2 && currentPage < totalPages - 1}
            <button 
              class="page-number active"
              onclick={() => goToPage(currentPage)}
            >
              {currentPage}
            </button>
          {/if}
          {#if currentPage < totalPages - 2}
            <span class="dots">...</span>
          {/if}
          <button 
            class="page-number" 
            class:active={currentPage === totalPages}
            onclick={() => goToPage(totalPages)}
          >
            {totalPages}
          </button>
        {/if}
      </span>
      <button class="page-btn" onclick={nextPage} disabled={currentPage === totalPages}>
        →
      </button>
    </div>
  </div>

  <div class="filter-results">
    {resultCount} résultat{resultCount > 1 ? 's' : ''}
  </div>
  <div class="create-section">
  <button class="create-questionnaire-btn" onclick={() => setCurrentPage('createQuestionnaire')} >
    <a href="/app/questionnaires/create" class="create-btn">
    ➕ Créer un questionnaire
    </a>
  </button>
</div>
</div>

<style>
  .create-btn {
    text-decoration: none;
    color: white;
  }
  .filter-panel {
    width: 280px;
    background: #fff;
    padding: 1.5rem;
    border-left: 1px solid #e3eaf6;
    box-shadow: 0 4px 24px rgba(33,84,162,0.08);
    border-radius: 0 12px 12px 0;
    min-height: fit-content;
  }

  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e3eaf6;
  }

  .filter-header h3 {
    margin: 0;
    color: #2154a2;
    font-weight: 600;
    font-size: 1.1rem;
  }

  .clear-btn {
    background: #f8f9fa;
    border: 1px solid #e3eaf6;
    color: #6c757d;
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.2s;
  }

  .clear-btn:hover {
    background: #e9ecef;
    border-color: #2154a2;
    color: #2154a2;
  }

  .filter-group {
    margin-bottom: 1.5rem;
  }

  .filter-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #2c3e50;
    font-size: 0.9rem;
  }

  .filter-group input,
  .filter-group select {
    width: 100%;
    padding: 0.6rem;
    border: 1px solid #e3eaf6;
    border-radius: 6px;
    background: #fff;
    color: #2c3e50;
    font-size: 0.9rem;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .filter-group input:focus,
  .filter-group select:focus {
    outline: none;
    border-color: #2154a2;
    box-shadow: 0 0 0 2px rgba(33, 84, 162, 0.1);
  }

  .pagination {
    margin-bottom: 1.5rem;
    padding: 1rem 0;
    border-top: 1px solid #e3eaf6;
    border-bottom: 1px solid #e3eaf6;
  }

  .pagination-info {
    text-align: center;
    font-size: 0.85rem;
    color: #6c757d;
    margin-bottom: 0.75rem;
  }

  .pagination-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .page-btn {
    background: #f8f9fa;
    border: 1px solid #e3eaf6;
    color: #2154a2;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    transition: all 0.2s;
    min-width: 40px;
  }

  .page-btn:hover:not(:disabled) {
    background: #e9ecef;
    border-color: #2154a2;
  }

  .page-btn:disabled {
    background: #f8f9fa;
    color: #adb5bd;
    cursor: not-allowed;
    border-color: #e9ecef;
  }

  .page-numbers {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .page-number {
    background: #f8f9fa;
    border: 1px solid #e3eaf6;
    color: #2154a2;
    padding: 0.4rem 0.6rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
    min-width: 32px;
    transition: all 0.2s;
  }

  .page-number:hover {
    background: #e9ecef;
    border-color: #2154a2;
  }

  .page-number.active {
    background: #2154a2;
    color: #fff;
    border-color: #2154a2;
  }

  .dots {
    color: #6c757d;
    padding: 0 0.25rem;
  }

  .filter-results {
    margin-top: 1rem;
    font-size: 0.85rem;
    color: #6c757d;
    text-align: center;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .filter-panel {
      width: 100%;
      border-left: none;
      border-top: 1px solid #e3eaf6;
      border-radius: 12px 12px 0 0;
    }

    .page-numbers {
      flex-wrap: wrap;
    }
  }

  .create-section {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e3eaf6;
  }

  .create-questionnaire-btn {
    width: 100%;
    background: #28a745;
    border: none;
    color: white;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .create-questionnaire-btn:hover {
    background: #218838;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
  }
</style>
