<script lang="ts">
  export let form;
</script>

<form method="POST" class="login-form">
  <h1>Connexion</h1>
  {#if form?.error}
    <div class="error-message">{form.error}</div>
  {/if}
  <input name="email" type="email" placeholder="Email" required />
  <input name="password" type="password" placeholder="Mot de passe" required />
  <button type="submit">Se connecter</button>
</form>

<style>
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: #fff;
    padding: 2rem 2.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 24px rgba(33,84,162,0.08);
    min-width: 320px;
  }
  .login-form h1 {
    margin: 0 0 1rem 0;
    text-align: center;
    color: #2154a2;
    font-size: 2rem;
    font-weight: 700;
  }
  .login-form input {
    padding: 0.85rem 1rem;
    border: 1.5px solid #e3eaf6;
    border-radius: 8px;
    font-size: 1rem;
    background: #fff;
    transition: border-color 0.2s;
  }
  .login-form input:focus {
    outline: none;
    border-color: #2154a2;
    box-shadow: 0 0 0 2px rgba(33,84,162,0.1);
  }
  .login-form button {
    padding: 0.85rem;
    background: #2154a2;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }
  .login-form button:hover {
    background: #133a6a;
  }
  .error-message {
    background: #f8d7da;
    color: #721c24;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    text-align: center;
    font-weight: 500;
    border: 1px solid #f5c6cb;
    margin-bottom: 0.5rem;
  }
</style>
