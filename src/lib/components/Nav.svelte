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
  import { NavTitleText } from '$lib/contexts/Contexts.svelte';

  import logo from "$assets/logo.svg"

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
      if (!res.ok) throw Error;
    } catch (rawErr) {
      const err = new Error('Failed to logout.');
      throw rawErr;
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
  <div class="flex flex-row items-center">
    <NavBrand href="/">
      <img
        src={logo}
        class="me-3 h-9 sm:h-12"
        alt="Netsblox Logo"
        width={48}
      />
    </NavBrand>
    <span class="text-xl"> {NavTitleText.value}</span>
  </div>

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
