<!-- TODO: Once services are seperated --->
<!-- add option to select which services the group has access to -->
<script lang="ts">
  import { Button, Modal, Hr, Label, Input } from 'flowbite-svelte';
  import type { GroupTableContext } from '$lib/contexts/GroupTableContext.svelte';
  import type { CreateGroupData } from 'netsblox-cloud-client/src/types/CreateGroupData';

  type Props = {
    context: GroupTableContext;
  };

  const { context }: Props = $props();
  const data: CreateGroupData = $state({ name: '', servicesHosts: undefined });
  let dragging = $state(false);
</script>

<Modal
  bind:open={context.createOpen}
  ondragover={(_e) => (dragging = true)}
  ondragleave={(_e) => (dragging = false)}
  title="Create New Group"
  size="xs"
  classDialog="inset-0"
>
  <form class="flex flex-col gap-2" ondragover={(_e) => (dragging = true)}>
    <Label>Name:</Label>
    <Input bind:value={data.name} />
    <Hr />
    <span>
      <Button
        outline
        onclick={() => context.createEntry(data)}
        class="self-start"
      >
        Create
      </Button>
    </span>
  </form>
</Modal>
