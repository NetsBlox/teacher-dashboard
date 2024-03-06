<Modal bind:open={open} size="xs" autoclose class="w-full">
  <form class="flex flex-col space-y-6" action="#">
    <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add new user</h3>
    <Label class="space-y-2">
      <span>Username</span>
      <Input bind:value={username} name="username" required />
    </Label>
    <Label class="space-y-2">
      <span>Email</span>
      <Input bind:value={email} type="email" name="email" required />
    </Label>
    <Label class="space-y-2">
      <span>Password</span>
      <Input bind:value={password} type="password" name="password" placeholder="•••••" />
    </Label>
    <Button on:click={createUser} class="w-full1">Create</Button>
  </form>
</Modal>

<script lang="ts">
  import { Button, Modal, Label, Input, Checkbox } from 'flowbite-svelte';
  import { createEventDispatcher } from 'svelte';
  import api from '$lib/api';

  const dispatch = createEventDispatcher();

  export let open = true;
  export let username = "brian";
  export let email = "test@netsblox.org";
  export let password = undefined;
  export let groupId;

  async function createUser() {
    const newUserData = {
      username,
      email,
      groupId,
    };
    if (password) {
      newUserData.password = password;
    }

    try {
      const user = await api.createUser(newUserData);
      console.log('created user', user);
      dispatch('userCreated', user);
    } catch (err) {
      dispatch('error', err);
      // TODO: test errors
    }
  }
  // fields:
  //   - username
  //   - email
  //   - password
  //   - role?
</script>
