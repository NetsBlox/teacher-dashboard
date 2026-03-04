<script lang="ts" generics="T">
  import type { HasEntries, HasKeys } from '$lib/utils/tables';
  import { isNetsbloxTime } from '$lib/utils/guards';
  import { TableBody, TableBodyRow, TableBodyCell } from 'flowbite-svelte';
  import { Checkbox, Button, ButtonGroup } from 'flowbite-svelte';

  type Props = {
    table: HasEntries<T> & HasKeys<T>;
  };

  let { table }: Props = $props();
</script>

<TableBody>
  {#each table.entries as entry}
    {#if entry.visible}
      <TableBodyRow class="h-18">
        <TableBodyCell>
          <Checkbox bind:checked={entry.selected} />
        </TableBodyCell>
        {#each table.keys as key}
          {@const cell = entry.value[key]}
          {#if isNetsbloxTime(cell)}
            {@const date = new Date(cell.secs_since_epoch * 1000)}
            <TableBodyCell>{date.toLocaleString()}</TableBodyCell>
          {:else}
            <TableBodyCell>{cell}</TableBodyCell>
          {/if}
        {/each}
        {#if entry.actions}
          <TableBodyCell>
            <ButtonGroup>
              {#each entry.actions as action}
                <Button outline color="primary" onclick={() => action()}
                  >{action.label}
                </Button>
              {/each}
            </ButtonGroup>
          </TableBodyCell>
        {/if}
      </TableBodyRow>
    {/if}
  {/each}
</TableBody>
