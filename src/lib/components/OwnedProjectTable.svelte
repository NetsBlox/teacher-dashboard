<script lang="ts">
  import type { ProjectMetadata } from 'netsblox-cloud-client/src/types/ProjectMetadata';
  import { Table, TableSearch, Button } from 'flowbite-svelte';
  import TableHeaders from './TableHeaders.svelte';
  import TableEntries from './TableEntries.svelte';
  import { PlusOutline, TrashBinOutline } from 'flowbite-svelte-icons';
  import DeleteEntryModal from './DeleteEntryModal.svelte';
  import CreateProjectModal from './CreateProjectModal.svelte';
  import { OwnedProjectTableContext } from '$lib/contexts/ProjectOwnedTableContext.svelte';
  import { getErrorContext } from '$lib/contexts/ErrorContext.svelte';

  type Props = {
    projects: ProjectMetadata[];
    owner: string;
  };

  const { projects, owner }: Props = $props();
  const keys: (keyof ProjectMetadata)[] = ['name', 'originTime', 'updated'];
  const headers = ['name', 'created', 'last modified', 'actions'];
  const toaster = getErrorContext();
  const context = new OwnedProjectTableContext(
    owner,
    projects,
    keys,
    'name',
    toaster,
  );

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
      <PlusOutline /> Import Project
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
<CreateProjectModal {context} bind:open={creatorOpen} />
<DeleteEntryModal {context} label="Projects" bind:open={deletorOpen} />
