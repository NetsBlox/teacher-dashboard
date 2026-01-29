<script lang="ts">
  import type { Assignment } from 'netsblox-cloud-client/src/types/Assignment';

  import { Modal, Hr, Label } from 'flowbite-svelte';

  import { Helper, Timepicker, Datepicker } from 'flowbite-svelte';
  import UpdateButton from '$lib/comp/buttons/UpdateButton.svelte';
  import { getErrorContext } from '$lib/contexts/ErrorContext.svelte';
  import { updateAssignment } from '$lib/utils/api/groups';
  import { ClockOutline } from 'flowbite-svelte-icons';
  import { createNetsbloxTime } from '$lib/utils/misc';

  type Props = { assignment: Assignment; refresh: () => void; open: boolean };

  let { assignment, refresh, open = $bindable() }: Props = $props();

  const data = $state({ date: new Date(), time: '' });
  let errors = $state({ name: '' });

  const toaster = getErrorContext();

  const handleSubmit = (_ev: Event) => {
    const dueDate = createNetsbloxTime(data.date, data.time);
    const { groupId, id } = assignment;
    updateAssignment(fetch, groupId, id, { name: assignment.name, dueDate })
      .orTee((err) => err.toast(toaster))
      .andTee(() => refresh())
      .andTee(() => void (open = false));
  };
</script>

<Modal bind:open title="Update Assignment Name" size="xs">
  <form class="flex flex-col gap-2" onsubmit={(event) => handleSubmit(event)}>
    <Label>Due Date:</Label>
    <Datepicker
      required={true}
      bind:value={data.date}
      inputClass="bg-gray-600!"
    />
    <Helper class="mb-2" color="red">
      <span class="font-medium">{errors.name}</span>
    </Helper>
    <Label>Due Time:</Label>
    <Timepicker required={true} bind:value={data.time} Icon={ClockOutline} />
    <Hr />
    <Helper class="mb-2" color="red">
      <span class="font-medium">{errors.name}</span>
    </Helper>
    <Hr />
    <span>
      <UpdateButton type="submit" />
    </span>
  </form>
</Modal>
