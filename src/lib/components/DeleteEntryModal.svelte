<script lang="ts" generics="T">
  import type { HasEntries, Deleteable } from '$lib/utils/tables.svelte';
  import { Button, Modal, Hr } from 'flowbite-svelte';

  interface Props {
    context: HasEntries<T> & Deleteable;
    label: String;
    open: boolean;
  }

  let { context, label, open = $bindable()}: Props = $props();
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
          context.deleteSelected();
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
