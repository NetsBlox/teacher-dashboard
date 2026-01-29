
<script lang="ts">
  import type { Group } from 'netsblox-cloud-client/src/types/Group';

  import { Modal, Hr, Label, Input, Helper } from 'flowbite-svelte';
  import UpdateButton from "$lib/comp/buttons/UpdateButton.svelte";
  import { getErrorContext } from '$lib/contexts/ErrorContext.svelte';
  import { validateGroupNameField } from '$lib/utils/validators';
  import { updateGroup } from '$lib/utils/api/groups';

  type Props = { group: Group; refresh: () => void; open: boolean };

  let { group, refresh, open = $bindable() }: Props = $props();

  const data = $state({ name: '' });
  let errors = $state({ name: '' });

  const toaster = getErrorContext();

  const resetErrors = () => (errors = { name: '' });

  const handleSubmit = (_ev: Event) => {
    const res = validateGroupNameField(data)
      .orTee((err) => (errors[err.field] = err.msg));

    if (res.isErr()) return;

    updateGroup(fetch, group.id, res.value)
      .orTee((err) => err.toast(toaster))
      .andTee(() => refresh())
      .andTee(() => void (open = false));
  };
</script>

<Modal bind:open title="Update Group Name" size="xs">
  <form class="flex flex-col gap-2" onsubmit={(event) => handleSubmit(event)}>
    <Label>New Name:</Label>
    <Input bind:value={data.name} type="text" required oninput={resetErrors} />
    <Helper class="mb-2" color="red">
      <span class="font-medium">{errors.name}</span>
    </Helper>
    <Hr />
    <span>
      <UpdateButton type="submit" />
    </span>
  </form>
</Modal>
