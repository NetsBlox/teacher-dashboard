<script lang="ts">
  import type { ProjectMetadata } from 'netsblox-cloud-client/src/types/ProjectMetadata';
  import { Table, TableSearch } from 'flowbite-svelte';
  import TableHeaders from './TableHeaders.svelte';
  import TableEntries from './TableEntries.svelte';
  import DeleteEntryModal from './DeleteEntryModal.svelte';
  import { ProjectSharedTableContext } from '$lib/contexts/ProjectSharedTableContext.svelte';
  import CreateProjectModal from './CreateProjectModal.svelte';

  type Props = {
    projects: ProjectMetadata[];
    owner: string;
  };

  let { projects, owner }: Props = $props();
  const keys: (keyof ProjectMetadata)[] = ['name', 'owner'];
  const headers = ['name', 'owner', 'actions'];
  const context = new ProjectSharedTableContext(owner, projects, keys, 'name');

</script>

<span class="flex flex-row items-center justify-between">
  <TableSearch
    classInput="dark:focus:ring-orange-500 dark:focus:border-orange-500"
    placeholder="search by name"
    hoverable={true}
    bind:inputValue={context.search}
  />
  <section>
  </section>
</span>
<Table shadow hoverable={true}>
  <TableHeaders {headers} {context} />
  <TableEntries {context}/>
</Table>
<CreateProjectModal {context} />
<DeleteEntryModal {context} label="Projects"/>

