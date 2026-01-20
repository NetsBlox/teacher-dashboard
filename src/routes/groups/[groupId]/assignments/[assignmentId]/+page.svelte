<script lang="ts">
  import { Tabs, TabItem } from 'flowbite-svelte';
  import SubmissionTable from '$lib/comp/tables/SubmissionTable.svelte';
  import { getNavbarContext } from '$lib/contexts/Contexts.svelte.js';
  import Loading from '$lib/comp/Loading.svelte';

  const navbar = getNavbarContext();
  navbar.title = `Assignment: loading...`;

  let { data, params } = $props();

  let { assignmentAR, submissionsAR } = $derived(data);
  let { assignmentId, groupId } = $derived(params);

  // svelte-ignore state_referenced_locally
  assignmentAR.andTee((a) => (navbar.title = `Assignment: ${a.name}`));
</script>

{#await assignmentAR}
  <Loading />
{:then assignmentR}
  {#if assignmentR.isErr()}
    <h class="text-white"> Failed to retrieve assignment </h>
  {:else}
    <Tabs>
      <TabItem open title="Submissions">
        <SubmissionTable bind:submissionsAR={submissionsAR} {groupId} {assignmentId} />
      </TabItem>
    </Tabs>
  {/if}
{/await}
