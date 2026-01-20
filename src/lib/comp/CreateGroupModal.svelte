<script lang="ts">
  import { Button, Modal, Hr, Label, Input } from 'flowbite-svelte';
  import type { GroupTable } from '$lib/data/tables/groups.svelte';
  import type { CreateGroupData } from 'netsblox-cloud-client/src/types/CreateGroupData';

  type Props = {
    table: GroupTable;
    open: boolean;
  };

  let { table, open = $bindable()}: Props = $props();
  const data: CreateGroupData = $state({ name: '', servicesHosts: undefined });
</script>

<Modal bind:open title="Create New Group" size="xs">
  <form class="flex flex-col gap-2">
    <Label>Name:</Label>
    <Input bind:value={data.name} />
    <Hr />
    <span>
      <Button
        outline
        onclick={() => {
          table.createGroup(data);
          open = false;
        }}
        class="self-start"
      >
        Create
      </Button>
    </span>
  </form>
</Modal>
