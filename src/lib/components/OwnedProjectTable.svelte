<script lang="ts">
  import type { ProjectMetadata } from 'netsblox-cloud-client/src/types/ProjectMetadata';
  import { Table, TableSearch, Button } from 'flowbite-svelte';
  import TableHeaders from './TableHeaders.svelte';
  import TableEntries from './TableEntries.svelte';
  import { PlusOutline, TrashBinOutline } from 'flowbite-svelte-icons';
  import DeleteEntryModal from './DeleteEntryModal.svelte';
  import CreateProjectModal from './CreateProjectModal.svelte';
  import { ProjectOwnedTableContext } from '$lib/contexts/ProjectOwnedTableContext.svelte';

  type Props = {
    projects: ProjectMetadata[];
    owner: string;
  };

  let { projects, owner }: Props = $props();
  const keys: (keyof ProjectMetadata)[] = ['name', 'owner'];
  const headers = ['name', 'owner', 'actions'];
  const context = new ProjectOwnedTableContext(owner, projects, keys, 'name');

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
  </section>
</span>
<Table shadow hoverable={true}>
  <TableHeaders {headers} {context} />
  <TableEntries {context}/>
</Table>
<CreateProjectModal {context} />
<DeleteEntryModal {context} label="Projects"/>

