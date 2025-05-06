<script lang="ts" generics="T, CreateT, TOwner">
  import { type TableContext } from '$lib/utils/types';
  import { isNetsbloxTime } from '$lib/utils/validators';
  import { capitalize } from '$lib/utils/utils';
  import {
    TableBody,
    TableBodyRow,
    TableBodyCell,
    Checkbox,
    Button,
    ButtonGroup,
  } from 'flowbite-svelte';

  type Props = {
    context: TableContext<T, CreateT, TOwner>; 
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
          {@const cell = entry.value[key]}
          {#if isNetsbloxTime(cell)}
            {@const date = new Date(cell.secs_since_epoch * 1000)}
            <TableBodyCell>{date.toLocaleString()}</TableBodyCell>
          {:else}
            <TableBodyCell>{cell}</TableBodyCell>
          {/if}
        {/each}
        {#if context.actions}
          <TableBodyCell>
            <ButtonGroup>
              {#each context.actions as action}
                <Button
                  outline
                  color="primary"
                  onclick={(_e: MouseEvent) => action(entry, context.owner)}
                  >{capitalize(action.name)}</Button
                >
              {/each}
            </ButtonGroup>
          </TableBodyCell>
        {/if}
      </TableBodyRow>
    {/if}
  {/each}
</TableBody>
