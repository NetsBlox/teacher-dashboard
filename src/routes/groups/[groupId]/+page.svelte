<script lang="ts">
  import { Tabs, TabItem } from 'flowbite-svelte';
  import UserTable from '$lib/components/UserTable.svelte';
  import AssignmentsTable from '$lib/components/AssignmentsTable.svelte';
  import { NavTitleText } from '$lib/contexts/Contexts.svelte';

  let { data } = $props();

  const { group, members, assignments } = $derived(data);
  const getGroupName = () => group?.name || ''
  NavTitleText.value = `Group: ${getGroupName()}`

</script>

<Tabs >
  <TabItem open title="Students">
    <UserTable {members} groupId={group?.id || ''} />
  </TabItem>
  <TabItem title="Assignments">
    <AssignmentsTable groupId={group?.id || ''} {assignments} />

  </TabItem>
  <!-- <TabItem title="Services"></TabItem> -->
</Tabs>
