<script lang="ts">
  import type { User } from 'netsblox-cloud-client/src/types/User';

  import { Modal, Hr, Label, Input, Helper } from 'flowbite-svelte';
  import UpdateButton from '../buttons/UpdateButton.svelte';
  import { validatePasswordFields } from '$lib/utils/validators';
  import { changePassword } from '$lib/utils/api/users';
  import { getErrorContext } from '$lib/contexts/ErrorContext.svelte';

  type Props = { user: User; refresh: () => void; open: boolean };

  let { user, refresh, open = $bindable() }: Props = $props();
  const data = $state({ password: '', repeat: '' });
  let errors = $state({ password: '', repeat: '' });
  const toaster = getErrorContext();

  const resetErrors = () => (errors = { password: '', repeat: '' });

  const handleSubmit = (_ev: Event) => {
    const res = validatePasswordFields(data).orTee(
      (err) => (errors[err.field] = err.msg),
    );

    if (res.isErr()) return;

    changePassword(fetch, user.username, res.value.password)
      .orTee((err) => err.toast(toaster))
      .andTee(() => refresh())
      .andTee(() => void (open = false));
  };
</script>

<Modal
  bind:open
  title={`Update ${user.username}'s Password`}
  onsubmit={handleSubmit}
  size="xs"
>
  <form class="flex flex-col gap-2">
    <Label>New Password:</Label>
    <Input
      bind:value={data.password}
      required
      type="password"
      autocomplete="new-password"
      onInput={resetErrors}
    />
    <Helper class="mb-2" color="red">
      <span class="font-medium">{errors.password}</span>
    </Helper>

    <Label>Confirm Password:</Label>
    <Input
      bind:value={data.repeat}
      required
      type="password"
      onInput={resetErrors}
    />
    <Helper class="mb-2" color="red">
      <span class="font-medium">{errors.repeat}</span>
    </Helper>
    <Hr />
    <span>
      <UpdateButton type="submit" />
    </span>
  </form>
</Modal>
