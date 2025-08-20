<script lang="ts">
  import type { User } from 'netsblox-cloud-client/src/types/User';
  import { Table, TableSearch, Button } from 'flowbite-svelte';
  import TableHeaders from './TableHeaders.svelte';
  import TableEntries from './TableEntries.svelte';
  import { PlusOutline, TrashBinOutline } from 'flowbite-svelte-icons';
  import DeleteEntryModal from './DeleteEntryModal.svelte';
  import CreateUserModal from './CreateUserModal.svelte';
  import { MemberTableContext } from '$lib/contexts/MembersTableContext.svelte';
  import { getErrorContext } from '$lib/contexts/ErrorContext.svelte';
  import type { Group } from 'netsblox-cloud-client/src/types/Group';

  type Props = {
    group: Group;
    members: User[];
  };

  let { members, group }: Props = $props();
  const keys: (keyof User)[] = ['username', 'email'];
  const headers = ['username', 'email', 'actions'];
  const toaster = getErrorContext();
  const context = new MemberTableContext(
    group,
    members,
    keys,
    'username',
    toaster,
  );

  let creatorOpen = $state(false);
  let deletorOpen = $state(false);
</script>

<span class="flex flex-row items-center justify-between">
  <TableSearch
    classInput="dark:focus:ring-orange-500 dark:focus:border-orange-500"
    placeholder="search by username"
    hoverable={true}
    bind:inputValue={context.search}
  />
  <section>
    <Button outline on:click={() => (creatorOpen = true)}>
      <PlusOutline /> Add Members
    </Button>
    <Button
      on:click={() => (deletorOpen = true)}
      disabled={!context.entries.some((x) => x.selected)}
      outline
      color="red"
    >
      <TrashBinOutline />Delete
    </Button>
  </section>
</span>
<Table shadow hoverable={true}>
  <TableHeaders {headers} {context} />
  <TableEntries {context} />
</Table>
<CreateUserModal {context} bind:open={creatorOpen} />
<DeleteEntryModal {context} bind:open={deletorOpen} label="Users" />
