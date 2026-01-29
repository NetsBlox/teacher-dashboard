<script lang="ts">
  import type { DashboardError } from '$lib/utils/errors';
  import type { ResultAsync } from 'neverthrow';
  import type { Group } from 'netsblox-cloud-client/src/types/Group';
  import type { GroupJoinCode } from 'netsblox-cloud-client/src/types/GroupJoinCode';

  import { Card } from 'flowbite-svelte';
  import Loading from '../comp/misc/Loading.svelte';
  import EditButton from '$lib/comp/buttons/EditButton.svelte';
  import EditGroupNameModal from '$lib/comp/modals/EditGroupName.svelte';
  import { getGroup } from '$lib/utils/api/groups';
  import JoinCodeField from '../comp/fields/JoinCodeField.svelte';

  type Props = {
    groupAR: ResultAsync<Group, DashboardError>;
    joinCodeAR: ResultAsync<GroupJoinCode, DashboardError>;
  };

  let { groupAR = $bindable(), joinCodeAR = $bindable() }: Props = $props();

  const toggles = $state({ editName: false });
</script>

<aside class="flex-1/3">
  {#await groupAR}
    <Loading />
  {:then groupR}
    {#if groupR.isErr()}
      <h1 class="text-white">Failed to load group details</h1>
    {:else}
      {@const group = groupR.value}
      {@const refresh = () => (groupAR = getGroup(fetch, group.id))}
      <h2 class="py-[10px] text-2xl font-semibold text-gray-200">
        Group: {group.name}
      </h2>
      <hr class="pb-4 text-gray-700" />
      <Card class="max-w-full px-4 text-gray-100">
        <dl class="grid grid-cols-[auto_1fr_auto] gap-4 py-4 text-lg">
          <dt class="self-end font-semibold">Name:</dt>
          <dd class="self-end">{group.name}</dd>
          <EditButton onclick={() => (toggles.editName = true)} />
          <hr class="col-span-3 text-gray-700" />
          <JoinCodeField groupId={group.id} bind:joinCodeAR />
        </dl>
      </Card>
      <EditGroupNameModal {group} bind:open={toggles.editName} {refresh} />
    {/if}
  {/await}
</aside>
