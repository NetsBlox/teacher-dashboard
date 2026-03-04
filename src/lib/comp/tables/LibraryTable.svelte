<script lang="ts">
  import type { LibraryMetadata } from 'netsblox-cloud-client/src/types/LibraryMetadata';
  import { type ResultAsync } from 'neverthrow';
  import { type DashboardError } from '$lib/utils/errors';
  import type { ConstructParams } from '$lib/utils/tables';

  import { LibraryTable } from '$lib/data/tables/library.svelte';
  import { Table, TableSearch, Button } from 'flowbite-svelte';
  import TableHeaders from '$lib/comp/tables/TableHeaders.svelte';
  import TableEntries from '$lib/comp/tables/TableEntries.svelte';
  import {
    PlusOutline,
    RefreshOutline,
    TrashBinOutline,
  } from 'flowbite-svelte-icons';
  import DeleteEntryModal from '$lib/comp/modals/DeleteEntry.svelte';
  import CreateLibraryModal from '$lib/comp/modals/CreateLibrary.svelte';
  import { getErrorContext } from '$lib/contexts/ErrorContext.svelte';
  import Loading from '$lib/comp/misc/Loading.svelte';
  import { getLibraries } from '$lib/utils/api/libraries';

  type Props = {
    owner: string;
    librariesAR: ResultAsync<LibraryMetadata[], DashboardError>;
  };

  let { owner, librariesAR = $bindable() }: Props = $props();

  let creatorOpen = $state(false);
  let deletorOpen = $state(false);
  const headers = ['name', 'state'];

  // svelte-ignore state_referenced_locally
  const tableParams: ConstructParams<LibraryTable, LibraryMetadata> = {
    owner,
    values: [],
    keys: ['name', 'state'],
    searchKey: 'name',
    toaster: getErrorContext(),
    refresher: () => {
      librariesAR = getLibraries(fetch, owner);
    },
  };
</script>

{#await librariesAR}
  <Loading />
{:then librariesR}
  {#if librariesR.isErr()}
    <div>Error loading group</div>
  {:else}
    {@const libs = librariesR.value}
    {@const table = new LibraryTable({ ...tableParams, values: libs })}
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
          <span class="hidden md:inline"> Import </span>
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
      <TableHeaders {headers} {table} />
      <TableEntries {table} />
    </Table>

    <CreateLibraryModal {table} bind:open={creatorOpen} />
    <DeleteEntryModal {table} label="Libraries" bind:open={deletorOpen} />
  {/if}
{/await}
