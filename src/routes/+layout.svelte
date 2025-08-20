<script lang="ts">
  import '../app.css';
  import { loginUrl } from '$lib/utils/routes';

  import Nav from '$lib/components/Nav.svelte';
  import ErrorToastSet from '$lib/components/ErrorToastSet.svelte';

  import type { LayoutProps } from './$types';
  import { page } from '$app/state';
  import {
    ErrorContext,
    setErrorContext,
  } from '$lib/contexts/ErrorContext.svelte';

  let { data, children }: LayoutProps = $props();

  const errors = $state(new ErrorContext());
  setErrorContext(errors);

  const url = $derived(loginUrl(page.url));
</script>

<main>
  <Nav {url} authUser={data.authUser} />
  <ErrorToastSet context={errors} />
  <section class="p-5">
    {@render children?.()}
  </section>
</main>
