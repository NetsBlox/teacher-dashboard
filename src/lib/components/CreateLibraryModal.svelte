<script lang="ts">
  import { Button, Modal, Hr, Label, Input } from 'flowbite-svelte';
  import type { LibraryTableContext } from '$lib/contexts/LibraryTableContext.svelte';
  import type { CreateLibraryData } from 'netsblox-cloud-client/src/types/CreateLibraryData';
  import Dropzone from './Dropzone.svelte';

  type Props = {
    context: LibraryTableContext;
  };

  let { context }: Props = $props();
  let data: CreateLibraryData = $state({
    name: '',
    notes: '',
    blocks: '',
  });
  let file: File | undefined = $state(undefined);
  let dragging = $state(false);
</script>

<Modal
  bind:open={context.createOpen}
  ondragover={(_e) => (dragging = true)}
  ondragleave={(_e) => (dragging = false)}
  title="Add Library From File"
  size="xs"
  classDialog="inset-0"
>
  <form class="flex flex-col gap-2" ondragover={(_e) => (dragging = true)}>
    <Label>Name:</Label>
    <Input bind:value={data.name} />
    <Label>Notes:</Label>
    <Input bind:value={data.notes} />
    <Label>File:</Label>
    <Dropzone bind:file {dragging} acceptType=".xml" />
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
