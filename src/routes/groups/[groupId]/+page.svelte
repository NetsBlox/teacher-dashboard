<script lang="ts">
  import { Tabs, TabItem } from 'flowbite-svelte';
  import UserTable from '$lib/comp/tables/UserTable.svelte';
  import AssignmentsTable from '$lib/comp/tables/AssignmentsTable.svelte';
  import { getNavbarContext } from '$lib/contexts/Contexts.svelte.js';
  import Loading from '$lib/comp/Loading.svelte';

  let { data } = $props();

  let { groupAR, membersAR, assignmentsAR } = $derived(data);
  const navbar = getNavbarContext();
  navbar.title = `Group: loading...`;
  // svelte-ignore state_referenced_locally
  groupAR.andTee((g) => (navbar.title = `Group: ${g.name}`));
</script>

{#await groupAR}
  <Loading />
{:then groupR}
  {#if groupR.isErr()}
    <h class="text-white"> Failed to retrieve group </h>
  {:else}
    {@const group = groupR.value}
    <Tabs>
      <TabItem open title="Members">
        <UserTable bind:membersAR={membersAR} {group} />
      </TabItem>
      <TabItem title="Assignments">
        <AssignmentsTable bind:assignmentsAR={assignmentsAR} {group} />
      </TabItem>
    </Tabs>
  {/if}
{/await}
