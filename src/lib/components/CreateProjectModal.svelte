<script lang="ts">
  import { Button, Modal, Hr, Label, Input } from 'flowbite-svelte';
  import type { CreateLibraryData } from 'netsblox-cloud-client/src/types/CreateLibraryData';
  import Dropzone from './Dropzone.svelte';
  import type { ProjectOwnedTableContext } from '$lib/contexts/ProjectOwnedTableContext.svelte';
  import type { CreateProjectData } from 'netsblox-cloud-client/src/types/CreateProjectData';
  import { parseProject } from '$lib/utils/utils';

  type Props = {
    context: ProjectOwnedTableContext;
  };

  let { context }: Props = $props();
  let data: CreateProjectData = $state({
    name: '',
    roles: []
  });

  let file: File | undefined = $state(undefined);
  let dragging = $state(false);

  const handleCreate = async () => {
    if (!file){
      //FIXME: add error context and update it here
      return
    }
    const xml = await file.text()
    const projectObj = parseProject(xml)
    
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
