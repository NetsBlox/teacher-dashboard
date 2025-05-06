<script lang="ts">
  import { Tabs, TabItem } from 'flowbite-svelte';
  import SubmissionTable from '$lib/components/SubmissionTable.svelte';
  let { data } = $props();

  let { submissions, groupId, assignmentId, } = $derived(data);
</script>

<Tabs >
  <TabItem open title="Submissions">
    <SubmissionTable {submissions} {groupId} {assignmentId} />
  </TabItem>
</Tabs>
