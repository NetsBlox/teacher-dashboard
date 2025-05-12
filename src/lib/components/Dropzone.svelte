<script lang="ts">
  import { UploadOutline } from 'flowbite-svelte-icons';
  import type { ChangeEventHandler } from 'svelte/elements';

  type Props = {
    file: File | undefined;
    dragging: boolean;
    acceptType: string;
  };

  let { file = $bindable(), dragging, acceptType }: Props = $props();

  let hover = $state(false);
  let input: HTMLInputElement | undefined = $state();

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    dragging = false;
    if (!e.dataTransfer) return;
    if (e.dataTransfer.files.length !== 1) return; // TODO: add toast warning
    file = e.dataTransfer.files[0];
  }

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.currentTarget.files;
    if (!files || files.length !== 1) return;
    file = files[0];
  };
</script>

<button
  class={`flex flex-row items-center justify-center
         transition-all dark:rounded-lg
         dark:border-2 dark:border-dashed
         dark:border-gray-600 dark:bg-gray-700 
         dark:hover:border-gray-700 dark:hover:bg-gray-600
         ${dragging ? 'h-20' : 'h-11'}`}
  ondragover={(e) => e.preventDefault()}
  ondrop={handleDrop}
  onclick={(_e) => (file ? (file = undefined) : input?.click())}
  onmouseenter={(_e) => (hover = true)}
  onmouseleave={(_e) => (hover = false)}
>
  {#if dragging}
    <UploadOutline size="lg" />
    <p class="hidden px-1 sm:block">Drop Here</p>
  {:else if file && hover}
    <p class="font-semibold">Discard?</p>
  {:else if file}
    <p class="">{file.name} Added</p>
  {:else}
    <UploadOutline />
    <p class="hidden px-1 sm:block">Drop Items Here or</p>
    <p class="hidden font-semibold sm:block">Browse Files</p>
  {/if}
</button>
<input
  bind:this={input}
  onchange={handleChange}
  class="invisible h-0 w-0"
  type="file"
  accept={acceptType}
/>
