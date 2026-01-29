<script lang="ts">
  import type { Group } from 'netsblox-cloud-client/src/types/Group';
  import type { ResultAsync } from 'neverthrow';
  import type { DashboardError } from '$lib/utils/errors';
  import type { User } from 'netsblox-cloud-client/src/types/User';
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
  import CreateUserModal from '$lib/comp/modals/CreateUser.svelte';
  import { getErrorContext } from '$lib/contexts/ErrorContext.svelte';
  import { MemberTable } from '$lib/data/tables/members.svelte';
  import { getMembers } from '$lib/utils/api/groups';
  import Loading from '../misc/Loading.svelte';
  import { page } from '$app/state';

  type Props = {
    groupId: GroupId;
    membersAR: ResultAsync<User[], DashboardError>;
  };

  let { membersAR = $bindable(), groupId }: Props = $props();
  const headers = ['username', 'email', 'actions'];

  // svelte-ignore state_referenced_locally
  const params: ConstructParams<MemberTable, User> = {
    values: [],
    owner: groupId,
    keys: ['username', 'email'],
    searchKey: 'username',
    toaster: getErrorContext(),
    refresher: () => {
      membersAR = getMembers(fetch, groupId);
    },
  };

  let creatorOpen = $state(false);
  let deletorOpen = $state(false);
</script>

{#await membersAR}
  <Loading />
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
          <RefreshOutline />
          <span class="hidden md:inline"> Refresh</span>
        </Button>
        <Button outline onclick={() => (creatorOpen = true)}>
          <PlusOutline />
          <span class="hidden md:inline"> Add Members </span>
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
    <CreateUserModal {table} bind:open={creatorOpen} />
    <DeleteEntryModal {table} bind:open={deletorOpen} label="Users" />
  {/if}
{/await}
