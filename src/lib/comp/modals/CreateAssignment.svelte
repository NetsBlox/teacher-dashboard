<script lang="ts">
  import type { AssignmentTable } from '$lib/data/tables/assignments.svelte';
  import type { CreateAssignmentData } from 'netsblox-cloud-client/src/types/CreateAssignmentData';

  import { Button, Modal, Hr, Label } from 'flowbite-svelte';
  import { Input, Datepicker, Timepicker } from 'flowbite-svelte';
  import { ClockOutline } from 'flowbite-svelte-icons';
  import { createNetsbloxTime } from '$lib/utils/misc';

  type Props = {
    table: AssignmentTable;
    open: boolean;
  };

  let { table, open = $bindable() }: Props = $props();

  const rawData = $state({ name: '', date: new Date(), time: '23:59' });

  const handleClick = () => {
    open = false;
    if (!RegExp(/\d{2}:\d{2}/).test(rawData.time)) {
      return;
    }
    const data: CreateAssignmentData = {
      name: rawData.name,
      dueDate: createNetsbloxTime(rawData.date, rawData.time),
    };
    table.createAssignment(data);
  };
</script>

<Modal bind:open title="Create New Assignment" size="xs">
  <form class="flex flex-col gap-2">
    <Label>Name:</Label>
    <Input bind:value={rawData.name} />
    <Label>Due Date:</Label>
    <Datepicker
      required={true}
      bind:value={rawData.date}
      inputClass="bg-gray-600!"
    />
    <Label>Due Time:</Label>
    <Timepicker required={true} bind:value={rawData.time} Icon={ClockOutline} />
    <Hr />
    <span>
      <Button outline onclick={() => handleClick()} class="self-start">
        Create
      </Button>
    </span>
  </form>
</Modal>
