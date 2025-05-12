<script lang="ts">
  import { Tabs, TabItem } from 'flowbite-svelte';
  import UserTable from '$lib/components/UserTable.svelte';
  import AssignmentsTable from '$lib/components/AssignmentsTable.svelte';
  import type { Assignment } from 'netsblox-cloud-client/src/types/Assignment.js';

  let { data } = $props();

  let { group, members, assignments } = $derived(data);
  let groupId = $derived(group.id);

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
