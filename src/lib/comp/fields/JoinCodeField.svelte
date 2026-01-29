<script lang="ts">
  import type { DashboardError } from '$lib/utils/errors';
  import type { ResultAsync } from 'neverthrow';
  import type { GroupJoinCode } from 'netsblox-cloud-client/src/types/GroupJoinCode';
  import type { GroupId } from 'netsblox-cloud-client/src/types/GroupId';

  import { createJoinCode, deleteJoinCode } from '$lib/utils/api/groups';

  import { getJoinCode } from '$lib/utils/api/groups';
  import { ok, err } from 'neverthrow';
  import DeleteButton from '../buttons/DeleteButton.svelte';
  import CreateButton from '../buttons/CreateButton.svelte';
  import { Spinner } from 'flowbite-svelte';
  import { isNetsbloxTime } from '$lib/utils/guards';

  type Props = {
    groupId: GroupId;
    joinCodeAR: ResultAsync<GroupJoinCode, DashboardError>;
  };

  let { groupId: groupId, joinCodeAR = $bindable() }: Props = $props();

  let codeOrNullAR = $derived(
    joinCodeAR.orElse((error) => {
      if (error.inner instanceof Response && error.inner.status === 404) {
        return ok(null);
      } else {
        return err(error);
      }
    }),
  );
</script>

<dt class="self-end font-semibold">Join Code:</dt>
{#await codeOrNullAR}
  <Spinner type="dots" size="8" />
{:then codeOrNullR}
  {#if codeOrNullR.isErr()}
    <h1 class="text-white">Failed to load group join code</h1>
  {:else}
    {@const codeOrNull = codeOrNullR.value}
    {@const refresh = () => (joinCodeAR = getJoinCode(fetch, groupId))}
    <dd class="self-end">{codeOrNull?.code}</dd>
    {#if codeOrNull}
      <DeleteButton
        onclick={() => deleteJoinCode(fetch, groupId).andTee(() => refresh())}
      />
      {#if isNetsbloxTime(codeOrNull.createdAt)}
        <span class="col-span-3 -mt-4 ml-2 text-sm text-gray-400">
          expires on {new Date(
            codeOrNull.createdAt.secs_since_epoch * 1000 +
              1000 * 60 * 60 * 24 * 3,
          ).toDateString()}
        </span>
      {/if}
    {:else}
      <CreateButton
        onclick={() => createJoinCode(fetch, groupId).andTee(() => refresh())}
      />
    {/if}
  {/if}
{/await}
