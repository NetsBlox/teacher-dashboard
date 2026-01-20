<script lang="ts">
  import type { Assignment } from 'netsblox-cloud-client/src/types/Assignment';
  import type { DashboardError } from '$lib/utils/errors';
  import type { ResultAsync } from 'neverthrow';
  import type { Group } from 'netsblox-cloud-client/src/types/Group';
  import type { ConstructParams } from '$lib/utils/tables';

  import { Table, TableSearch, Button } from 'flowbite-svelte';
  import TableHeaders from '$lib/comp/tables/TableHeaders.svelte';
  import TableEntries from '$lib/comp/tables/TableEntries.svelte';
  import {
    PlusOutline,
    RefreshOutline,
    TrashBinOutline,
  } from 'flowbite-svelte-icons';
  import DeleteEntryModal from '$lib/comp/DeleteEntryModal.svelte';
  import { AssignmentTable } from '$lib/data/tables/assignments.svelte';
  import CreateAssignmentModal from '$lib/comp/CreateAssignmentModal.svelte';
  import { getErrorContext } from '$lib/contexts/ErrorContext.svelte';
  import { getAssignments } from '$lib/utils/api/groups';
  import Loading from '$lib/comp/Loading.svelte';

  type Props = {
    assignmentsAR: ResultAsync<Assignment[], DashboardError>;
    group: Group;
  };

  let { assignmentsAR = $bindable(), group }: Props = $props();

  // svelte-ignore state_referenced_locally
  const params: ConstructParams<AssignmentTable, Assignment> = {
    values: [],
    owner: group.id,
    keys: ['name', 'originTime', 'dueDate'],
    searchKey: 'name',
    toaster: getErrorContext(),
    refresher: () => {
      assignmentsAR = getAssignments(fetch, group.id);
    },
  };

  const headers = ['name', 'origin time', 'due date', 'actions'];
  let creatorOpen = $state(false);
  let deletorOpen = $state(false);
</script>

{#await assignmentsAR}
  <Loading />
{:then assignmentsR}
  {#if assignmentsR.isErr()}
    <div>Error loading group members</div>
  {:else}
    {@const members = assignmentsR.value}
    {@const table = new AssignmentTable({ ...params, values: members })}
    <span class="flex flex-row items-center justify-between">
      <TableSearch
        classes={{
          input: 'dark:focus:ring-orange-500 dark:focus:border-orange-500',
        }}
        placeholder="search by username"
        hoverable={true}
        bind:inputValue={table.search}
      />
      <section>
        <Button outline onclick={() => table.refresh()} color="amber">
          <RefreshOutline />
          <span class="hidden md:inline"> Refresh</span>
        </Button>
        <Button outline onclick={() => (creatorOpen = true)}>
          <PlusOutline />
          <span class="hidden md:inline"> Create Assignment</span>
        </Button>
        <Button
          onclick={() => (deletorOpen = true)}
          disabled={!table.entries.some((x) => x.selected)}
          outline
          color="red"
        >
          <TrashBinOutline />
          <span class="hidden md:inline"> Delete</span>
        </Button>
      </section>
    </span>
    <Table shadow hoverable={true}>
      <TableHeaders {headers} {table} />
      <TableEntries {table} />
    </Table>
    <CreateAssignmentModal {table} bind:open={creatorOpen} />
    <DeleteEntryModal {table} bind:open={deletorOpen} label="Assignments" />
  {/if}
{/await}
