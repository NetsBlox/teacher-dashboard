<script lang="ts">
  import { Tabs, TabItem } from 'flowbite-svelte';

  import GroupTable from '$lib/components/GroupTable.svelte';
  import LibraryTable from '$lib/components/LibraryTable.svelte';

  import type { PageProps } from './$types';
  import { NavTitleText } from '$lib/contexts/Contexts.svelte';
  import SharedProjectTable from '$lib/components/SharedProjectTable.svelte';
  import OwnedProjectTable from '$lib/components/OwnedProjectTable.svelte';
  import { DashboardError } from '$lib/utils/errors';

  let { data }: PageProps = $props();

  const { projects, shared, groups, libraries } = $derived(data);
  const { user } = data
  const owner = user?.username || '';
  NavTitleText.value = `User: ${owner}`;
</script>

<Tabs>
  <TabItem open title="Groups">
    <GroupTable {groups} {owner} />
  </TabItem>
  <TabItem title="Projects">
    <Tabs tabStyle="underline">
      <TabItem open title="My Projects">
        <OwnedProjectTable {projects} {owner} />
      </TabItem>
      <TabItem title="Collaborations">
        <SharedProjectTable projects={shared} {owner} />
      </TabItem>
    </Tabs>
  </TabItem>
  <TabItem title="Libraries">
    <LibraryTable {libraries} {owner} />
  </TabItem>
</Tabs>
