<script lang="ts">
  import { Button, Modal, Hr, Label } from 'flowbite-svelte';
  import Dropzone from './Dropzone.svelte';
  import type { ProjectOwnedTableContext } from '$lib/contexts/ProjectOwnedTableContext.svelte';
  import { parseProject } from '$lib/utils/utils';
  import { ErrorSetContext } from '$lib/contexts/Contexts.svelte';

  type Props = {
    context: ProjectOwnedTableContext;
  };

  const { context }: Props = $props();
  let file: File | undefined = $state(undefined);
  let dragging = $state(false);

  const handleCreate = async () => {
    if (!file){
      ErrorSetContext.push(Error("No file was uploaded"))
      return
    }
    const xml = await file.text()
    const data = await parseProject(xml)
    await context.createEntry(data)
  }
</script>

<Modal
  bind:open={context.createOpen}
  ondragover={(_e) => (dragging = true)}
  ondragleave={(_e) => (dragging = false)}
  title="Add Project From File"
  size="xs"
>
  <form class="flex flex-col gap-2" ondragover={(_e) => (dragging = true)}>
    <Label>File:</Label>
    <Dropzone bind:file {dragging} acceptType=".xml" />
    <Hr />
    <span>
      <Button
        outline
        onclick={() => handleCreate()}
        class="self-start"
      >
        Create
      </Button>
    </span>
  </form>
</Modal>
