<script lang="ts">
  import { Tabs, TabItem } from 'flowbite-svelte';
  import SubmissionTable from '$lib/components/SubmissionTable.svelte';
  import { NavTitleText } from '$lib/contexts/Contexts.svelte.js';
  let { data } = $props();

  let {assignment, submissions, groupId, assignmentId } = data;
  NavTitleText.value = 'Assignment: '
  if(assignment && assignment.name) {
    NavTitleText.value = `Assignment: ${assignment.name}`
  }
  
</script>

<Tabs >
  <TabItem open title="Submissions">
    <SubmissionTable {submissions} {groupId} {assignmentId} />
  </TabItem>
</Tabs>
