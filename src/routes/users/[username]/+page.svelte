<script lang="ts">
  import { Tabs, TabItem } from 'flowbite-svelte';

  import ProjectTable from '$lib/components/ProjectTable.svelte';
  import GroupTable from '$lib/components/GroupTable.svelte';
  import LibraryTable from '$lib/components/LibraryTable.svelte';

  import type { PageProps } from './$types';
  import { NavTitleText } from '$lib/contexts/Contexts.svelte';

  let { data }: PageProps = $props();

  const { user, projects, shared, groups, libraries } = data;
  let owner = $state('')
  NavTitleText.value = 'User: '
  if(user?.username){
    owner = user?.username;
    NavTitleText.value = `User: ${(() => owner)()}`
  }
</script>

<Tabs>
  <TabItem open title="Groups">
    <GroupTable {groups} {owner} />
  </TabItem>
  <TabItem title="Projects">
    <Tabs tabStyle="underline">
      <TabItem open title="My Projects">
        <ProjectTable {projects} {owner} tableBtns={true} />
      </TabItem>
      <TabItem title="Collaborations">
        <ProjectTable projects={shared} {owner} tableBtns={false}/>
      </TabItem>
    </Tabs>
  </TabItem>
  <TabItem title="Libraries">
    <LibraryTable {libraries} {owner} />
  </TabItem>
</Tabs>
