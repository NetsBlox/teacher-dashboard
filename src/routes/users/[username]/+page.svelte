<script lang="ts">
  import type { PageProps } from './$types';

  import {
    Tabs,
    TabItem,
    Breadcrumb,
    BreadcrumbItem,
    Hr,
  } from 'flowbite-svelte';
  import Loading from '$lib/comp/misc/Loading.svelte';
  import GroupTable from '$lib/comp/tables/GroupTable.svelte';
  import LibraryTable from '$lib/comp/tables/LibraryTable.svelte';
  import ProjectTable from '$lib/comp/tables/ProjectTable.svelte';
  import { getNavbarContext } from '$lib/contexts/Contexts.svelte';
  import { page } from '$app/state';
  import CollabTable from '$lib/comp/tables/CollabTable.svelte';
  import UserDetails from '$lib/details/User.svelte';
  import { HomeOutline } from 'flowbite-svelte-icons';

  getNavbarContext().title = `User: ${page.params.username}`;
  let { data, params }: PageProps = $props();
  let { sessionAR, librariesAR, groupsAR, projectsAR, sharedAR, userAR } =
    $derived(data);
  let { username: owner } = $derived(params);
</script>

{#await sessionAR}
  <Loading />
{:then sessionR}
  {#if sessionR.isErr()}
    <h1 class="text-white">Failed to load page</h1>
  {:else}
    <article class="flex flex-row gap-2" aria-label="User Profile">
      <UserDetails bind:userAR />
      <section class="flex-2/3" aria-label="User resources">
        <Tabs>
          <TabItem open title="Groups">
            <GroupTable bind:groupsAR {owner} />
          </TabItem>
          <TabItem title="My Projects">
            <ProjectTable bind:projectsAR {owner} />
          </TabItem>
          <TabItem title="Collaborations">
            <CollabTable bind:projectsAR={sharedAR} {owner} />
          </TabItem>
          <TabItem title="Libraries">
            <LibraryTable bind:librariesAR {owner} />
          </TabItem>
        </Tabs>
      </section>
    </article>
  {/if}
{/await}
