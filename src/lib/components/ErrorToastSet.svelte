<script lang="ts">
  import { setErrorsContext } from '$lib/contexts/ErrorDialogContext.svelte';
  import { Toast } from 'flowbite-svelte';

  const errors: Error[] = $state([]);
  errors.push(new Error('init'));
</script>

{#each errors as error, i}
  {@debug i}
  <Toast class={`border border-zinc-900 rounded-lg transform -translate-y-[${i}rem] `} position="bottom-right">
    {error}
    <button onclick={() => errors.push(Error('message'))}> test </button>
  </Toast>
{/each}
