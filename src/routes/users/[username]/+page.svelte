<script lang="ts">
  import { Tabs, TabItem } from 'flowbite-svelte';
  import Loading from '$lib/comp/Loading.svelte';

  import GroupTable from '$lib/comp/tables/GroupTable.svelte';
  import LibraryTable from '$lib/comp/tables/LibraryTable.svelte';
  import ProjectTable from '$lib/comp/tables/ProjectTable.svelte';
  import { getNavbarContext } from '$lib/contexts/Contexts.svelte';
  import type { PageProps } from './$types';
  import { page } from '$app/state';
  import CollabTable from '$lib/comp/tables/CollabTable.svelte';

  getNavbarContext().title = `User: ${page.params.username}`;
  let { data }: PageProps = $props();
  let { librariesAR, groupsAR, projectsAR, sharedAR, userAR } = $derived(data);
</script>

{#await userAR}
  <Loading />
{:then userR}
  {#if userR.isErr()}
    <h class="text-white"> user not found </h>
  {:else}
    {@const owner = userR.value.username}
    <section class="flex flex-row gap-2">
      <div class="flex-2/3">
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
      </div>
    </section>
  {/if}
{/await}
