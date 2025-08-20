<!-- TODO: Once services are seperated --->
<!-- add option to select which services the group has access to -->
<script lang="ts">
  import type { AssignmentTableContext } from '$lib/contexts/AssignmentTableContext.svelte';
  import {
    Button,
    Modal,
    Hr,
    Label,
    Input,
    Datepicker,
    Timepicker,
  } from 'flowbite-svelte';
  import type { CreateAssignmentData } from 'netsblox-cloud-client/src/types/CreateAssignmentData';
  import { ClockOutline } from 'flowbite-svelte-icons';
  import type { ComponentType } from 'svelte';
  import { createNetsbloxTime } from '$lib/utils/utils';
  // FIXME: when flowbite-svelte and flowbite-svelte-icons catches up with svelte
  const RectifiedClockOutline = ClockOutline as unknown as ComponentType;

  type Props = {
    context: AssignmentTableContext;
    open: boolean;
  };

  let { context, open = $bindable() }: Props = $props();

  let dragging = $state(false);
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
    context.createAssignment(data);
  };
</script>

<Modal
  bind:open
  ondragover={(_e) => (dragging = true)}
  ondragleave={(_e) => (dragging = false)}
  title="Create New Assignment"
  size="xs"
>
  <form class="flex flex-col gap-2" ondragover={(_e) => (dragging = true)}>
    <Label>Name:</Label>
    <Input bind:value={rawData.name} />
    <Label>Due Date:</Label>
    <Datepicker
      required={true}
      bind:value={rawData.date}
      inputClass="!bg-gray-600"
    />
    <Label>Due Time:</Label>
    <Timepicker
      required={true}
      bind:value={rawData.time}
      icon={RectifiedClockOutline}
    />
    <Hr />
    <span>
      <Button outline onclick={() => handleClick()} class="self-start">
        Create
      </Button>
    </span>
  </form>
</Modal>
