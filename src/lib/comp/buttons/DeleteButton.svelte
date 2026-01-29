<script lang="ts">
  import type { ButtonProps } from 'flowbite-svelte';

  import { Button } from 'flowbite-svelte';
  import { TrashBinOutline } from 'flowbite-svelte-icons';

  type Props = { title?: string };
  const { title = '', ...rest }: Props & ButtonProps = $props();
</script>

<Button outline {...rest} color="red" size="xs">
  <TrashBinOutline size="sm"/>
  <span class="hidden md:inline"> {title}</span>
</Button>
