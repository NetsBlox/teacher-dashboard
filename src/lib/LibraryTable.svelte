<TableSearch placeholder="Search" hoverable={true} bind:inputValue={searchTerm}>
  <TableHead>
    <TableHeadCell class="!p-4">
      <Checkbox />
    </TableHeadCell>
    <TableHeadCell>name</TableHeadCell>
    <TableHeadCell>description</TableHeadCell>
    <TableHeadCell>actions</TableHeadCell>
  </TableHead>
  <TableBody>
  {#await librariesP}
    <TableBodyRow>
      <TableBodyCell class="!p-4">
      </TableBodyCell>
      <TableBodyCell></TableBodyCell>
      <TableBodyCell><Spinner/></TableBodyCell>
    </TableBodyRow>
  {:then _librariesReady}  
    {#if shownLibraries.length > 0 }
      {#each shownLibraries as library}
        <TableBodyRow>
          <TableBodyCell class="!p-4">
            <Checkbox />
          </TableBodyCell>
          <TableBodyCell>{library.name}</TableBodyCell>
          <TableBodyCell>{library.notes}</TableBodyCell>
          <TableBodyCell>
            <a href="{editorUrl(libraryUrl(library.owner, library.name))}" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Open in NetsBlox</a>
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
        <TableBodyCell><p class="italic">No libraries to show</p></TableBodyCell>
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
    <Button class="right-0" on:click={() => importingLibrary = !importingLibrary}>Import Project</Button>
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
  import { editorUrl, libraryUrl } from "$lib/routes";

  export let username;

  let libraries = [];
  let shownLibraries = [];
  let importingLibrary = false;
  let librariesP;

  onMount(() => {
    librariesP = api.listUserLibraries(username)
      .then(libs => libraries = libs);
  });

  let searchTerm = '';
  $: shownLibraries = applySearch(searchTerm, libraries);

  function applySearch(searchTerm: string, libraries) {
    // TODO: make this fuzzy?
    return libraries.filter((project) => project.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }
</script>
