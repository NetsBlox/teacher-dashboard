<Modal bind:open={open} size="sm" autoclose class="w-full">
  <form class="flex flex-col space-y-6" action="#">
    <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Import project for {username}</h3>
    <!-- TODO: add a description -->
    <Label class="pb-2">Project XML</Label>
    <Fileupload  bind:files={uploadFiles}/>
    <Button on:click={importProjects} class="w-full1">Import</Button>
  </form>
</Modal>

<script lang="ts">
  import { Button, Modal, Label, Input, Checkbox, Fileupload } from 'flowbite-svelte';
  import { createEventDispatcher } from 'svelte';
  import type { NewUser } from 'netsblox-cloud-client/src/types/NewUser';
  import api from '$lib/api';
  import { readFile, getRoleData } from '$lib/utils';

  const dispatch = createEventDispatcher();
  let uploadFiles;
  $: console.log(uploadFiles);

  export let open = true;
  export let username;

  async function importProjects() {
    const files = [...uploadFiles];
    try {
      const projects = await Promise.all(files.map(importProject));
      console.log(projects)
      dispatch('projectsCreated', projects);
    } catch (err) {
      // TODO: better error handling if some fail
      console.error(`Error occurred: ${err}`)
    }
  }

  async function importProject(file: File) {
    try {
      const xml = await readFile(file);
      return await api.createProject({
        owner: username,
        name: file.name.replace(/\.xml/, ''),
        roles: getRoleData(xml)
        saveState: "Saved"
      })
    } catch (err) {
      throw new DataFileError(file.name, err);
    }
  }
</script>
