<script lang="ts">
  import { Tabs, TabItem } from 'flowbite-svelte';

  import ProjectTable from '$lib/components/ProjectTable.svelte';
  import GroupTable from '$lib/components/GroupTable.svelte';
  import LibraryTable from '$lib/components/LibraryTable.svelte';

  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  const { user, projects, shared, groups, libraries } = $derived(data);
  const owner = $derived(user.username);
</script>

<Tabs>
  <TabItem open title="Groups">
    <GroupTable {groups} {owner} />
  </TabItem>
  <TabItem title="Projects">
    <Tabs tabStyle="underline">
      <TabItem open title="My Projects">
        <ProjectTable {projects} {owner} />
      </TabItem>
      <TabItem title="Collaborations">
        <ProjectTable projects={shared} {owner} />
      </TabItem>
    </Tabs>
  </TabItem>
  <TabItem title="Libraries">
    <LibraryTable {libraries} {owner} />
  </TabItem>
</Tabs>
