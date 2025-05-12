<script lang="ts" generics="T">
  import { TableHead, TableHeadCell, Checkbox } from 'flowbite-svelte';
  import type { TableContext, TableEntry } from '$lib/utils/types';

  type Props = {
    context: TableContext<T>;
    headers: string[];
  };

  let { headers, context = $bindable() }: Props = $props();
  let checkAll = $state(false);

  const onCheckAll = (value: boolean) => {
    context.entries.forEach((entry) => {
      if (entry.visible) {
        entry.selected = value;
      }
    });
  };
</script>

<TableHead>
  <TableHeadCell class="!p-4">
    <Checkbox on:change={() => onCheckAll(checkAll)} bind:checked={checkAll} />
  </TableHeadCell>
  {#each headers as header}
    <TableHeadCell>{header}</TableHeadCell>
  {/each}
</TableHead>
