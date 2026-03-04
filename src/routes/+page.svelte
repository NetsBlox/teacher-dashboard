<script lang="ts">
  import { page } from '$app/state';
  import { loginUrl } from '$lib/utils/routes';
  import { Button } from 'flowbite-svelte';
  import demo from '$assets/demo.webm';
  import { getNavbarContext } from '$lib/contexts/Contexts.svelte';
  import { goto } from '$app/navigation';

  getNavbarContext().title = 'NetsBlox Dashboard';
  const handleClick = () => {
    window.location.href = loginUrl(page.url);
  };
  let { data } = $props();
  // svelte-ignore state_referenced_locally
  data.sessionAR.andTee((user) => (user ? goto(`/users/${user}/`) : null));

</script>

<section
  class="container mx-auto flex flex-col items-center justify-center pt-10 md:flex-row"
>
  <span
    class="text-center align-middle text-5xl font-bold xl:text-6xl dark:text-gray-50"
  >
    Manage Everything NetsBlox in One Place!
  </span>
  <figure class="scale-85 cursor-pointer pt-10 brightness-90">
    <video autoplay loop width={2000}>
      <source src={demo} type="video/webm" />
      <track
        kind="captions"
        srclang="en"
        src="src/lib/utils/captions/landing.vtt"
        label="English"
      />
    </video>
  </figure>
</section>
<section class="flex flex-row justify-center">
  <Button onclick={handleClick} pill size="xl" color="dark">Get Started!</Button
  >
</section>
