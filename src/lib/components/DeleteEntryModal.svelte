<script lang="ts" generics="T, CreateT, TOwner">
  import { Button, Modal, Hr } from 'flowbite-svelte';
  import type { TableContext } from '$lib/utils/types';

  type Props = {
    context: TableContext<T, CreateT, TOwner>;
    label: String
  };

  const { context , label}: Props = $props();
</script>

<Modal
  bind:open={context.deleteOpen}
  title={`Delete Selected ${label}?`}
  size="xs"
>
  <form class="flex flex-col gap-2">
    <h3>Warning! This cannot be undone. Selected {label} will be lost.</h3>
    <Hr />
    <span class="flex flex-row justify-between">
      <Button
        outline
        color="red"
        onclick={() => context.deleteSelected()}
      >
        Confirm
      </Button>
      <Button
        outline
        color="alternative"
        onclick={() => (context.deleteOpen = false)}
      >
        Cancel
      </Button>
    </span>
  </form>
</Modal>
