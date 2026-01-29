<script lang="ts">
  import type { ButtonProps } from 'flowbite-svelte';

  import { Button } from 'flowbite-svelte';
  import { EditOutline } from 'flowbite-svelte-icons';

  type Props = { title?: string };
  const { title = 'update', ...rest }: Props & ButtonProps = $props();
</script>

<Button outline {...rest}>
  <EditOutline />
  <span class="hidden md:inline"> {title}</span>
</Button>
