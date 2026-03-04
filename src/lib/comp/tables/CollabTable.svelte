<script lang="ts">
  import type { ProjectMetadata } from 'netsblox-cloud-client/src/types/ProjectMetadata';
  import type { ResultAsync } from 'neverthrow';
  import type { DashboardError } from '$lib/utils/errors';
  import type { ConstructParams } from '$lib/utils/tables';

  import { Button, Table, TableSearch } from 'flowbite-svelte';
  import TableHeaders from '$lib/comp/tables/TableHeaders.svelte';
  import TableEntries from '$lib/comp/tables/TableEntries.svelte';
  import { CollabTable } from '$lib/data/tables/collab.svelte';
  import { getErrorContext } from '$lib/contexts/ErrorContext.svelte';
  import Loading from '$lib/comp/misc/Loading.svelte';
  import { getCollabs } from '$lib/utils/api/projects';
  import { RefreshOutline } from 'flowbite-svelte-icons';

  type Props = {
    projectsAR: ResultAsync<ProjectMetadata[], DashboardError>;
    owner: string;
  };

  let { projectsAR = $bindable(), owner }: Props = $props();

  const headers = ['name', 'owner', 'created', 'last modified', 'actions'];
  // svelte-ignore state_referenced_locally
  const tableParams: ConstructParams<CollabTable, ProjectMetadata> = {
    owner,
    values: [],
    keys: ['name', 'owner', 'originTime', 'updated'],
    searchKey: 'name',
    toaster: getErrorContext(),
    refresher: () => {
      projectsAR = getCollabs(fetch, owner);
    },
  };
</script>

{#await projectsAR}
  <Loading />
{:then projectsR}
  {#if projectsR.isErr()}
    <div>Error loading group</div>
  {:else}
    {@const projects = projectsR.value}
    {@const table = new CollabTable({ ...tableParams, values: projects })}

    <span class="flex flex-row items-center justify-between">
      <TableSearch
        classes={{
          input: 'dark:focus:ring-orange-500 dark:focus:border-orange-500',
        }}
        placeholder="search by name"
        hoverable={true}
        bind:inputValue={table.search}
      />
      <section>
        <Button color="amber" outline onclick={() => table.refresh()}>
          <RefreshOutline />
          <span class="hidden md:inline"> Refresh </span>
        </Button>
      </section>
    </span>
    <Table shadow hoverable={true}>
      <TableHeaders {headers} {table} />
      <TableEntries {table} />
    </Table>
  {/if}
{/await}
