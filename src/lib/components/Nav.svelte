<script lang="ts">
  import {
    Navbar,
    NavBrand,
    NavHamburger,
    NavUl,
    NavLi,
  } from 'flowbite-svelte';
  import { goto, invalidate } from '$app/navigation';

  import { CLOUD_URL } from '$lib/utils/routes';
  import { errorSetContext } from '$lib/contexts/ErrorDialogContext.svelte';

  interface Props {
    url: string;
    authUser: string;
  }

  let { url, authUser }: Props = $props();

  const loggedIn = $derived(authUser !== undefined);

  async function logout() {
    try {
      const endpoint = CLOUD_URL + '/users/logout';
      const options: RequestInit = { method: 'post', credentials: 'include' };
      const res = await fetch(endpoint, options);
      if (!res.ok) throw Error 
    } catch(rawErr) {
      const err = new Error('Failed to logout.');
      errorSetContext.push(err);
      throw rawErr
    }
  }

  const handleLogout = async () => {
    await logout();
    await invalidate(CLOUD_URL + '/users/whoami');
    await goto('/');
  };

  const handleClick = async () => {
    if (loggedIn) {
      await handleLogout();
    } else {
      window.location.href = url;
    }
  };
</script>

<Navbar fluid class="font-bold dark:bg-gray-800">
  <NavBrand href="/">
    <img
      src="/src/assets/logo.svg"
      class="me-3 h-9 sm:h-12"
      alt="Netsblox Logo"
    />
  </NavBrand>
  <NavHamburger />
  <NavUl>
    <NavLi href="/">Home</NavLi>
    <NavLi>
      <button onclick={handleClick}>
        {loggedIn ? 'Logout' : 'Login'}
      </button>
    </NavLi>
  </NavUl>
</Navbar>
