<script lang="ts" generics="T, CreateT">
  import { Button, Modal, Hr } from 'flowbite-svelte';
  import type { TableContext } from '$lib/utils/types';
  import type { User } from 'netsblox-cloud-client/src/types/User';

  type Props = {
    context: TableContext<T, CreateT>;
  };

  let { context = $bindable()}: Props = $props();
</script>

<Modal
  bind:open={context.deleteOpen}
  title="Delete Selected Libraries?"
  size="xs"
>
  <form class="flex flex-col gap-2">
    <h3>Warning! This cannot be undone. All libraries will be lost.</h3>
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
