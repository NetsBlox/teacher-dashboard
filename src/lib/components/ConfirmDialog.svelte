<script lang="ts" module>
  export interface promptData {
    title: string;
    message: string;
    open: boolean;
    action: (e: MouseEvent) => void;
  }
</script>

<script lang="ts">
  import { Button, Modal, Label, Input, Checkbox } from "flowbite-svelte";

  interface Props {
    title?: string;
    message?: string;
    action?: (e: MouseEvent) => void;
    open?: boolean;
  }

  let {
    title = $bindable("Default Title"),
    message = "Default message",
    action = () => {console.log("Default Action")},
    open = $bindable(false)
  }: Props = $props();
</script>

"

<Modal bind:open bind:title size="xs" autoclose class="w-full">
  <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
    {message}
  </p>
  {#snippet footer()}
  
      <Button on:click={action}>Yes</Button>
      <Button color="alternative">No</Button>
    
  {/snippet}
</Modal>
