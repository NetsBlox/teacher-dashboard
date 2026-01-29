<script lang="ts">
  import type { ButtonProps } from 'flowbite-svelte';

  import { Button } from 'flowbite-svelte';
  import { PlusOutline } from 'flowbite-svelte-icons';

  type Props = { title?: string };
  const { title = '', ...rest }: Props & ButtonProps = $props();
</script>

<Button outline {...rest} size="xs">
  <PlusOutline size="sm" />
</Button>
