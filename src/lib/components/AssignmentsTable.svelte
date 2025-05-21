
<script lang="ts">
  import { Table, TableSearch, Button } from 'flowbite-svelte';
  import TableHeaders from './TableHeaders.svelte';
  import TableEntries from './TableEntries.svelte';
  import { PlusOutline, TrashBinOutline } from 'flowbite-svelte-icons';
  import DeleteEntryModal from './DeleteEntryModal.svelte';
  import { AssignmentTableContext } from '$lib/contexts/AssignmentTableContext.svelte';
  import type { Assignment } from 'netsblox-cloud-client/src/types/Assignment';
  import CreateAssignmentModal from './CreateAssignmentModal.svelte';


  type Props = {
    groupId: string;
    assignments: Assignment[];
  };

  const { assignments, groupId }: Props = $props();
  const keys: (keyof Assignment)[] = ['name', 'originTime', 'dueDate'];
  const headers = ['name', 'origin time', 'due date', 'actions'];
  const context = new AssignmentTableContext(groupId, assignments, keys, 'name');
</script>

<span class="flex flex-row items-center justify-between">
  <TableSearch
    classInput="dark:focus:ring-orange-500 dark:focus:border-orange-500"
    placeholder="search by username"
    hoverable={true}
    bind:inputValue={context.search}
  />
  <section>
    <Button outline on:click={() => (context.createOpen = true)}>
      <PlusOutline /> Create Assignment
    </Button>
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
  <TableHeaders {headers} {context} />
  <TableEntries {context} />
</Table>
<CreateAssignmentModal {context} />
<DeleteEntryModal {context} label="Assignments"/>
