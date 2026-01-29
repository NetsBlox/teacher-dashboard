<script lang="ts">
  import type { Assignment } from 'netsblox-cloud-client/src/types/Assignment';
  import type { DashboardError } from '$lib/utils/errors';
  import type { ResultAsync } from 'neverthrow';
  import type { ConstructParams } from '$lib/utils/tables';
  import type { GroupId } from 'netsblox-cloud-client/src/types/GroupId';

  import { Table, TableSearch, Button } from 'flowbite-svelte';
  import TableHeaders from '$lib/comp/tables/TableHeaders.svelte';
  import TableEntries from '$lib/comp/tables/TableEntries.svelte';
  import {
    PlusOutline,
    RefreshOutline,
    TrashBinOutline,
  } from 'flowbite-svelte-icons';
  import DeleteEntryModal from '$lib/comp/modals/DeleteEntry.svelte';
  import { AssignmentTable } from '$lib/data/tables/assignments.svelte';
  import CreateAssignmentModal from '$lib/comp/modals/CreateAssignment.svelte';
  import { getErrorContext } from '$lib/contexts/ErrorContext.svelte';
  import { getAssignments } from '$lib/utils/api/groups';
  import Loading from '$lib/comp/misc/Loading.svelte';

  type Props = {
    assignmentsAR: ResultAsync<Assignment[], DashboardError>;
    groupId: GroupId;
  };

  let { assignmentsAR = $bindable(), groupId }: Props = $props();

  // svelte-ignore state_referenced_locally
  const params: ConstructParams<AssignmentTable, Assignment> = {
    values: [],
    owner: groupId,
    keys: ['name', 'originTime', 'dueDate'],
    searchKey: 'name',
    toaster: getErrorContext(),
    refresher: () => {
      assignmentsAR = getAssignments(fetch, groupId);
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
      <menu>
        <menuitem>
          <Button outline onclick={() => table.refresh()} color="amber">
            <RefreshOutline />
            <span class="hidden md:inline"> Refresh</span>
          </Button>
        </menuitem>
        <menuitem>
          <Button outline onclick={() => (creatorOpen = true)}>
            <PlusOutline />
            <span class="hidden md:inline"> Create Assignment</span>
          </Button>
        </menuitem>
        <menuitem>
          <Button
            onclick={() => (deletorOpen = true)}
            disabled={!table.entries.some((x) => x.selected)}
            outline
            color="red"
          >
            <TrashBinOutline />
            <span class="hidden md:inline"> Delete</span>
          </Button>
        </menuitem>
      </menu>
    </span>
    <Table shadow hoverable={true}>
      <TableHeaders {headers} {table} />
      <TableEntries {table} />
    </Table>
    <CreateAssignmentModal {table} bind:open={creatorOpen} />
    <DeleteEntryModal {table} bind:open={deletorOpen} label="Assignments" />
  {/if}
{/await}
