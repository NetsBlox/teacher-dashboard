<TableSearch placeholder="Search" hoverable={true} bind:inputValue={searchTerm}>
  <TableHead>
    <TableHeadCell class="!p-4">
      <Checkbox />
    </TableHeadCell>
    <TableHeadCell>name</TableHeadCell>
    <TableHeadCell>actions</TableHeadCell>
  </TableHead>
  <TableBody>
  {#await classesP}
    <TableBodyRow>
      <TableBodyCell class="!p-4">
      </TableBodyCell>
      <TableBodyCell></TableBodyCell>
      <TableBodyCell><Spinner/></TableBodyCell>
    </TableBodyRow>
  {:then _classesReady}  
    {#each shownClasses as clazz}
      <TableBodyRow>
        <TableBodyCell class="!p-4">
          <Checkbox />
        </TableBodyCell>
        <TableBodyCell>{clazz.username}</TableBodyCell>
        <TableBodyCell>{clazz.email}</TableBodyCell>
        <TableBodyCell>
            <!-- FIXME: goto -> not href! right? -->
          <a href="dashboard.classUrl(clazz.id)" class="font-medium text-primary-600 hover:underline dark:text-primary-500">View</a>
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
        <DropdownItem on:click={() => addingFromFile = !addingFromFile}>Add classes from file...</DropdownItem>
    </Dropdown>
  </ButtonGroup>
</div>
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

  export let username;

  let classes = [];
  let shownClasses = [];
  let classesP;

  onMount(() => {
    classesP = api.listGroups(username)
      .then(groups => classes = groups);
  });

  let addingStudent = false;
  let addingFromFile = false;
  let searchTerm = '';
  $: shownClasses = applySearch(searchTerm, classes);

  function applySearch(searchTerm: string, classes) {
    // TODO: make this fuzzy?
    return classes.filter((student) => student.username.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
  }
</script>
