<script lang="ts">
  import type { Group } from 'netsblox-cloud-client/src/types/Group';
  import { Table, TableSearch, Button } from 'flowbite-svelte';
  import TableHeaders from './TableHeaders.svelte';
  import TableEntries from './TableEntries.svelte';
  import { PlusOutline, TrashBinOutline } from 'flowbite-svelte-icons';
  import DeleteEntryModal from './DeleteEntryModal.svelte';
  import { GroupTableContext } from '$lib/contexts/GroupTableContext.svelte';
  import CreateGroupModal from './CreateGroupModal.svelte';

  type Props = {
    owner: string;
    groups: Group[];
  };

  let { groups, owner }: Props = $props();
  const keys: (keyof Group)[] = ['name', 'owner'];
  const headers = ['name', 'owner', 'actions'];
  let context = $state(new GroupTableContext(owner, groups, keys, 'name'));
</script>

<span class="flex flex-row items-center justify-between">
  <TableSearch
    classInput="dark:focus:ring-orange-500 dark:focus:border-orange-500"
    placeholder="search by name"
    hoverable={true}
    bind:inputValue={context.search}
  />
  <section>
    <Button outline on:click={() => (context.createOpen = true)}>
      <PlusOutline /> Add Group
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
  <TableHeaders {headers} bind:context />
  <TableEntries bind:context />
</Table>
<CreateGroupModal bind:context />
<DeleteEntryModal bind:context />
