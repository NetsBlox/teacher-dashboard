<script lang="ts">
  import { Button, Modal, Hr, Label } from 'flowbite-svelte';
  import Dropzone from './Dropzone.svelte';
  import type { OwnedProjectTableContext } from '$lib/contexts/ProjectOwnedTableContext.svelte';
  import { parseProject } from '$lib/utils/utils';
  import { DashboardError } from '$lib/utils/errors';

  type Props = {
    context: OwnedProjectTableContext;
    open: boolean;
  };

  let { context, open = $bindable() }: Props = $props();
  let file: File | undefined = $state(undefined);
  let dragging = $state(false);

  const handleCreate = async () => {
    if (!file) {
      throw DashboardError.create('File not selected.').toast(context.toaster);
    }
    const xml = await file.text();
    const promise = parseProject(xml);
    promise.catch((de: DashboardError) => de.toast(context.toaster));
    const data = await promise;
    await context.createProject(data);
  };
</script>

<Modal
  bind:open
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
        onclick={() => {
          handleCreate();
          open = false;
        }}
        class="self-start"
      >
        Create
      </Button>
    </span>
  </form>
</Modal>
