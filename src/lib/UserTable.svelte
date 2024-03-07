<TableSearch placeholder="Search" hoverable={true} bind:inputValue={searchTerm}>
  <TableHead>
    <TableHeadCell class="!p-4">
      <Checkbox />
    </TableHeadCell>
    <TableHeadCell>username</TableHeadCell>
    <TableHeadCell>email</TableHeadCell>
    <TableHeadCell>actions</TableHeadCell>
  </TableHead>
  <TableBody>
  {#await usersP}
    <TableBodyRow>
      <TableBodyCell class="!p-4">
      </TableBodyCell>
      <TableBodyCell></TableBodyCell>
      <TableBodyCell><Spinner/></TableBodyCell>
    </TableBodyRow>
  {:then _usersReady}  
    {#each shownStudents as student}
      <TableBodyRow>
        <TableBodyCell class="!p-4">
          <Checkbox />
        </TableBodyCell>
        <TableBodyCell>{student.username}</TableBodyCell>
        <TableBodyCell>{student.email}</TableBodyCell>
        <TableBodyCell>
          <a href="/users/{encodeURIComponent(student.username)}" class="font-medium text-primary-600 hover:underline dark:text-primary-500">View</a>
          <a href="/tables" class="font-medium text-red-600 hover:underline dark:text-red-500">Delete</a>
        </TableBodyCell>
      </TableBodyRow>
    {/each}
  {:catch error}
    <TableBodyRow>
      <TableBodyCell class="!p-4">
      </TableBodyCell>
      <TableBodyCell></TableBodyCell>
      <TableBodyCell>{error}</TableBodyCell>
    </TableBodyRow>
  {/await}
  </TableBody>
</TableSearch>
<div class="right-0">
  <ButtonGroup>
    <Button class="right-0" on:click={() => addingStudent = !addingStudent}>Add student</Button>
    <Button><ChevronDownSolid/></Button><!-- TODO: Decrease left padding -->
    <Dropdown>
        <DropdownItem on:click={() => addingFromFile = !addingFromFile}>Add students from file...</DropdownItem>
    </Dropdown>
  </ButtonGroup>
</div>
<AddUserDialog
  bind:open={addingStudent}
  groupId={groupId}
  on:userCreated={event => students = [...students, event.detail]}
/>
<AddUsersFromFileDialog
  bind:open={addingFromFile}
  groupId={groupId}
  on:usersCreated={event => students = [...students, ...event.detail]}
/>
<!-- TODO: add summary of errors? -->


<script lang="ts">
  import { onMount } from 'svelte';
  import {
    Button,
    ButtonGroup,
    Table,
    TableSearch,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    Checkbox,
    Tabs,
    TabItem,
    Spinner,
    Dropdown,
    DropdownItem
  } from 'flowbite-svelte';
  import { ChevronDownSolid } from 'flowbite-svelte-icons';
  import api from '$lib/api';
  import AddUserDialog from '$lib/AddUserDialog.svelte';
  import AddUsersFromFileDialog from '$lib/AddUsersFromFileDialog.svelte';

  export let groupId;

  let students = [];
  let shownStudents = [];
  let usersP;

  onMount(() => {
    usersP = api.listMembers(groupId)
      .then(members => students = members);
  });

  let addingStudent = false;
  let addingFromFile = false;
  let searchTerm = '';
  $: shownStudents = applySearch(searchTerm, students);

  function applySearch(searchTerm: string, students) {
    // TODO: make this fuzzy?
    return students.filter((student) => student.username.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
  }
</script>
