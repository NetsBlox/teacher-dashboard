<script lang="ts">
  import type { DashboardError } from '$lib/utils/errors';
  import type { User } from 'netsblox-cloud-client/src/types/User';
  import type { ResultAsync } from 'neverthrow';

  import { Card } from 'flowbite-svelte';
  import Loading from '../comp/misc/Loading.svelte';
  import EditButton from '$lib/comp/buttons/EditButton.svelte';
  import EditEmailModal from '$lib/comp/modals/EditEmail.svelte';
  import EditPasswordModal from '$lib/comp/modals/EditPassword.svelte';
  import { getUser } from '$lib/utils/api/users';

  type Props = { userAR: ResultAsync<User, DashboardError> };

  let { userAR = $bindable() }: Props = $props();

  const toggles = $state({ editEmail: false, editPass: false });
</script>

<aside class="flex-1/3">
  {#await userAR}
    <Loading />
  {:then userR}
    {#if userR.isErr()}
      <h1 class="text-white">Failed to load user details</h1>
    {:else}
      {@const user = userR.value}
      {@const refresh = () => (userAR = getUser(fetch, user.username))}
      <h2 class="py-[10px] text-2xl font-semibold text-gray-200">
        User: {user.username}
      </h2>
      <hr class="pb-4 text-gray-700" />
      <Card class="max-w-full px-4 text-gray-100">
        <dl class="grid grid-cols-[auto_1fr_auto] gap-4 py-4 text-lg">
          <dt class="self-end font-semibold">Email:</dt>
          <dd class="self-end">{user.email}</dd>
          <EditButton onclick={() => (toggles.editEmail = true)} />

          <hr class="col-span-3 text-gray-700" />

          <dt class="self-end font-semibold">Password:</dt>
          <dd class="self-end text-xl">{'\u2022'.repeat(8)}</dd>
          <EditButton onclick={() => (toggles.editPass = true)} />
        </dl>
      </Card>
      <EditEmailModal {user} bind:open={toggles.editEmail} {refresh} />
      <EditPasswordModal {user} bind:open={toggles.editPass} {refresh} />
    {/if}
  {/await}
</aside>
