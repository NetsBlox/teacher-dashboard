<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { loginUrl } from '$lib/utils/routes';
  import { Button } from 'flowbite-svelte';
  import { NavTitleText }from '$lib/contexts/Contexts.svelte'

  NavTitleText.value = "Dashboard"
  const { data } = $props();

  const handleClick = () => {
    if (data.authUser) goto('/users/' + data.authUser);
    else window.location.href = loginUrl(page.url);
  };
</script>

<!-- Text Section -->
<section
  class="container mx-auto flex flex-col items-center justify-center pt-10 md:flex-row"
>
  <span
    class="text-center align-middle text-5xl font-bold xl:text-6xl dark:text-gray-50 "
  >
    Manage Everything NetsBlox in One Place!
  </span>
  <!-- Image Grid Section -->
  <figure class="scale-85 pt-10 brightness-90">
    <video autoplay loop> 
      <source src="src/assets/demo.webm" type="video/webm"/>
      <track kind='captions' srclang="en" src='src/lib/utils/captions/landing.vtt' label="English"/>
    </video>
  </figure>
</section>
<section class="flex flex-row justify-center">
  <Button onclick={handleClick} pill size="xl" color="dark">Get Started!</Button
  >
</section>
