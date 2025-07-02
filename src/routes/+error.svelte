<!-- src/routes/+error.svelte -->
<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  // Utiliser onMount pour s'assurer qu'on est côté client
  onMount(() => {
    goto('/login');
  });
</script>

<div>Page non trouvée, redirection vers la page de connexion...</div>
