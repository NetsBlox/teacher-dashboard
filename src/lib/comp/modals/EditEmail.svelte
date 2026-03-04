<script lang="ts">
  import type { User } from 'netsblox-cloud-client/src/types/User';

  import { Modal, Hr, Label, Input, Helper } from 'flowbite-svelte';
  import UpdateButton from '../buttons/UpdateButton.svelte';
  import { updateUser } from '$lib/utils/api/users';
  import { getErrorContext } from '$lib/contexts/ErrorContext.svelte';
  import { validateEmailField } from '$lib/utils/validators';

  type Props = { user: User; refresh: () => void; open: boolean };

  let { user, refresh, open = $bindable() }: Props = $props();

  const data = $state({ email: '' });
  let errors = $state({ email: '' });

  const toaster = getErrorContext();

  const resetErrors = () => (errors = { email: '' });

  const handleSubmit = (_ev: Event) => {
    const res = validateEmailField(data).orTee(
      (err) => (errors[err.field] = err.msg),
    );

    if (res.isErr()) return;

    updateUser(fetch, user.username, { ...res.value })
      .orTee((err) => err.toast(toaster))
      .andTee(() => refresh())
      .andTee(() => void (open = false));
  };
</script>

<Modal bind:open title={`Update ${user.username}'s Email`} size="xs">
  <form class="flex flex-col gap-2" onsubmit={(event) => handleSubmit(event)}>
    <Label>New Email:</Label>
    <Input
      bind:value={data.email}
      type="email"
      autocomplete="email"
      oninput={resetErrors}
      required
    />
    <Helper class="mb-2" color="red">
      <span class="font-medium">{errors.email}</span>
    </Helper>
    <Hr />
    <span>
      <UpdateButton type="submit" />
    </span>
  </form>
</Modal>
