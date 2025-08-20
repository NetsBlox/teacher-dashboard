<script lang="ts">
  import { Tabs, TabItem } from 'flowbite-svelte';
  import UserTable from '$lib/components/UserTable.svelte';
  import AssignmentsTable from '$lib/components/AssignmentsTable.svelte';
  import { NavTitleText } from '$lib/contexts/Contexts.svelte';
  import type { Group } from 'netsblox-cloud-client/src/types/Group.js';

  let { data } = $props();

  const { members, assignments } = $derived(data);
  const group: Group = data.group || { id: '', owner: '', name: '' };
  NavTitleText.value = `Group: ${group?.name}`;
</script>

<Tabs>
  <TabItem open title="Members">
    <UserTable {members} {group} />
  </TabItem>
  <TabItem title="Assignments">
    <AssignmentsTable groupId={group?.id || ''} {assignments} />
  </TabItem>
</Tabs>
