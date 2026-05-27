<script lang="ts">
  import type { ResultAsync } from 'neverthrow';
  import type { DashboardError } from '$lib/utils/errors';
  import type { ConstructParams, TableHeader } from '$lib/utils/tables';
  import type { FlatServiceSetting } from '$lib/utils/types';

  import { Table, TableSearch, Button } from 'flowbite-svelte';
  import TableHeaders from '$lib/comp/tables/TableHeaders.svelte';
  import TableEntries from '$lib/comp/tables/TableEntries.svelte';
  import { PlusOutline, RefreshOutline } from 'flowbite-svelte-icons';

  import { TrashBinOutline } from 'flowbite-svelte-icons';
  import DeleteEntryModal from '$lib/comp/modals/DeleteEntry.svelte';
  import { SettingsTable } from '$lib/data/tables/settings.svelte';
  import { getErrorContext } from '$lib/contexts/ErrorContext.svelte';
  import Loading from '$lib/comp/misc/Loading.svelte';
  import { getUserSettings } from '$lib/utils/api/services';
  import CreateSettingModal from '../modals/CreateSettingModal.svelte';

  type Props = {
    owner: string;
    serviceSettingsAR: ResultAsync<FlatServiceSetting[], DashboardError>;
  };

  let { serviceSettingsAR = $bindable(), owner }: Props = $props();
  const headers: TableHeader<FlatServiceSetting>[] = [
    { title: 'host', key: 'host' },
    { title: 'service', key: 'service' },
    { title: 'setting', key: 'name' },
    { title: 'value', key: 'value' },
  ];

  // svelte-ignore state_referenced_locally
  const tableParams: ConstructParams<SettingsTable, FlatServiceSetting> = {
    owner,
    values: [],
    keys: headers.map((v) => v.key),
    searchKey: 'name',
    toaster: getErrorContext(),
    refresher: () => {
      serviceSettingsAR = getUserSettings(fetch, owner);
    },
  };

  let creatorOpen = $state(false);
  let deletorOpen = $state(false);
</script>

{#await serviceSettingsAR}
  <Loading />
{:then settingsR}
  {#if settingsR.isErr()}
    <div>Error loading service settings</div>
  {:else}
    {@const settings = settingsR.value}
    {@const table = new SettingsTable({ ...tableParams, values: settings })}
    <span class="flex flex-row items-center justify-between">
      <TableSearch
        classes={{
          input: 'dark:focus:ring-orange-500 dark:focus:border-orange-500',
        }}
        placeholder="search by name"
        hoverable={true}
        bind:inputValue={table.search}
      />
      <menu>
        <menuitem>
          <Button outline onclick={() => table.refresh()} color="amber">
            <RefreshOutline />
            <span class="hidden md:inline"> Refresh</span>
          </Button>
        </menuitem>
        <menuitem>
          <Button outline onclick={() => (creatorOpen = true)}>
            <PlusOutline />
            <span class="hidden md:inline"> Add Setting</span>
          </Button>
        </menuitem>
        <menuitem>
          <Button
            onclick={() => (deletorOpen = true)}
            disabled={!table.entries.some((x) => x.selected)}
            outline
            color="red"
          >
            <TrashBinOutline />
            <span class="hidden md:inline"> Delete</span>
          </Button>
        </menuitem>
      </menu>
    </span>
    <Table shadow hoverable={true}>
      <TableHeaders {headers} {table} />
      <TableEntries {table} />
    </Table>
    <CreateSettingModal {table} bind:open={creatorOpen} />
    <DeleteEntryModal {table} bind:open={deletorOpen} label="Settings" />
  {/if}
{/await}
