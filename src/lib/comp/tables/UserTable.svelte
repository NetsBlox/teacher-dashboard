<script lang="ts">
  import type { Group } from 'netsblox-cloud-client/src/types/Group';
  import type { ResultAsync } from 'neverthrow';
  import type { DashboardError } from '$lib/utils/errors';
  import type { User } from 'netsblox-cloud-client/src/types/User';
  import type { ConstructParams } from '$lib/utils/tables';

  import { Table, TableSearch, Button } from 'flowbite-svelte';
  import TableHeaders from '$lib/comp/tables/TableHeaders.svelte';
  import TableEntries from '$lib/comp/tables/TableEntries.svelte';
  import { PlusOutline, RefreshOutline, TrashBinOutline } from 'flowbite-svelte-icons';
  import DeleteEntryModal from '$lib/comp/DeleteEntryModal.svelte';
  import CreateUserModal from '$lib/comp/CreateUserModal.svelte';
  import { getErrorContext } from '$lib/contexts/ErrorContext.svelte';
  import { MemberTable } from '$lib/data/tables/members.svelte';
  import { getMembers } from '$lib/utils/api/groups';
  import Loading from '../Loading.svelte';

  type Props = {
    group: Group;
    membersAR: ResultAsync<User[], DashboardError>;
  };

  let { membersAR = $bindable(), group }: Props = $props();
  const headers = ['username', 'email', 'actions'];

  // svelte-ignore state_referenced_locally
  const params: ConstructParams<MemberTable, User> = {
    values: [],
    owner: group,
    keys: ['username', 'email'],
    searchKey: 'username',
    toaster: getErrorContext(),
    refresher: () => {
      membersAR = getMembers(fetch, group.id);
    },
  };

  let creatorOpen = $state(false);
  let deletorOpen = $state(false);
</script>

{#await membersAR}
  <Loading/>
{:then membersR}
  {#if membersR.isErr()}
    <div>Error loading group members</div>
  {:else}
    {@const members = membersR.value}
    {@const table = new MemberTable({ ...params, values: members })}
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
          <RefreshOutline/>
          <span class="hidden md:inline"> Refresh</span>
        </Button>
        <Button outline onclick={() => (creatorOpen = true)}>
          <PlusOutline /> Add Members
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
    <CreateUserModal {table} bind:open={creatorOpen} />
    <DeleteEntryModal {table} bind:open={deletorOpen} label="Users" />
  {/if}
{/await}
