<script lang="ts" generics="T">
  import type { HasEntries, Deleteable } from '$lib/utils/tables';
  import { Button, Modal, Hr } from 'flowbite-svelte';

  interface Props {
    table: HasEntries<T> & Deleteable<T>;
    label: String;
    open: boolean;
  }

  let { table, label, open = $bindable()}: Props = $props();
</script>

<Modal bind:open title={`Delete Selected ${label}?`} size="xs">
  <form class="flex flex-col gap-2">
    <h3>Warning! This cannot be undone. Selected {label} will be lost.</h3>
    <Hr />
    <span class="flex flex-row justify-between">
      <Button
        outline
        color="red"
        onclick={() => {
          table.deleteSelected();
          open = false;
        }}
      >
        Confirm
      </Button>
      <Button outline color="alternative" onclick={() => (open = false)}>
        Cancel
      </Button>
    </span>
  </form>
</Modal>
