<script lang="ts">
  import { Tabs, TabItem, Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';
  import UserTable from '$lib/comp/tables/UserTable.svelte';
  import AssignmentsTable from '$lib/comp/tables/AssignmentsTable.svelte';
  import { getNavbarContext } from '$lib/contexts/Contexts.svelte.js';
  import Loading from '$lib/comp/misc/Loading.svelte';
  import { page } from '$app/state';
  import GroupDetails from '$lib/details/Group.svelte';

  let { data } = $props();

  let { sessionAR, groupAR, joinCodeAR, membersAR, assignmentsAR } =
    $derived(data);
  const navbar = getNavbarContext();
  navbar.title = `Group: loading...`;
  // svelte-ignore state_referenced_locally
  groupAR.andTee((g) => (navbar.title = `Group: ${g.name}`));

  const groupId = page.params.groupId || '';
</script>

{#await sessionAR}
  <Loading />
{:then sessionR}
  {#if sessionR.isErr()}
    <h class="text-white"> Failed to load page</h>
  {:else}
    <article class="flex flex-row gap-2" aria-label="Group Profile">
      <GroupDetails bind:groupAR bind:joinCodeAR />
      <section class="flex-2/3" aria-label="User resources">
        <Tabs>
          <TabItem open title="Members">
            <UserTable bind:membersAR {groupId} />
          </TabItem>
          <TabItem title="Assignments">
            <AssignmentsTable bind:assignmentsAR {groupId} />
          </TabItem>
        </Tabs>
      </section>
    </article>
  {/if}
{/await}
