<script lang="ts">
  import { Button, Modal } from "flowbite-svelte";

  interface Props {
    title?: string;
    message?: string;
    open?: boolean;
    err?: string;
  }

  let {
    title = $bindable("Default Error Title"),
    message = "Default Error Message",
    open = $bindable(false),
    err = "Default Error"
  }: Props = $props();

  const close = () => {
    open = !open;
  };
</script>

<Modal bind:open bind:title size="xs" autoclose class="w-full">
  <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
    {message}
  </p>
  <p class="text-base leading-relaxed text-red-500 dark:text-red-400">
    {err}
  </p>
  {#snippet footer()}
  
      <Button on:click={close}>Close</Button>
    
  {/snippet}
</Modal>
