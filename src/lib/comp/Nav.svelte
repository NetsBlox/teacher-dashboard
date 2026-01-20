<script lang="ts">
  import { type ResultAsync } from 'neverthrow';
  import type { DashboardError } from '$lib/utils/errors';

  import { Navbar, NavBrand } from 'flowbite-svelte';
  import { NavHamburger, NavUl, NavLi } from 'flowbite-svelte';
  import { logout } from '$lib/utils/api/users';
  import logo from '$assets/logo.svg';
  import { invalidate, goto } from '$app/navigation';
  import { CLOUD_URL } from '$lib/utils/routes';
  import type { Fetch } from '$lib/utils/types';

  interface Props {
    url: string;
    session: ResultAsync<string | null, DashboardError>;
    title: string;
  }

  let { url, session, title }: Props = $props();
  const handleLogout = (fetch: Fetch) =>
    logout(fetch).andTee(async () => {
      await invalidate(CLOUD_URL + '/users/whoami');
      await goto('/');
    });
</script>

<Navbar fluid class="border-b-2 border-b-gray-800 font-bold">
  <NavBrand href="/">
    <img src={logo} class="mr-3 h-12" alt="Netsblox Logo" />
    <span class="text-2xl text-gray-400"> {title}</span>
  </NavBrand>
  <NavHamburger />
  <NavUl>
    <NavLi class="text-lg dark:text-gray-400" href="/">Home</NavLi>
    {#await session}
      <NavLi class="text-lg dark:text-gray-400">Loading...</NavLi>
    {:then user}
      {@const loggedIn = user.isOk() && !!user.value}
      {#if loggedIn}
        <NavLi
          class="w-full cursor-pointer text-left text-lg"
          onclick={() => handleLogout(fetch)}>Logout</NavLi
        >
      {:else}
        <NavLi class="text-lg dark:text-gray-400" href={url}>Login</NavLi>
      {/if}
    {/await}
  </NavUl>
</Navbar>
