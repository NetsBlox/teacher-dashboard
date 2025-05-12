
<script lang="ts">
  import { Table, TableSearch, Button } from 'flowbite-svelte';
  import TableHeaders from './TableHeaders.svelte';
  import TableEntries from './TableEntries.svelte';
  import { PlusOutline, TrashBinOutline } from 'flowbite-svelte-icons';
  import DeleteEntryModal from './DeleteEntryModal.svelte';
  import { SubmissionTableContext, type SubmissionOwner } from '$lib/contexts/SubmissionTableContext.svelte';
  import type { Submission } from 'netsblox-cloud-client/src/types/Submission';
  import CreateAssignmentModal from './CreateAssignmentModal.svelte';
  import type { GroupId } from 'netsblox-cloud-client/src/types/GroupId';
  import type { AssignmentId } from 'netsblox-cloud-client/src/types/AssignmentId';


  type Props = {
    groupId: GroupId;
    assignmentId: AssignmentId;
    submissions: Submission[];
  };

  let { submissions, assignmentId, groupId }: Props = $props();
  const keys: (keyof Submission)[] = ['owner', 'originTime'];
  const headers = ['name', 'origin time', 'actions'];
  const owner: SubmissionOwner = {groupId, assignmentId}
  let context = $state(new SubmissionTableContext(owner, submissions, keys, 'owner'));
</script>

<span class="flex flex-row items-center justify-between">
  <TableSearch
    classInput="dark:focus:ring-orange-500 dark:focus:border-orange-500"
    placeholder="search by username"
    hoverable={true}
    bind:inputValue={context.search}
  />
  <section>
    <Button
      on:click={() => (context.deleteOpen = true)}
      disabled={!context.entries.some((x) => x.selected)}
      outline
      color="red"
    >
      <TrashBinOutline />Delete
    </Button>
  </section>
</span>
<Table shadow hoverable={true}>
  <TableHeaders {headers} bind:context />
  <TableEntries bind:context />
</Table>
<DeleteEntryModal bind:context />
