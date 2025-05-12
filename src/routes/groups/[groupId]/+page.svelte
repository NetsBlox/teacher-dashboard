<script lang="ts">
  import { Tabs, TabItem } from 'flowbite-svelte';
  import UserTable from '$lib/components/UserTable.svelte';
  import AssignmentsTable from '$lib/components/AssignmentsTable.svelte';
  import type { Assignment } from 'netsblox-cloud-client/src/types/Assignment.js';
  import { NavTitleText } from '$lib/contexts/Contexts.svelte';

  let { data } = $props();

  let { group, members, assignments } = data;
  let groupId = $state('');
  NavTitleText.value = 'Group: '

  if(group && group.name && group.id){
    groupId = group.id
    NavTitleText.value = `Group: ${group.name}`
  }

</script>

<Tabs >
  <TabItem open title="Students">
    <UserTable {members} {groupId} />
  </TabItem>
  <TabItem title="Assignments">
    <AssignmentsTable {groupId} {assignments} />

  </TabItem>
  <!-- <TabItem title="Services"></TabItem> -->
</Tabs>
