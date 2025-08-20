<script lang="ts">
  import { CloseCircleOutline } from 'flowbite-svelte-icons';
  import { Toast } from 'flowbite-svelte';
  import type { ErrorContext } from '$lib/contexts/ErrorContext.svelte';

  type Props = {
    context: ErrorContext;
  }

  const { context }: Props = $props();
  const errors = $derived(context.errors)
</script>

<div class="bg-green-500 fixed right-0 bottom-0 w-full z-50">
{#if errors.length !== 0}
  {#each errors as error, i}
    {@const dx = i * 3}
    {@const dy = -i * 3}
    {@const z = 100 - i}
    <Toast
      style={`translate: ${dx}px ${dy}px; z-index: ${z}`}
      class={`rounded-lg border-2 border-red-700 `}
      contentClass="w-full text-sm font-semibold flex items-center justify-between m-1.5"
      position="bottom-right"
      dismissable={false}
    >
      {error}
      <button
        class="rounded font-medium text-orange-500 hover:text-orange-400 active:text-orange-500"
        onclick={() => errors.shift()}
        ><CloseCircleOutline />
      </button>
    </Toast>
  {/each}
{/if}
</div>
