<script lang="ts">
  import type { DashboardError } from '$lib/utils/errors';
  import type { ResultAsync } from 'neverthrow';

  import { Card } from 'flowbite-svelte';
  import Loading from '../comp/misc/Loading.svelte';
  import EditButton from '$lib/comp/buttons/EditButton.svelte';
  import { getAssignment } from '$lib/utils/api/groups';
  import type { Assignment } from 'netsblox-cloud-client/src/types/Assignment';
  import { isNetsbloxTime } from '$lib/utils/guards';
  import EditAssignmentName from '../comp/modals/EditAssignmentName.svelte';
  import EditAssignmentDueDate from '../comp/modals/EditAssignmentDueDate.svelte';

  type Props = { assignmentAR: ResultAsync<Assignment, DashboardError> };

  let { assignmentAR = $bindable() }: Props = $props();

  const toggles = $state({ editName: false, editDueDate: false });
</script>

<aside class="flex-1/3">
  {#await assignmentAR}
    <Loading />
  {:then assignmentR}
    {#if assignmentR.isErr()}
      <h1 class="text-white">Failed to load group details</h1>
    {:else}
      {@const assignment = assignmentR.value}

      {#if isNetsbloxTime(assignment.dueDate)}
        {@const dueDate = new Date(assignment.dueDate.secs_since_epoch * 1000)}
        {@const refresh = () =>
          (assignmentAR = getAssignment(
            fetch,
            assignment.groupId,
            assignment.id,
          ))}
        <h2 class="py-[10px] text-2xl font-semibold text-gray-200">
          Assignment: {assignment.name}
        </h2>
        <hr class="pb-4 text-gray-700" />
        <Card class="max-w-full px-4 text-gray-100">
          <dl class="grid grid-cols-[auto_1fr_auto] gap-4 py-4 text-lg">
            <dt class="self-end font-semibold">Name:</dt>
            <dd class="self-end">{assignment.name}</dd>
            <EditButton onclick={() => (toggles.editName = true)} />

            <hr class="col-span-3 text-gray-700" />

            <dt class="self-end font-semibold">Due Date:</dt>
            <dd class="self-end">{dueDate.toLocaleString()}</dd>
            <EditButton onclick={() => (toggles.editDueDate = true)} />
          </dl>
        </Card>
        <EditAssignmentName {assignment} bind:open={toggles.editName} {refresh}/>
        <EditAssignmentDueDate {assignment} bind:open={toggles.editDueDate} {refresh}/>
      {/if}
    {/if}
  {/await}
</aside>
