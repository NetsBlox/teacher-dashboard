<script lang="ts" generics="T">
  import type { hasEntries } from '$lib/utils/tables.svelte';
  import { TableHead, TableHeadCell, Checkbox } from 'flowbite-svelte';

  type Props = {
    context: hasEntries<T>;
    headers: string[];
  };

  const { headers, context }: Props = $props();
  let checked = $state(false);

  const checkAll= () => {
    context.entries.forEach((entry) => {
      if (entry.visible) {
        entry.selected = checked;
      }
    });
  };
</script>

<TableHead>
  <TableHeadCell class="!p-4">
    <Checkbox on:change={() => checkAll()} bind:checked={checked} />
  </TableHeadCell>
  {#each headers as header}
    <TableHeadCell>{header}</TableHeadCell>
  {/each}
</TableHead>
