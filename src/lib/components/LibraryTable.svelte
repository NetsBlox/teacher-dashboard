<script lang="ts">
  import type { LibraryMetadata } from 'netsblox-cloud-client/src/types/LibraryMetadata';
  import { LibraryTableContext } from '$lib/contexts/LibraryTableContext.svelte';
  import { Table, TableSearch, Button } from 'flowbite-svelte';
  import TableHeaders from './TableHeaders.svelte';
  import TableEntries from './TableEntries.svelte';
  import { PlusOutline, TrashBinOutline } from 'flowbite-svelte-icons';
  import DeleteEntryModal from './DeleteEntryModal.svelte';
  import CreateLibraryModal from './CreateLibraryModal.svelte';
  import { getErrorContext } from '$lib/contexts/ErrorContext.svelte';

  type Props = {
    owner: string;
    libraries: LibraryMetadata[];
  };

  let { owner, libraries }: Props = $props();

  const headers = ['name', 'state'];
  const keys: (keyof LibraryMetadata)[] = ['name', 'state'];
  const toaster = getErrorContext()
  const context = new LibraryTableContext(owner, libraries, keys, 'name', toaster);

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
      <PlusOutline /> Import
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

<CreateLibraryModal {context} bind:open={creatorOpen} />
<DeleteEntryModal {context} label="Libraries" bind:open={deletorOpen}/>
