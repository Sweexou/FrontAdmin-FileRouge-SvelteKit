<script lang="ts">
  let { data } = $props();
  
  const {
    totalUsers,
    recentlyConnectedUsers,
    averageScore,
    medianScore,
    activityRate
  } = data;

  function formatNumber(num: number): string {
    return new Intl.NumberFormat('fr-FR').format(num);
  }
</script>

<header>
  <nav>
    <a href="/app/users" class="nav-item">Users</a>
    <a href="/app/questionnaires" class="nav-item">Questionnaires</a>
    <a href="/app/stats" class="nav-item active">Stats</a>
  </nav>
</header>

<main>
  <div class="stats-container">
    <div class="stats-header">
      <h1>Statistiques générales</h1>
      <p>Vue d'ensemble des données de la plateforme</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <h3>Utilisateurs totaux</h3>
          <div class="stat-number">{formatNumber(totalUsers)}</div>
          <div class="stat-description">Nombre total d'utilisateurs inscrits</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🟢</div>
        <div class="stat-content">
          <h3>Connexions récentes</h3>
          <div class="stat-number">{formatNumber(recentlyConnectedUsers)}</div>
          <div class="stat-description">Connectés dans les 7 derniers jours</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <h3>Score moyen</h3>
          <div class="stat-number">{averageScore}</div>
          <div class="stat-description">Moyenne des scores de tous les utilisateurs</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📈</div>
        <div class="stat-content">
          <h3>Score médian</h3>
          <div class="stat-number">{medianScore}</div>
          <div class="stat-description">Valeur médiane des scores</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">⚡</div>
        <div class="stat-content">
          <h3>Taux d'activité</h3>
          <div class="stat-number">{activityRate}%</div>
          <div class="stat-description">Pourcentage d'utilisateurs actifs</div>
        </div>
      </div>
    </div>
  </div>
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

  .nav-item:focus {
    outline: 2px solid #2154a2;
    outline-offset: -2px;
  }

  main {
    padding-top: 96px;
    padding-left: 1rem;
    padding-right: 1rem;
    min-height: 100vh;
  }

  .stats-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .stats-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .stats-header h1 {
    margin: 0 0 0.5rem 0;
    color: #2154a2;
    font-size: 2.5rem;
    font-weight: 600;
  }

  .stats-header p {
    margin: 0;
    color: #6c757d;
    font-size: 1.1rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
  }

  .stat-card {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 24px rgba(33,84,162,0.08);
    padding: 2rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(33,84,162,0.12);
  }

  .stat-icon {
    font-size: 3rem;
    min-width: 60px;
    text-align: center;
  }

  .stat-content {
    flex: 1;
  }

  .stat-content h3 {
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
    font-size: 1rem;
    font-weight: 600;
  }

  .stat-number {
    font-size: 2.5rem;
    font-weight: 700;
    color: #2154a2;
    margin-bottom: 0.25rem;
  }

  .stat-description {
    color: #6c757d;
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }

    .stat-card {
      padding: 1.5rem;
    }

    .stats-header h1 {
      font-size: 2rem;
    }

    .stat-number {
      font-size: 2rem;
    }
  }

  @media (max-width: 480px) {
    .stat-card {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }

    .stat-icon {
      min-width: unset;
    }
  }
</style>
