<script lang="ts">
  import type { MemberTable, Batch } from '$lib/data/tables/members.svelte';
  import type { NewUser } from 'netsblox-cloud-client/src/types/NewUser';

  import { Button, Modal, Hr, Popover } from 'flowbite-svelte';
  import { Label, Input, TabItem, Tabs } from 'flowbite-svelte';
  import Dropzone from './Dropzone.svelte';
  import { QuestionCircleOutline } from 'flowbite-svelte-icons';
  import { getErrorContext } from '$lib/contexts/ErrorContext.svelte';
  import { DashboardError } from '$lib/utils/errors';
  import { CSV } from '$lib/utils/tables';

  type Props = {
    table: MemberTable;
    open: boolean;
  };

  let { table, open = $bindable() }: Props = $props();

  const user: NewUser = $state({ username: '', email: '', password: '' });
  const batch: Batch = $state({ prefix: '', email: '', amount: 2 });
  const toaster = getErrorContext();

  let file: File | undefined = $state();
  let dragging = $state(false);

  let tab = $state({ single: true, multi: false, csv: false });

  function handleSubmit() {
    open = false;
    if (tab.single) {
      table.createUser(user);
    } else if (tab.multi) {
      handleMulti();
    } else if (tab.csv && file) {
      handleFile(file);
    }
  }

  function handleMulti() {
    if (isNaN(batch.amount)) {
      return DashboardError.create('Amount must be a number.').toast(toaster);
    }
    const result = table.createUsers(batch);
    result
      .andTee((csv) => csv.download('passwords.csv'))
      .andTee(() => table.refresh())
      .orTee((err) => {
        if (err instanceof CSV) {
          err.download('errors.csv');
        } else {
          err.toast(toaster);
        }
      });
  }

  function handleFile(uploadedFile: File) {
    table.createUsersFromCSV(uploadedFile).orTee((err) => {
      if (err instanceof CSV) {
        err.download('errors.csv');
      }
    });
  }
</script>

<Modal
  bind:open
  ondragover={(_e) => (dragging = true)}
  ondragleave={(_e) => (dragging = false)}
  title="Create New User"
  size="xs"
>
  <form class="flex flex-col gap-2" ondragover={(_e) => (dragging = true)}>
    <Tabs classes={{ content: 'flex flex-col gap-2' }}>
      <TabItem bind:open={tab.single} title="Single">
        <Label>Username:</Label>
        <Input bind:value={user.username} />
        <Label>Email:</Label>
        <Input bind:value={user.email} />
        <Label>Password:</Label>
        <Input bind:value={user.password} />
      </TabItem>
      <TabItem bind:open={tab.multi} title="Multiple">
        <Label class="flex flex-row justify-end gap-2 text-lg font-semibold">
          Create
          <Input
            bind:value={batch.amount}
            maxlength={3}
            class="h-6 max-w-16"
            onkeypress={(e) => {
              if (isNaN(Number(e.key))) e.preventDefault();
            }}
          />
          Members
        </Label>

        <Label>Prefix:</Label>
        <Input bind:value={batch.prefix} />

        <Label>Email:</Label>
        <Input bind:value={batch.email} />
      </TabItem>
      <TabItem bind:open={tab.csv} title="File">
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
