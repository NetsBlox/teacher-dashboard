<script lang="ts">
  import { page } from "$app/state";
  import john from "$assets/john.svg";

</script>

<!-- Text Section -->
<section class="container mx-auto flex flex-col items-center justify-center">
  <span
    class="mt-8 text-center align-middle text-5xl font-bold xl:text-6xl dark:text-gray-50"
  >
    Something went wrong! ({page.error?.message})
  </span>
  <!-- Image Grid Section -->
  <img src={john} alt="lost john travolta" width="500" />
</section>
<section class="flex flex-row justify-center"></section>
