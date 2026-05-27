<script lang="ts">
  import type { GroupSettingsTable } from '$lib/data/tables/group_settings.svelte';
  import type { SettingsTable } from '$lib/data/tables/settings.svelte';
  import type { FlatServiceSetting } from '$lib/utils/types';

  import { Button, Modal, Hr, Label, Input, Toggle } from 'flowbite-svelte';

  type Props = {
    table: SettingsTable | GroupSettingsTable;
    open: boolean;
  };

  let { table, open = $bindable() }: Props = $props();
  let visibilityToggle = $state(true);
  const visibility = $derived(visibilityToggle ? 'Restricted' : 'Public');
  const data: FlatServiceSetting = $state({
    host: '',
    service: '',
    name: '',
    value: '',
    visibility: 'Restricted',
  });
</script>

<Modal bind:open title="Create New Setting" size="xs">
  <form class="flex flex-col gap-2">
    <Label>Host:</Label>
    <Input bind:value={data.host} />
    <Label>service:</Label>
    <Input bind:value={data.service} />
    <Label>setting:</Label>
    <Input bind:value={data.name} />
    <Label>value:</Label>
    <Input bind:value={data.value} />
    <Toggle bind:checked={visibilityToggle}>Restrict Viewing Access</Toggle>
    <Hr />
    <Button
      outline
      onclick={() => {
        table.createSetting({...data, visibility});
        open = false;
      }}
      class="self-start"
    >
      Create
    </Button>
  </form>
</Modal>
