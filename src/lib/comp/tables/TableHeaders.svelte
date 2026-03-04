<script lang="ts" generics="T">
  import type { HasEntries } from '$lib/utils/tables';
  import { TableHead, TableHeadCell, Checkbox } from 'flowbite-svelte';

  type Props = {
    table: HasEntries<T>;
    headers: string[];
  };

  const { headers, table }: Props = $props();
  let checked = $state(false);

  const checkAll= () => {
    table.entries.forEach((entry) => {
      if (entry.visible) {
        entry.selected = checked;
      }
    });
  };
</script>

<TableHead>
  <TableHeadCell class="p-4!">
    <Checkbox onchange={() => checkAll()} bind:checked={checked} />
  </TableHeadCell>
  {#each headers as header}
    <TableHeadCell>{header}</TableHeadCell>
  {/each}
</TableHead>
