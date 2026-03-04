<script lang="ts">
  import { Button } from 'flowbite-svelte';
  import { EditOutline } from 'flowbite-svelte-icons';

  type Props = { onclick?: () => void };
  const { onclick }: Props = $props();
</script>

<Button size="xs" outline {onclick}>
  <EditOutline size="sm" />
</Button>
