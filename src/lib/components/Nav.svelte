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

  interface Props {
    url: string | undefined;
    authUser: string
  }

  let { url, authUser }: Props = $props();

  const loggedIn = $derived(authUser !== undefined);

  async function logout() {
    await fetch(CLOUD_URL + '/users/logout', {
      method: 'post',
      credentials: 'include',
    });
  }

  const handleLogout = async () => {
    await logout();
    await invalidate(CLOUD_URL + '/users/whoami');
    await goto('/');
    console.log(authUser);
  };

  const handleClick = async () => {
    if (loggedIn) {
      await handleLogout();
    } else if (url) {
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
