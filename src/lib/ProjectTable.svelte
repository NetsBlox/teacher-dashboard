<TableSearch placeholder="Search" hoverable={true} bind:inputValue={searchTerm}>
  <TableHead>
    <TableHeadCell class="!p-4">
      <Checkbox />
    </TableHeadCell>
    <TableHeadCell>name</TableHeadCell>
    <TableHeadCell>contributors</TableHeadCell>
    <TableHeadCell>state</TableHeadCell>
    <TableHeadCell>updated at</TableHeadCell>
  </TableHead>
  <TableBody>
  {#await projectsP}
    <TableBodyRow>
      <TableBodyCell class="!p-4">
      </TableBodyCell>
      <TableBodyCell></TableBodyCell>
      <TableBodyCell><Spinner/></TableBodyCell>
    </TableBodyRow>
  {:then _projectsReady}  
    {#if shownProjects.length > 0 }
      {#each shownProjects as project}
        <TableBodyRow>
          <TableBodyCell class="!p-4">
            <Checkbox />
          </TableBodyCell>
          <TableBodyCell>{project.name}</TableBodyCell>
          <TableBodyCell>{project.owner}</TableBodyCell>
          <TableBodyCell>
            <a href="/tables" class="font-medium text-primary-600 hover:underline dark:text-primary-500">View</a>
            <a href="/tables" class="font-medium text-red-600 hover:underline dark:text-red-500">Delete</a>
          </TableBodyCell>
        </TableBodyRow>
      {/each}
    {:else}
      <!-- TODO: shouldn't be able to select this -->
      <TableBodyRow>
        <TableBodyCell class="!p-4">
        </TableBodyCell>
        <TableBodyCell></TableBodyCell>
        <TableBodyCell><p class="italic">No projects to show</p></TableBodyCell>
      </TableBodyRow>
    {/if}
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
    <Button class="right-0" on:click={() => importingProject = !importingProject}>Import Project</Button>
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

  export let username;

  let projects = [];
  let shownProjects = [];
  let projectsP;

  onMount(() => {
    projectsP = Promise.all([
      api.listUserProjects(username),
      api.listSharedProjects(username),
    ])
      .then(ownAndSharedProjects => projects = ownAndSharedProjects.flat());
  });

  let searchTerm = '';
  $: shownProjects = applySearch(searchTerm, projects);

  function applySearch(searchTerm: string, projects) {
    // TODO: make this fuzzy?
    return projects.filter((project) => project.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }
</script>
