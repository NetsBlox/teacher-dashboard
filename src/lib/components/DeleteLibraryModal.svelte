<script lang="ts">
  import { Button, Modal, Hr } from 'flowbite-svelte';
  import { invalidate } from '$app/navigation';
  import api from '$lib/utils/api';
  import { CLOUD_URL } from '$lib/utils/routes';
  import type { LibraryTableContext } from '$lib/contexts/libraryEntries.svelte';

  type Props = {
    context: LibraryTableContext
  }

  let { context } = $props()


</script>

<Modal bind:open title="Delete Selected Groups?" size="xs">
  <form class="flex flex-col gap-2">
    <h3>Warning! This cannot be undone. All group data will be lost.</h3>
    <Hr />
    <span class="flex flex-row justify-between">
      <Button
        outline
        color="red"
        onclick={() => deleteGroups()}
      >
        Confirm
      </Button>
      <Button
        outline
        color="alternative"
        onclick={() => (open = false)}
      >
        Cancel
      </Button>
    </span>
  </form>
</Modal>
