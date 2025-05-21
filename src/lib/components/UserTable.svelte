
<script lang="ts">
  import type { User } from 'netsblox-cloud-client/src/types/User';
  import { Table, TableSearch, Button } from 'flowbite-svelte';
  import TableHeaders from './TableHeaders.svelte';
  import TableEntries from './TableEntries.svelte';
  import { PlusOutline, TrashBinOutline } from 'flowbite-svelte-icons';
  import DeleteEntryModal from './DeleteEntryModal.svelte';
  import { GroupUserTableContext } from '$lib/contexts/GroupUserTableContext.svelte';
  import CreateUserModal from './CreateUserModal.svelte';


  type Props = {
    groupId: string;
    members: User[];
  };

  let { members, groupId }: Props = $props();
  const keys: (keyof User)[] = ['username', 'email' ];
  const headers = ['username', 'email', 'actions'];
  const context = new GroupUserTableContext(groupId, members, keys, 'username');
</script>

<span class="flex flex-row items-center justify-between">
  <TableSearch
    classInput="dark:focus:ring-orange-500 dark:focus:border-orange-500"
    placeholder="search by username"
    hoverable={true}
    bind:inputValue={context.search}
  />
  <section>
    <Button outline on:click={() => (context.createOpen = true)}>
      <PlusOutline /> Add Members
    </Button>
    <Button
      on:click={() => (context.deleteOpen = true)}
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
<CreateUserModal {context} />
<DeleteEntryModal {context} label="Users"/>
