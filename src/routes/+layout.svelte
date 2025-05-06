<script lang="ts">
  import '../app.css';
  import { loginUrl } from '$lib/utils/routes';

  import Nav from '$lib/components/Nav.svelte';
  import { Alert } from 'flowbite-svelte';
  import { InfoCircleSolid } from 'flowbite-svelte-icons';
  import ErrorToastSet from '$lib/components/ErrorToastSet.svelte'

  import { fade } from 'svelte/transition';
  import type { LayoutProps } from './$types';
  import { page } from '$app/state';

  let { data, children }: LayoutProps = $props();

  const cloudDown = $derived(data?.status >= 500);
  const url = $derived(loginUrl(page.url));

</script>

<main>

  <Nav {url} authUser={data.authUser}/>
  <ErrorToastSet/>
  {#if cloudDown}
    <Alert
      dismissable={true}
      border
      color="none"      transition={fade}
      class="text-gray-100 dark:bg-red-800"
    >
      <InfoCircleSolid slot="icon" class="h-5 w-5" />
      <span class="text-xl">
        Error: Looks like cloud is down, please try again later.
      </span>
    </Alert>
  {/if}
  <section class="p-5">
    {@render children?.()}
  </section>
</main>
