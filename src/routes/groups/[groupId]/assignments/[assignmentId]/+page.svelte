<script lang="ts">
  import { Tabs, TabItem } from 'flowbite-svelte';
  import SubmissionTable from '$lib/comp/tables/SubmissionTable.svelte';
  import { getNavbarContext } from '$lib/contexts/Contexts.svelte.js';
  import Loading from '$lib/comp/misc/Loading.svelte';
  import AssignmentDetails from '$lib/details/Assignment.svelte';

  const navbar = getNavbarContext();
  navbar.title = `Assignment: loading...`;

  let { data, params } = $props();

  let { sessionAR, assignmentAR, submissionsAR } = $derived(data);
  let { assignmentId, groupId } = $derived(params);

  // svelte-ignore state_referenced_locally
  assignmentAR.andTee((a) => (navbar.title = `Assignment: ${a.name}`));
</script>

{#await sessionAR}
  <Loading />
{:then sessionR}
  {#if sessionR.isErr()}
    <h class="text-white"> Failed to authenticate user </h>
  {:else}
    <article class="flex flex-row gap-2" aria-label="Assignment Profile">
      <AssignmentDetails bind:assignmentAR />
      <section class="flex-2/3" aria-label="Assignment resources">
        <Tabs>
          <TabItem open title="Submissions">
            <SubmissionTable bind:submissionsAR {groupId} {assignmentId} />
          </TabItem>
        </Tabs>
      </section>
    </article>
  {/if}
{/await}
