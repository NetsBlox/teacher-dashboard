<script lang="ts">
  import type { Group } from 'netsblox-cloud-client/src/types/Group';
  import type { ResultAsync } from 'neverthrow';
  import type { DashboardError } from '$lib/utils/errors';
  import type { ConstructParams } from '$lib/utils/tables';

  import { Table, TableSearch, Button } from 'flowbite-svelte';
  import TableHeaders from '$lib/comp/tables/TableHeaders.svelte';
  import TableEntries from '$lib/comp/tables/TableEntries.svelte';
  import { PlusOutline, RefreshOutline, TrashBinOutline } from 'flowbite-svelte-icons';
  import DeleteEntryModal from '$lib/comp/DeleteEntryModal.svelte';
  import { GroupTable } from '$lib/data/tables/groups.svelte';
  import CreateGroupModal from '$lib/comp/CreateGroupModal.svelte';
  import { getErrorContext } from '$lib/contexts/ErrorContext.svelte';
  import Loading from '$lib/comp/Loading.svelte';
  import { getGroups } from '$lib/utils/api/groups';

  type Props = {
    owner: string;
    groupsAR: ResultAsync<Group[], DashboardError>;
  };

  let { groupsAR = $bindable(), owner }: Props = $props();
  const headers = ['name', 'actions'];

  // svelte-ignore state_referenced_locally
  const tableParams: ConstructParams<GroupTable, Group> = {
    owner,
    values: [],
    keys: ['name'],
    searchKey: 'name',
    toaster: getErrorContext(),
    refresher: () => {
      groupsAR = getGroups(fetch, owner);
    },
  };

  let creatorOpen = $state(false);
  let deletorOpen = $state(false);
</script>

{#await groupsAR}
  <Loading />
{:then groupsR}
  {#if groupsR.isErr()}
    <div>Error loading group</div>
  {:else}
    {@const groups = groupsR.value}
    {@const table = new GroupTable({ ...tableParams, values: groups })}
    <span class="flex flex-row items-center justify-between">
      <TableSearch
        classes={{
          input: 'dark:focus:ring-orange-500 dark:focus:border-orange-500',
        }}
        placeholder="search by name"
        hoverable={true}
        bind:inputValue={table.search}
      />
      <section>
        <Button outline onclick={() => table.refresh()} color="amber">
          <RefreshOutline/>
          <span class="hidden md:inline"> Refresh</span>
        </Button>
        <Button outline onclick={() => (creatorOpen = true)}>
          <PlusOutline /> Add Group
        </Button>
        <Button
          onclick={() => (deletorOpen = true)}
          disabled={!table.entries.some((x) => x.selected)}
          outline
          color="red"
        >
          <TrashBinOutline />Delete
        </Button>
      </section>
    </span>
    <Table shadow hoverable={true}>
      <TableHeaders {headers} {table} />
      <TableEntries {table} />
    </Table>
    <CreateGroupModal {table} bind:open={creatorOpen} />
    <DeleteEntryModal {table} bind:open={deletorOpen} label="Groups" />
  {/if}
{/await}
