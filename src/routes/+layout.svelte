<script lang="ts">
  import type { LayoutProps } from './$types';

  import '../app.css';
  import { loginUrl } from '$lib/utils/routes';
  import Nav from '$lib/comp/misc/Nav.svelte';
  import ErrorToastSet from '$lib/comp/misc/ErrorToastSet.svelte';
  import { page } from '$app/state';
  import { ErrorContext } from '$lib/contexts/ErrorContext.svelte';
  import { setErrorContext } from '$lib/contexts/ErrorContext.svelte';
  import { setNavbarContext } from '$lib/contexts/Contexts.svelte';

  let { data, children }: LayoutProps = $props();

  const errorContext = $state(new ErrorContext());
  const navbarContext = $state({ title: 'NetsBlox Dashboard' });
  setErrorContext(errorContext);
  setNavbarContext(navbarContext);

  const url = $derived(loginUrl(page.url));

</script>

<Nav title={navbarContext.title} {url} sessionAR={data.sessionAR} />
<ErrorToastSet context={errorContext} />
<main class="flex-1 p-5">
  {@render children?.()}
</main>
