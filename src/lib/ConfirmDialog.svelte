<Modal bind:open={open} bind:title={title} size="xs" autoclose class="w-full">
  <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">{message}</p>
  <svelte:fragment slot="footer">
    <Button on:click={action}>Yes</Button>
    <Button color="alternative">No</Button>
  </svelte:fragment>
</Modal>

<script lang="ts">
  import { Button, Modal, Label, Input, Checkbox } from 'flowbite-svelte';

  export let title;
  export let message;
  export let action;
  export let open;
</script>
