<script lang="ts">
  import { ErrorSetContext as errors } from '$lib/contexts/Contexts.svelte';
  import { CloseCircleOutline } from 'flowbite-svelte-icons';
  import { Toast } from 'flowbite-svelte';

</script>
{#if (errors.length !== 0)}
{#each errors as error, i}
  {@const dx = i * 3}
  {@const dy = -i * 3}
  {@const z = -i}
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
          onclick={() => errors.shift()}><CloseCircleOutline /></button
        >
      </Toast>
{/each}
{/if}
