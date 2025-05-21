<script lang="ts">
  import '../app.css';
  import { loginUrl } from '$lib/utils/routes';

  import Nav from '$lib/components/Nav.svelte';
  import ErrorToastSet from '$lib/components/ErrorToastSet.svelte';

  import type { LayoutProps } from './$types';
  import { page } from '$app/state';

  let { data, children }: LayoutProps = $props();

  const url = $derived(loginUrl(page.url));
</script>

<main>
  <Nav {url} authUser={data.authUser} />
  <ErrorToastSet />
  <section class="p-5">
    {@render children?.()}
  </section>
</main>
