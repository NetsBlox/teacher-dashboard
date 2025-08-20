<script lang="ts">
  import type { Group } from 'netsblox-cloud-client/src/types/Group';
  import { Table, TableSearch, Button } from 'flowbite-svelte';
  import TableHeaders from './TableHeaders.svelte';
  import TableEntries from './TableEntries.svelte';
  import { PlusOutline, TrashBinOutline } from 'flowbite-svelte-icons';
  import DeleteEntryModal from './DeleteEntryModal.svelte';
  import { GroupTableContext } from '$lib/contexts/GroupTableContext.svelte';
  import CreateGroupModal from './CreateGroupModal.svelte';
  import { getErrorContext } from '$lib/contexts/ErrorContext.svelte';

  type Props = {
    owner: string;
    groups: Group[];
  };

  const { groups, owner }: Props = $props();
  const keys: (keyof Group)[] = ['name'];
  const headers = ['name', 'actions'];
  const toaster = getErrorContext()
  const context = new GroupTableContext(owner, groups, keys, 'name', toaster);

  let creatorOpen = $state(false);
  let deletorOpen = $state(false);
</script>

<span class="flex flex-row items-center justify-between">
  <TableSearch
    classInput="dark:focus:ring-orange-500 dark:focus:border-orange-500"
    placeholder="search by name"
    hoverable={true}
    bind:inputValue={context.search}
  />
  <section>
    <Button outline on:click={() => (creatorOpen = true)}>
      <PlusOutline /> Add Group
    </Button>
    <Button
      on:click={() => (deletorOpen= true)}
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
<CreateGroupModal {context} bind:open={creatorOpen}  />
<DeleteEntryModal {context} bind:open={deletorOpen} label="Groups" />
