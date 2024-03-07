{#await usernameP}
  <Spinner class="center"/>
{:then _username}  
{:catch error}  
  <!-- TODO: show the error! -->
{/await}

<script lang="ts">
  import { onMount } from 'svelte';
  import { Spinner } from 'flowbite-svelte';
  import api from '$lib/api';
  import { goto } from "$app/navigation";

  let username;
  let usernameP;
  onMount(() => {
    usernameP = api.whoami()
      .then(username => goto(`/users/${encodeURIComponent(username)}`))
      .catch(err => {
        console.log('error!', err);
        const cloudUrl = api.baseUrl;
        //window.location = `https://login.netsblox.org?redirect=${encodeURIComponent(window.location.href)}&url=${encodeURIComponent(cloudUrl)}`;
      })  // FIXME
  });
  // Redirect to login page, if not logged in
  // Otherwise, redirect to view logged in user
</script>
