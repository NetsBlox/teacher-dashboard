<script lang="ts">
  import { Tabs, TabItem } from 'flowbite-svelte';
  import SubmissionTable from '$lib/components/SubmissionTable.svelte';
  import { NavTitleText } from '$lib/contexts/Contexts.svelte.js';
  let { data } = $props();

  let {assignment, submissions, groupId, assignmentId } = $derived(data);
  const getAssignmentName = () => assignment?.name || ''
  NavTitleText.value = 'Assignment: ' + getAssignmentName()
  </script>

<Tabs >
  <TabItem open title="Submissions">
    <SubmissionTable {submissions} {groupId} {assignmentId} />
  </TabItem>
</Tabs>
