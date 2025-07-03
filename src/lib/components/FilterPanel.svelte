<script lang="ts">
  // Correction pour Svelte 5 - Définir l'interface Props
  interface Props {
    filterName?: string;
    filterDateType?: string;
    filterDate?: string;
    filterScoreType?: string;
    filterScoreMin?: string;
    filterScoreMax?: string;
    filterRankType?: string;
    filterRankMin?: string;
    filterRankMax?: string;
    usersPerPage?: number;
    currentPage?: number;
    resultCount?: number;
    totalPages?: number;
  }

  let {
    filterName = $bindable(''),
    filterDateType = $bindable('any'),
    filterDate = $bindable(''),
    filterScoreType = $bindable('any'),
    filterScoreMin = $bindable(''),
    filterScoreMax = $bindable(''),
    filterRankType = $bindable('any'),
    filterRankMin = $bindable(''),
    filterRankMax = $bindable(''),
    usersPerPage = $bindable(25),
    currentPage = $bindable(1),
    resultCount = 0,
    totalPages = 0
  }: Props = $props();

  function clearFilters() {
    filterName = '';
    filterDateType = 'any';
    filterDate = '';
    filterScoreType = 'any';
    filterScoreMin = '';
    filterScoreMax = '';
    filterRankType = 'any';
    filterRankMin = '';
    filterRankMax = '';
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
    <label for="name-filter">Nom</label>
    <input id="name-filter" type="text" bind:value={filterName} placeholder="Rechercher par nom">
  </div>

  <div class="filter-group">
    <label for="rank-type">Classement</label>
    <select id="rank-type" bind:value={filterRankType}>
      <option value="any">Tous</option>
      <option value="between">Entre</option>
      <option value="greater">Supérieur à</option>
      <option value="less">Inférieur à</option>
    </select>
    
    {#if filterRankType === 'between'}
      <div class="score-range">
        <input type="number" bind:value={filterRankMin} placeholder="Min">
        <input type="number" bind:value={filterRankMax} placeholder="Max">
      </div>
    {:else if filterRankType === 'greater' || filterRankType === 'less'}
      <input type="number" bind:value={filterRankMin} placeholder="Valeur">
    {/if}
  </div>

  <div class="filter-group">
    <label for="date-type">Date de création</label>
    <select id="date-type" bind:value={filterDateType}>
      <option value="any">Toutes</option>
      <option value="before">Avant le</option>
      <option value="after">Après le</option>
    </select>
    {#if filterDateType !== 'any'}
      <input type="date" bind:value={filterDate}>
    {/if}
  </div>

  <div class="filter-group">
    <label for="score-type">Score</label>
    <select id="score-type" bind:value={filterScoreType}>
      <option value="any">Tous</option>
      <option value="between">Entre</option>
      <option value="greater">Supérieur à</option>
      <option value="less">Inférieur à</option>
    </select>
    
    {#if filterScoreType === 'between'}
      <div class="score-range">
        <input type="number" bind:value={filterScoreMin} placeholder="Min">
        <input type="number" bind:value={filterScoreMax} placeholder="Max">
      </div>
    {:else if filterScoreType === 'greater' || filterScoreType === 'less'}
      <input type="number" bind:value={filterScoreMin} placeholder="Valeur">
    {/if}
  </div>

  <div class="filter-group">
    <label for="users-per-page">Utilisateurs par page</label>
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
</div>

<style>
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

  .score-range {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .score-range input {
    flex: 1;
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
</style>
