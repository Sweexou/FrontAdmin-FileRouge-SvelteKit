<script lang="ts">
  import FilterPanel from '$lib/components/FilterPanel.svelte';
  import { goto } from '$app/navigation';
    let { data } = $props();
    let users = data.users;

  type User = {
    uuid: string;
    classement: number;
    name: string;
    creation: string;
    score: number;
  };

  let sortKey: keyof User | null = $state(null);
  let sortDirection: 'asc' | 'desc' = $state('asc');

  let filterName = $state('');
  let filterDateType = $state('any');
  let filterDate = $state('');
  let filterScoreType = $state('any');
  let filterScoreMin = $state('');
  let filterScoreMax = $state('');
  let filterRankType = $state('any');
  let filterRankMin = $state('');
  let filterRankMax = $state('');
  let usersPerPage = $state(25);
  let currentPage = $state(1);

  let filteredUsers = $derived(users.filter(user => {
    if (filterName && !user.name.toLowerCase().includes(filterName.toLowerCase())) {
      return false;
    }
    if (filterDateType !== 'any' && filterDate) {
      const userDate = new Date(user.creation);
      const targetDate = new Date(filterDate);
      if (filterDateType === 'before' && userDate >= targetDate) return false;
      if (filterDateType === 'after' && userDate <= targetDate) return false;
    }
    if (filterScoreType !== 'any') {
      if (filterScoreType === 'between' && (filterScoreMin || filterScoreMax)) {
        const min = filterScoreMin ? parseInt(filterScoreMin) : -Infinity;
        const max = filterScoreMax ? parseInt(filterScoreMax) : Infinity;
        if (user.score < min || user.score > max) return false;
      }
      if (filterScoreType === 'greater' && filterScoreMin) {
        if (user.score <= parseInt(filterScoreMin)) return false;
      }
      if (filterScoreType === 'less' && filterScoreMin) {
        if (user.score >= parseInt(filterScoreMin)) return false;
      }
    }
    if (filterRankType !== 'any') {
      if (filterRankType === 'between' && (filterRankMin || filterRankMax)) {
        const min = filterRankMin ? parseInt(filterRankMin) : -Infinity;
        const max = filterRankMax ? parseInt(filterRankMax) : Infinity;
        if (user.classement < min || user.classement > max) return false;
      }
      if (filterRankType === 'greater' && filterRankMin) {
        if (user.classement <= parseInt(filterRankMin)) return false;
      }
      if (filterRankType === 'less' && filterRankMin) {
        if (user.classement >= parseInt(filterRankMin)) return false;
      }
    }
    return true;
  }));

  let sortedUsers = $derived(sortKey ? [...filteredUsers].toSorted((a, b) => {
    const valA = a[sortKey];
    const valB = b[sortKey];
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    }
    if (sortKey === 'creation') {
      return sortDirection === 'asc'
        ? new Date(valA).getTime() - new Date(valB).getTime()
        : new Date(valB).getTime() - new Date(valA).getTime();
    }
    return String(valA).localeCompare(String(valB)) * (sortDirection === 'asc' ? 1 : -1);
  }) : filteredUsers);

  let totalPages = $derived(Math.ceil(sortedUsers.length / usersPerPage));
  let paginatedUsers = $derived.by(() => {
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    return sortedUsers.slice(startIndex, endIndex);
  });

  $effect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      currentPage = 1;
    }
  });

  function selectUser(user: User) {
    goto(`/app/users/${user.uuid}`);
  }

  function sortTable(key: keyof User) {
    if (key === 'uuid') return;
    if (sortKey === key) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortKey = key;
      sortDirection = 'asc';
    }
  }
</script>

<header>
  <nav>
    <a href="/app/users" class="nav-item active">Users</a>
    <a href="/app/questionnaires" class="nav-item">Questionnaires</a>
    <a href="/app/stats" class="nav-item">Stats</a>
  </nav>
</header>

<main>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th class="uuid-col">UUID</th>
          <th class:active={sortKey === 'classement'} onclick={() => sortTable('classement')}>
            <span class="header-content">
              <span class="header-text">Classement</span>
              {#if sortKey === 'classement'}
                <span class="arrow">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              {/if}
            </span>
          </th>
          <th class:active={sortKey === 'name'} onclick={() => sortTable('name')}>
            <span class="header-content">
              <span class="header-text">Nom</span>
              {#if sortKey === 'name'}
                <span class="arrow">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              {/if}
            </span>
          </th>
          <th class:active={sortKey === 'creation'} onclick={() => sortTable('creation')} class="date-col">
            <span class="header-content">
              <span class="header-text">Date création</span>
              {#if sortKey === 'creation'}
                <span class="arrow">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              {/if}
            </span>
          </th>
          <th class:active={sortKey === 'score'} onclick={() => sortTable('score')}>
            <span class="header-content">
              <span class="header-text">Score</span>
              {#if sortKey === 'score'}
                <span class="arrow">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              {/if}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        {#each paginatedUsers as user (user.uuid)}
          <tr onclick={() => selectUser(user)} class="clickable-row">
            <td class="uuid-col"><span class="uuid-text">{user.uuid}</span></td>
            <td><span class="rank-badge">{user.classement}</span></td>
            <td class="name-col">{user.name}</td>
            <td class="date-col">{user.creation}</td>
            <td><span class="score-badge">{user.score}</span></td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <FilterPanel
    bind:filterName
    bind:filterDateType
    bind:filterDate
    bind:filterScoreType
    bind:filterScoreMin
    bind:filterScoreMax
    bind:filterRankType
    bind:filterRankMin
    bind:filterRankMax
    bind:usersPerPage
    bind:currentPage
    resultCount={sortedUsers.length}
    totalPages={totalPages}
  />
</main>

<style>
  :global(html, body, #app) {
    height: 100vh;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background: #f5f8fa;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  /* Reset des scrollbars personnalisées */
  :global(*) {
    scrollbar-width: auto;
    scrollbar-color: auto;
  }

  :global(*::-webkit-scrollbar) {
    width: auto;
    height: auto;
  }

  :global(*::-webkit-scrollbar-track) {
    background: auto;
  }

  :global(*::-webkit-scrollbar-thumb) {
    background: auto;
    border-radius: auto;
  }

  :global(*::-webkit-scrollbar-thumb:hover) {
    background: auto;
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
    
    background: none;
    border: none;
    border-bottom: 2.5px solid transparent;
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

  .nav-item:focus {
    outline: 2px solid #2154a2;
    outline-offset: -2px;
  }

  .clickable-row {
    cursor: pointer;
    transition: all 0.2s;
  }

  .clickable-row:hover {
    background: #f0f6fd !important;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(33,84,162,0.1);
  }

  main {
    display: flex;
    height: 100vh;
    padding-top: 96px;
    padding-left: 1rem;
    padding-right: 1rem;
    gap: 1rem;
    overflow-y: auto;
  }

  .table-container {
    flex: 1;
    background: #fff;
    padding: 2rem 1.5rem 1.5rem;
    box-shadow: 0 4px 24px rgba(33,84,162,0.08);
    border-radius: 12px 0 0 12px;
    min-height: fit-content;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th {
    background: #2154a2;
    color: #fff;
    padding: 0.75rem 1rem;
    text-align: left;
    cursor: pointer;
    font-weight: 700;
    font-size: 0.9rem;
    transition: background 0.2s;
    position: sticky;
    top: 0;
  }

  th:hover {
    background: #133a6a;
  }

  th.active {
    background: #133a6a;
  }

  td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e3eaf6;
    color: #2c3e50;
    font-size: 0.9rem;
  }

  tr:hover td {
    background: #f8f9fa;
  }

  tr:last-child td {
    border-bottom: none;
  }

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .arrow {
    margin-left: 8px;
    color: #fff;
    font-weight: bold;
  }

  .rank-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    background: #2154a2;
    color: white;
    border-radius: 50%;
    font-weight: bold;
    font-size: 0.85rem;
  }

  .score-badge {
    background: #e8f5e8;
    color: #2d7d2d;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.85rem;
  }

  .uuid-text {
    font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
    background: #f8f9fa;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    color: #6c757d;
    font-size: 0.8rem;
  }

  .name-col {
    font-weight: 500;
    color: #1a202c;
  }

  @media (max-width: 768px) {
    main {
      flex-direction: column;
      padding-top: 72px;
    }
    
    .table-container {
      border-radius: 12px 12px 0 0;
    }
  }
</style>

