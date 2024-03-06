<Modal bind:open={open} size="sm" autoclose class="w-full">
  <form class="flex flex-col space-y-6" action="#">
    <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add users from file</h3>
    <!-- TODO: add a description -->
    <Label class="pb-2">Upload file</Label>
    <Fileupload  on:change={event => console.log(event)} bind:files={uploadFiles}/>
    <Button on:click={createUsers} class="w-full1">Create</Button>
  </form>
</Modal>

<script lang="ts">
  import { Button, Modal, Label, Input, Checkbox, Fileupload } from 'flowbite-svelte';
  import { createEventDispatcher } from 'svelte';
  import type { NewUser } from 'netsblox-cloud-client/src/types/NewUser';
  import api from '$lib/api';

  const dispatch = createEventDispatcher();
  let uploadFiles;
  $: console.log(uploadFiles);

  export let open = true;
  export let groupId;

  async function readFile(file) {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.readAsText(file, 'utf-8')
      reader.onload = evt => res(evt.target.result);
    });
  }

  async function createUsers() {
    const files = [...uploadFiles];
    const userData = (await Promise.all(files.map(readUserData))).flat();
    try {
      const users = await Promise.all(userData.map(datum => api.createUser(datum)));
      console.log('created users:')
      console.log(users)
      dispatch('usersCreated', users);
    } catch (err) {
      // TODO: better error handling if some fail
      console.error(`Error occurred: ${err}`)
    }
  }

  class UserDataError extends Error {
    constructor(filename: string, inner: Error) {
      const msg = `${inner.message} (${filename})`;
      super(msg);
    }
  }

  /**
   * Read and parse user data from a CSV file.
   */
  async function readUserData(file): NewUser[] {
    try {
      const contents = await readFile(file);
      return parseUsers(contents);
    } catch (err) {
      throw new UserDataError(err);
    }
  }

  function parseUsers(csvContents: string): NewUser {
    return csvContents.split('\n')
      .map(line => line.trim())
      .filter(line => !!line)
      .map(line => {
          const [username, email, password] = line.split(',');
          // username is definitely defined since the line isn't empty
          if (!email) {
            throw new Error(`No email address provided for ${username}`);
          }
          const userData = {username, email};
          if (password) {
            userData.password = password;
          }
          if (groupId) {
            userData.groupId = groupId;
          }
          return userData;
      })
    
  }
  // fields:
  //   - username
  //   - email
  //   - password
  //   - role?
</script>
