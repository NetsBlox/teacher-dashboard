<script lang="ts">
  import type { ProjectMetadata } from 'netsblox-cloud-client/src/types/ProjectMetadata';
  import { Table, TableSearch, Button } from 'flowbite-svelte';
  import TableHeaders from './TableHeaders.svelte';
  import TableEntries from './TableEntries.svelte';
  import { PlusOutline, TrashBinOutline } from 'flowbite-svelte-icons';
  import DeleteEntryModal from './DeleteEntryModal.svelte';
  import { ProjectSharedTableContext } from '$lib/contexts/ProjectSharedTableContext.svelte';
  import CreateProjectModal from './CreateProjectModal.svelte';

  type Props = {
    projects: ProjectMetadata[];
    owner: string;
    tableBtns: boolean;
  };

  let { projects, owner, tableBtns }: Props = $props();
  const keys: (keyof ProjectMetadata)[] = ['name', 'owner'];
  const headers = ['name', 'owner', 'actions'];
  let context = $state(new ProjectSharedTableContext(owner, projects, keys, 'name'));

</script>

<span class="flex flex-row items-center justify-between">
  <TableSearch
    classInput="dark:focus:ring-orange-500 dark:focus:border-orange-500"
    placeholder="search by name"
    hoverable={true}
    bind:inputValue={context.search}
  />
  <section>
    {#if tableBtns}
    <Button outline on:click={() => (context.createOpen = true)}>
      <PlusOutline /> Import Project
    </Button>
    <Button
      on:click={() => (context.deleteOpen = true)}
      disabled={!context.entries.some((x) => x.selected)}
      outline
      color="red"
    >
      <TrashBinOutline />Delete
    </Button>
    {/if}
  </section>
</span>
<Table shadow hoverable={true}>
  <TableHeaders {headers} {context} />
  <TableEntries bind:context/>
</Table>
<CreateProjectModal {context} />
<DeleteEntryModal {context} />

