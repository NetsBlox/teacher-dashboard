<script lang="ts">
  import { Button, Modal, Hr, Label, Input } from 'flowbite-svelte';
  import type { GroupTable } from '$lib/data/tables/groups.svelte';
  import type { UpdateGroupData } from 'netsblox-cloud-client/src/types/UpdateGroupData';

  type Props = {
    table: GroupTable;
    open: boolean;
  };

  let { table, open = $bindable() }: Props = $props();
  const data: UpdateGroupData = $state({ name: '' });
  const editing = $derived(table.entries.filter((entry) => entry.editing));
</script>

{#if editing.length === 1}
  {@const entry = editing[0]}
  <Modal
    bind:open
    title={`Editing Group: ${entry.value.name}`}
    size="xs"
    onclose={() => table.entries.forEach((entry) => (entry.editing = false))}
  >
    <form class="flex flex-col gap-2">
      <Label>Name:</Label>
      <Input bind:value={data.name} />
      <Hr />
      <span>
        <Button
          outline
          onclick={() => {
            table.updateGroup(entry.value.id, data);
            open = false;
          }}
          class="self-start"
        >
          Update
        </Button>
      </span>
    </form>
  </Modal>
{/if}
