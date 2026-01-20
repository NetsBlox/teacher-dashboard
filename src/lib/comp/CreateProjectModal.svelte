<script lang="ts">
  import type { ProjectTable } from '$lib/data/tables/projects.svelte';

  import { Button, Modal, Hr, Label } from 'flowbite-svelte';
  import Dropzone from './Dropzone.svelte';
  import { parseProject } from '$lib/utils/misc';
  import { DashboardError } from '$lib/utils/errors';

  type Props = {
    table: ProjectTable;
    open: boolean;
  };

  let { table, open = $bindable() }: Props = $props();
  let file: File | undefined = $state(undefined);
  let dragging = $state(false);

  const handleCreate = async () => {
    if (!file) {
      throw DashboardError.create('File not selected.').toast(table.toaster);
    }
    const xml = await file.text();
    const result = parseProject(xml);
    result
      .orTee((de) => de.toast(table.toaster))
      .map((data) => table.createProject(data));
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
