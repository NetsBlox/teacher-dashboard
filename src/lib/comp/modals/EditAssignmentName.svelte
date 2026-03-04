<script lang="ts">
  import type { Group } from 'netsblox-cloud-client/src/types/Group';
  import type { Assignment } from 'netsblox-cloud-client/src/types/Assignment';

  import { Modal, Hr, Label, Input, Helper } from 'flowbite-svelte';
  import UpdateButton from '$lib/comp/buttons/UpdateButton.svelte';
  import { getErrorContext } from '$lib/contexts/ErrorContext.svelte';
  import { validateAssignmentNameField, validateGroupNameField } from '$lib/utils/validators';
  import { updateAssignment, updateGroup } from '$lib/utils/api/groups';

  type Props = { assignment: Assignment; refresh: () => void; open: boolean };

  let { assignment, refresh, open = $bindable() }: Props = $props();

  const data = $state({ name: '' });
  let errors = $state({ name: '' });

  const toaster = getErrorContext();

  const resetErrors = () => (errors = { name: '' });

  const handleSubmit = (_ev: Event) => {
    const res = validateAssignmentNameField(data)
      .orTee((err) => (errors[err.field] = err.msg));

    if (res.isErr()) return;

    updateAssignment(fetch, assignment.groupId, assignment.id, res.value)
      .orTee((err) => err.toast(toaster))
      .andTee(() => refresh())
      .andTee(() => void (open = false));
  };
</script>

<Modal bind:open title="Update Assignment Name" size="xs">
  <form class="flex flex-col gap-2" onsubmit={(event) => handleSubmit(event)}>
    <Label>New Name:</Label>
    <Input bind:value={data.name} type="text" required oninput={resetErrors} placeholder={assignment.name}/>
    <Helper class="mb-2" color="red">
      <span class="font-medium">{errors.name}</span>
    </Helper>
    <Hr />
    <span>
      <UpdateButton type="submit" />
    </span>
  </form>
</Modal>
