<script lang="ts">
  import { Tabs, TabItem } from 'flowbite-svelte';
  import UserTable from '$lib/components/UserTable.svelte';

  let { data } = $props();

  let { group, members } = $derived(data);
  let groupId = $derived(group.id);
</script>

<Tabs >
  <TabItem open title="Students">
    <UserTable {members} {groupId} />
  </TabItem>
  <TabItem title="Services"></TabItem>
</Tabs>
