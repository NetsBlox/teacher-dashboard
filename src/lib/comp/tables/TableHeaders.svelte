<script lang="ts" generics="T">
  import { isNetsbloxTime } from '$lib/utils/guards';
  import type { HasEntries, TableEntry, TableHeader } from '$lib/utils/tables';
  import { TableHead, TableHeadCell, Checkbox } from 'flowbite-svelte';
  import { ArrowDownOutline } from 'flowbite-svelte-icons';

  type Props = {
    table: HasEntries<T>;
    headers: TableHeader<T>[];
    addActions?: boolean;
  };

  const { headers, table, addActions = false }: Props = $props();

  let checked = $state(false);
  let ascending = $state(true);
  let sortIdx = $state(NaN);

  const checkAll = () => {
    table.entries.forEach((entry) => {
      if (entry.visible) {
        entry.selected = checked;
      }
    });
  };

  const getValue = (entry: TableEntry<T>) => {
    const value = entry.value[headers[sortIdx].key];
    if (isNetsbloxTime(value)) return value.secs_since_epoch;
    else return value;
  };

  const makeSorter = () => {
    if (ascending) {
      return (a: TableEntry<T>, b: TableEntry<T>) =>
        Number(getValue(a) < getValue(b));
    } else {
      return (a: TableEntry<T>, b: TableEntry<T>) =>
        Number(getValue(a) > getValue(b));
    }
  };

  const handleSort = (newIdx: number) => {
    if (sortIdx == newIdx) {
      ascending = !ascending;
    } else {
      sortIdx = newIdx;
    }

    const sorter = makeSorter();
    table.entries.sort(sorter);
  };
</script>

<TableHead>
  <TableHeadCell class="p-4!">
    <Checkbox onchange={() => checkAll()} bind:checked />
  </TableHeadCell>
  {#each headers as header, idx}
    <TableHeadCell>
      <button
        onclick={() => handleSort(idx)}
        class="hover:text-primary-500 text-md flex cursor-pointer align-middle uppercase"
      >
        {header.title}
        <ArrowDownOutline
          class={`inline ${sortIdx != idx ? 'opacity-0' : ''} ${ascending ? 'rotate-180' : ''}`}
          size="sm"
        />
      </button>
    </TableHeadCell>
  {/each}
  {#if addActions == true}
    <TableHeadCell>Actions</TableHeadCell>
  {/if}
</TableHead>
