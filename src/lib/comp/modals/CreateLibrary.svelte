<script lang="ts">
  import { Button, Modal, Hr, Label, Input } from 'flowbite-svelte';
  import type { CreateLibraryData } from 'netsblox-cloud-client/src/types/CreateLibraryData';
  import Dropzone from '../misc/Dropzone.svelte';
  import { LibraryTable } from '$lib/data/tables/library.svelte';
  import { fromPromise } from 'neverthrow';
  import { DashboardError } from '$lib/utils/errors';

  type Props = {
    table: LibraryTable;
    open: boolean;
  };

  let { table, open = $bindable() }: Props = $props();

  let data: CreateLibraryData = $state({ name: '', notes: '', blocks: '' });
  let file: File | undefined = $state(undefined);
  let dragging = $state(false);

  const handleCreate = () => {
    open = false;
    const getBlocks = async () => (file ? await file.text() : '');
    const ParsingFileError = DashboardError.create('Failed to parse file.');

    fromPromise(getBlocks(), () => null)
      .orTee(() => ParsingFileError.toast(table.toaster))
      .andThen((blocks) => table.createLibrary({ ...data, blocks }));
  };
</script>

<Modal
  bind:open
  ondragover={(_e) => (dragging = true)}
  ondragleave={(_e) => (dragging = false)}
  title="Add Library From File"
  size="xs"
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
      <Button outline onclick={() => handleCreate()} class="self-start">
        Create
      </Button>
    </span>
  </form>
</Modal>
