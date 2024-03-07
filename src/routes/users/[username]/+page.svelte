<script lang="ts">
  import { onMount } from 'svelte';
  import { Tabs, TabItem, Spinner } from 'flowbite-svelte';

  import ProjectTable from '$lib/ProjectTable.svelte';
  import LibraryTable from '$lib/LibraryTable.svelte';
  import ClassTable from '$lib/ClassTable.svelte';
  import { page } from '$app/stores';
  import api from '$lib/api';

  const username = $page.params.username;
  let userP;

  // TODO: if we are not a group member, show our classes
  onMount(() => {
    userP = api.viewUser(username);
  });
</script>

<Tabs>
  {#await userP}
    <Spinner/>
  {:then userData}
    {#if !userData?.groupId}
      <TabItem title="Classes">
        <ClassTable username={username} />
      </TabItem>
    {/if}
    <TabItem open title="Projects">
      <ProjectTable username={username} />
    </TabItem>
    <TabItem title="Libraries">
      <LibraryTable username={username} />
    </TabItem>
  {/await}
</Tabs>
