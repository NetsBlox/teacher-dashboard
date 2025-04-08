<script lang="ts" generics="T, CreateT">
  import type { TableContext } from '$lib/utils/types';
  import {
    TableBody,
    TableBodyRow,
    TableBodyCell,
    Checkbox,
    Button,
    ButtonGroup,
  } from 'flowbite-svelte';

  type Props = {
    context: TableContext<T, CreateT>;
  };

  let { context = $bindable() }: Props = $props();
</script>

<TableBody tableBodyClass="divide-y">
  {#each context.entries as entry}
    {#if entry.visible}
      <TableBodyRow>
        <TableBodyCell class="!p-4">
          <Checkbox bind:checked={entry.selected} />
        </TableBodyCell>
        {#each context.keys as key}
          <TableBodyCell>{entry.value[key]}</TableBodyCell>
        {/each}
        {#if context.actions}
          <TableBodyCell>
            <ButtonGroup>
              {#each context.actions as action}
                <Button
                  outline
                  color="primary"
                  onclick={(_e: MouseEvent) => action(entry)}
                  >{action.name}</Button
                >
              {/each}
            </ButtonGroup>
          </TableBodyCell>
        {/if}
      </TableBodyRow>
    {/if}
  {/each}
</TableBody>
