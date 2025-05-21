<!-- TODO: Once services are seperated --->
<!-- add option to select which services the group has access to -->
<script lang="ts">
  import {
    Button,
    Modal,
    Hr,
    Label,
    Input,
    TabItem,
    Tabs,
    Popover,
  } from 'flowbite-svelte';
  import type {
    BatchData,
    GroupUserTableContext,
  } from '$lib/contexts/GroupUserTableContext.svelte';
  import type { NewUser } from 'netsblox-cloud-client/src/types/NewUser';
  import Dropzone from './Dropzone.svelte';
  import {
    QuestionCircleOutline,
    QuestionCircleSolid,
  } from 'flowbite-svelte-icons';

  type Props = {
    context: GroupUserTableContext;
  };

  const { context }: Props = $props();

  const singleState: NewUser = $state({
    username: '',
    email: '',
    password: '',
  });
  const multiState = $state({ prefix: '', email: '', batchNumber: '2' });
  const logState = $state({ open: false, href: '' });
  let file: File | undefined = $state();

  let dragging = $state(false);
  let singleTab = $state(true);
  let multiTab = $state(false);
  let fileTab = $state(false);

  async function handleSubmit() {
    if (singleTab) {
      context.createEntry(singleState);
    } else if (multiTab) {
      const number = Number(multiState.batchNumber);
      if (isNaN(number)) throw TypeError('batchNumber must be a number');
      const batchData: BatchData = { ...multiState, batchNumber: number };

      const { exportData } = await context.batchCreateEntry(batchData);

      logState.href = encodeURI(exportData);
      logState.open = true;
    } else if (fileTab && file) {
      await context.createFromCSV(file);
    }
  }
</script>

<Modal
  bind:open={context.createOpen}
  ondragover={(_e) => (dragging = true)}
  ondragleave={(_e) => (dragging = false)}
  title="Create New User"
  size="xs"
  classDialog="inset-0"
>
  <form class="flex flex-col gap-2" ondragover={(_e) => (dragging = true)}>
    <Tabs>
      <TabItem
        bind:open={singleTab}
        title="Single"
        defaultClass="text-lg font-semibold"
        divClass="flex flex-col gap-2"
      >
        <Label>Username:</Label>
        <Input bind:value={singleState.username} />
        <Label>Email:</Label>
        <Input bind:value={singleState.email} />
        <Label>Password:</Label>
        <Input bind:value={singleState.password} />
      </TabItem>
      <TabItem
        bind:open={multiTab}
        title="Multiple"
        defaultClass="text-lg font-semibold"
        divClass="flex flex-col gap-2"
      >
        <section class="flex flex-row items-center">
          <Label class="grow justify-self-end text-end text-lg font-semibold">
            Create
            <Input
              bind:value={multiState.batchNumber}
              maxlength={3}
              class="inline h-6 w-16"
              onkeypress={(e) =>
                isNaN(Number(e.key)) ? e.preventDefault() : null}
            /> Members
          </Label>
        </section>

        <Label>Prefix:</Label>
        <Input bind:value={multiState.prefix} />

        <Label>Email:</Label>
        <Input bind:value={multiState.email} />
      </TabItem>
      <TabItem
        bind:open={fileTab}
        title="File"
        defaultClass="text-lg font-semibold"
        divClass="flex flex-col "
      >
        <Label class="flex flex-row gap-1 pb-2"
          >File:
          <QuestionCircleOutline />
          <Popover title="Hint"
            ><p>
              Ensure that the file has three columns in the following order:
            </p>
            <p>username, email, password</p>
          </Popover>
        </Label>
        <Dropzone bind:file {dragging} acceptType=".csv" />
      </TabItem>
    </Tabs>
    <Hr />
    <span>
      <Button outline onclick={() => handleSubmit()} class="self-start">
        Create
      </Button>
    </span>
  </form>
</Modal>
<Modal
  bind:open={logState.open}
  dismissable={false}
  title="Download Batch Data"
>
  <Button
    bind:href={logState.href}
    onclick={() => (logState.open = false)}
    download="passwords.csv">Download Member Data</Button
  >
</Modal>
