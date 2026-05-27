<script lang="ts">
  import type { DashboardError } from '$lib/utils/errors';
  import type { ResultAsync } from 'neverthrow';
  import type { ProjectMetadata } from 'netsblox-cloud-client/src/types/ProjectMetadata';
  import type { ConstructParams, TableHeader } from '$lib/utils/tables';

  import { Table, TableSearch, Button } from 'flowbite-svelte';
  import TableHeaders from '$lib/comp/tables/TableHeaders.svelte';
  import TableEntries from '$lib/comp/tables/TableEntries.svelte';
  import {
    PlusOutline,
    RefreshOutline,
    TrashBinOutline,
  } from 'flowbite-svelte-icons';
  import DeleteEntryModal from '$lib/comp/modals/DeleteEntry.svelte';
  import CreateProjectModal from '$lib/comp/modals/CreateProject.svelte';
  import { ProjectTable } from '$lib/data/tables/projects.svelte';
  import { getErrorContext } from '$lib/contexts/ErrorContext.svelte';
  import Loading from '$lib/comp/misc/Loading.svelte';
  import { getProjects } from '$lib/utils/api/projects';

  type Props = {
    projectsAR: ResultAsync<ProjectMetadata[], DashboardError>;
    owner: string;
  };

  let { projectsAR = $bindable(), owner }: Props = $props();

  const headers: TableHeader<ProjectMetadata>[] = [
    { title: 'name', key: 'name' },
    { title: 'created', key: 'originTime' },
    { title: 'last modified', key: 'updated' },
  ];

  // svelte-ignore state_referenced_locally
  const params: ConstructParams<ProjectTable, ProjectMetadata> = {
    keys: headers.map((v) => v.key),
    owner: owner,
    refresher: () => (projectsAR = getProjects(fetch, owner)),
    searchKey: 'name',
    toaster: getErrorContext(),
    values: [],
  };

  let creatorOpen = $state(false);
  let deletorOpen = $state(false);
</script>

{#await projectsAR}
  <Loading />
{:then projectsR}
  {#if projectsR.isErr()}
    <div>Error loading group</div>
  {:else}
    {@const projects = projectsR.value}
    {@const table = new ProjectTable({ ...params, values: projects })}

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
        <Button outline onclick={() => table.refresh()} color="amber">
          <RefreshOutline />
          <span class="hidden md:inline"> Refresh</span>
        </Button>
        <Button outline onclick={() => (creatorOpen = true)}>
          <PlusOutline />
          <span class="hidden md:inline"> Import Project</span>
        </Button>
        <Button
          onclick={() => (deletorOpen = true)}
          disabled={!table.entries.some((x) => x.selected)}
          outline
          color="red"
        >
          <TrashBinOutline />
          <span class="hidden md:inline"> Delete </span>
        </Button>
      </section>
    </span>
    <Table shadow hoverable={true}>
      <TableHeaders {headers} {table} addActions/>
      <TableEntries {table} />
    </Table>
    <CreateProjectModal {table} bind:open={creatorOpen} />
    <DeleteEntryModal {table} label="Projects" bind:open={deletorOpen} />
  {/if}
{/await}
