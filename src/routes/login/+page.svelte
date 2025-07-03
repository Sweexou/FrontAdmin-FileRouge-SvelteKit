<script lang="ts">
  import LoginForm from '$lib/components/LoginForm.svelte';
</script>

<div class="container">
  <LoginForm />
</div>

<style>
  :global(html, body) {
    height: 100%;
    margin: 0;
    padding: 0;
    background: #f5f8fa;
  }

  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }
</style>
