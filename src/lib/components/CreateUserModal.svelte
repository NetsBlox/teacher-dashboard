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
  import type { NewUser } from 'netsblox-cloud-client/src/types/NewUser';
  import Dropzone from './Dropzone.svelte';
  import { QuestionCircleOutline } from 'flowbite-svelte-icons';
  import type {
    Batch,
    MemberTableContext,
  } from '$lib/contexts/MembersTableContext.svelte';
  import { getErrorContext } from '$lib/contexts/ErrorContext.svelte';
  import { DashboardError } from '$lib/utils/errors';

  type Props = {
    context: MemberTableContext;
    open: boolean;
  };

  let { context, open = $bindable() }: Props = $props();

  const user: NewUser = $state({ username: '', email: '', password: '' });
  const batch: Batch = $state({ prefix: '', email: '', amount: 2 });
  const toaster = getErrorContext();

  let file: File | undefined = $state();
  let dragging = $state(false);

  let tab = $state({ single: true, multi: false, csv: false });

  let log = $state({ open: false, href: '' });

  async function handleSubmit() {
    open = false;
    if (tab.single) {
      context.createUser(user);
    } else if (tab.multi) {
      if (isNaN(batch.amount)) {
        DashboardError.create('Amount must be a number.').toast(toaster);
      }
      const csv = await context.createUsers(batch);
      log.href = csv.uri;
      log.open = true;
    } else if (tab.csv && file) {
      await context.createUsersFromCSV(file);
    }
  }
</script>

<Modal
  bind:open
  ondragover={(_e) => (dragging = true)}
  ondragleave={(_e) => (dragging = false)}
  title="Create New User"
  size="xs"
  classDialog="inset-0"
>
  <form class="flex flex-col gap-2" ondragover={(_e) => (dragging = true)}>
    <Tabs>
      <TabItem
        bind:open={tab.single}
        title="Single"
        defaultClass="text-lg font-semibold"
        divClass="flex flex-col gap-2"
      >
        <Label>Username:</Label>
        <Input bind:value={user.username} />
        <Label>Email:</Label>
        <Input bind:value={user.email} />
        <Label>Password:</Label>
        <Input bind:value={user.password} />
      </TabItem>
      <TabItem
        bind:open={tab.multi}
        title="Multiple"
        defaultClass="text-lg font-semibold"
        divClass="flex flex-col gap-2"
      >
        <section class="flex flex-row items-center">
          <Label class="grow justify-self-end text-end text-lg font-semibold">
            Create
            <Input
              bind:value={batch.amount}
              maxlength={3}
              class="inline h-6 w-16"
              onkeypress={(e) => {
                if (isNaN(Number(e.key))) e.preventDefault();
              }}
            />
            Members
          </Label>
        </section>

        <Label>Prefix:</Label>
        <Input bind:value={batch.prefix} />

        <Label>Email:</Label>
        <Input bind:value={batch.email} />
      </TabItem>
      <TabItem
        bind:open={tab.csv}
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
<Modal bind:open={log.open} dismissable={false} title="Download Batch Data">
  <Button
    bind:href={log.href}
    onclick={() => (log.open = false)}
    download="passwords.csv"
  >
    Download Member Data
  </Button>
</Modal>
