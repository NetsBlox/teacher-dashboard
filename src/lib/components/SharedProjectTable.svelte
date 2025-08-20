<script lang="ts">
  import type { ProjectMetadata } from 'netsblox-cloud-client/src/types/ProjectMetadata';
  import { Table, TableSearch } from 'flowbite-svelte';
  import TableHeaders from './TableHeaders.svelte';
  import TableEntries from './TableEntries.svelte';
  import { SharedProjectTableContext } from '$lib/contexts/ProjectSharedTableContext.svelte';
  import { getErrorContext } from '$lib/contexts/ErrorContext.svelte';

  type Props = {
    projects: ProjectMetadata[];
    owner: string;
  };

  let { projects, owner }: Props = $props();
  const keys: (keyof ProjectMetadata)[] = ['name', 'owner', 'originTime', 'updated'];
  const headers = ['name', 'owner','created', 'last modified', 'actions'];
  const toaster = getErrorContext()
  const context = new SharedProjectTableContext(owner, projects, keys, 'name', toaster);

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

