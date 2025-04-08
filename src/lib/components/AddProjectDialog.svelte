<script lang="ts">
  import { run } from 'svelte/legacy';

  import {
    Button,
    Modal,
    Label,
    Input,
    Checkbox,
    Fileupload,
  } from "flowbite-svelte";
  import { createEventDispatcher } from "svelte";
  import type { NewUser } from "netsblox-cloud-client/src/types/NewUser";
  import api from "$lib/api";
  import { readFile, getRoleData } from "$lib/utils";

  const dispatch = createEventDispatcher();
  let uploadFiles: FileList = $state();
  run(() => {
    console.log(uploadFiles);
  });

  interface Props {
    open: boolean;
    username: string;
  }

  let { open = $bindable(), username }: Props = $props();

  async function importProjects() {
    const files = [...uploadFiles];
    try {
      const projects = await Promise.all(files.map(importProject));
      console.log(projects);
      dispatch("projectsCreated", projects);
    } catch (err) {
      // TODO: better error handling if some fail
      console.error(`Error occurred: ${err}`);
    }
  }

  async function importProject(file: File) {
    try {
      const xml: string = await readFile(file);
      return await api.createProject({
        owner: username,
        name: file.name.replace(/\.xml/, ""),
        roles: getRoleData(xml),
        saveState: "Saved",
      });
    } catch (err) {
      throw new Error(err as string);
    }
  }
</script>

<!-- This component is a popup window that allows users to include a project xml file and add it to their account -->
<Modal bind:open size="sm" autoclose class="w-full">
  <form class="flex flex-col space-y-6" action="#">
    <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
      Import project for {username}
    </h3>
    <!-- TODO: add a description -->
    <Label class="pb-2">Select a project xml file and press Import.</Label>
    <Fileupload bind:files={uploadFiles} />
    <Button on:click={importProjects} class="w-full1">Import</Button>
  </form>
</Modal>
