<script lang="ts" generics="T">
  import type { hasEntries, hasKeys } from '$lib/utils/tables.svelte';
  import { isNetsbloxTime } from '$lib/utils/validators';
  import {
    TableBody,
    TableBodyRow,
    TableBodyCell,
    Checkbox,
    Button,
    ButtonGroup,
  } from 'flowbite-svelte';

  type Props = {
    context: hasEntries<T> & hasKeys<T>;
  };

  let { context }: Props = $props();
</script>

<TableBody tableBodyClass="divide-y">
  {#each context.entries as entry}
    {#if entry.visible}
      <TableBodyRow>
        <TableBodyCell class="!p-4">
          <Checkbox bind:checked={entry.selected} />
        </TableBodyCell>
        {#each context.keys as key}
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
                <Button
                  outline
                  color="primary"
                  onclick={(_e: MouseEvent) => action()}
                  >{action.name}
                </Button>
              {/each}
            </ButtonGroup>
          </TableBodyCell>
        {/if}
      </TableBodyRow>
    {/if}
  {/each}
</TableBody>
