<script lang="ts">
  import { Spinner } from 'flowbite-svelte';

  type Props = { classes?: { outer?: string; spinner?: string } };
  let { classes }: Props = $props();
</script>

<article class={'flex h-96 items-center justify-center' + ' ' + (classes?.outer || "") }>
  <Spinner class={(classes?.spinner || "")} size="16" />
</article>
