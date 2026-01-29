<script lang="ts">
  import type { Submission } from 'netsblox-cloud-client/src/types/Submission';
  import type { GroupId } from 'netsblox-cloud-client/src/types/GroupId';
  import type { AssignmentId } from 'netsblox-cloud-client/src/types/AssignmentId';
  import type { ResultAsync } from 'neverthrow';
  import type { DashboardError } from '$lib/utils/errors';
  import type { ConstructParams } from '$lib/utils/tables';

  import { Table, TableSearch, Button } from 'flowbite-svelte';
  import TableHeaders from '$lib/comp/tables/TableHeaders.svelte';
  import TableEntries from '$lib/comp/tables/TableEntries.svelte';
  import { RefreshOutline, TrashBinOutline } from 'flowbite-svelte-icons';
  import DeleteEntryModal from '$lib/comp/modals/DeleteEntry.svelte';
  import { SubmissionTable } from '$lib/data/tables/submissions.svelte';
  import { getErrorContext } from '$lib/contexts/ErrorContext.svelte';
  import { getSubmissions } from '$lib/utils/api/groups';

  type Props = {
    groupId: GroupId;
    assignmentId: AssignmentId;
    submissionsAR: ResultAsync<Submission[], DashboardError>;
  };

  let { submissionsAR = $bindable(), assignmentId, groupId }: Props = $props();
  const headers = ['name', 'origin time', 'actions'];

  // svelte-ignore state_referenced_locally
  const params: ConstructParams<SubmissionTable, Submission> = {
    values: [],
    owner: { groupId, assignmentId },
    keys: ['owner', 'originTime'],
    searchKey: 'owner',
    toaster: getErrorContext(),
    refresher: () => {
      submissionsAR = getSubmissions(fetch, groupId, assignmentId);
    },
  };

  let deletorOpen = $state(false);
</script>

{#await submissionsAR}
  <div>loading</div>
{:then submissionsR}
  {#if submissionsR.isErr()}
    <div>Error loading group members</div>
  {:else}
    {@const submissions = submissionsR.value}
    {@const table = new SubmissionTable({ ...params, values: submissions })}
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
    <DeleteEntryModal {table} bind:open={deletorOpen} label="Submissions" />
  {/if}
{/await}
