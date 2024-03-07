<script lang="ts">

  import { Tabs, TabItem } from 'flowbite-svelte';
  import ProjectTable from '$lib/ProjectTable.svelte';
  import LibraryTable from '$lib/LibraryTable.svelte';
  import { page } from '$app/stores';

  const username = $page.params.username;
</script>

<Tabs>
  <TabItem open title="Projects">
    <ProjectTable username={username} />
  </TabItem>
  <TabItem title="Libraries">
    <LibraryTable username={username} />
  </TabItem>
</Tabs>
