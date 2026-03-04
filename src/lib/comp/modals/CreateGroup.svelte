<script lang="ts">
  import type { GroupTable } from '$lib/data/tables/groups.svelte';
  import type { CreateGroupData } from 'netsblox-cloud-client/src/types/CreateGroupData';

  import { Button, Modal, Hr, Label, Input } from 'flowbite-svelte';

  type Props = {
    table: GroupTable;
    open: boolean;
  };

  let { table, open = $bindable() }: Props = $props();
  const data: CreateGroupData = $state({ name: '', servicesHosts: [] });
</script>

<Modal bind:open title="Create New Group" size="xs">
  <form class="flex flex-col gap-2">
    <Label>Name:</Label>
    <Input bind:value={data.name} />
    {#if data.servicesHosts && data.servicesHosts.length > 0}
      <fieldset>
        <legend class="-mb-2 font-semibold underline">
          Additional Services
        </legend>

        {#each data.servicesHosts as host, idx}
          <div class="mt-4 border-l-2 border-gray-300 pl-4">
            <Label>Service URL:</Label>
            <Input bind:value={host.url} />
            <Label>Category Name:</Label>
            <Input bind:value={host.categories[0]} />
          </div>
        {/each}
      </fieldset>
    {/if}
    <menu class="flex flex-row justify-between">
      <menuitem>
        <button
          class="hover:text-primary-500 cursor-pointer text-sm hover:underline"
          onclick={() =>
            data.servicesHosts?.push({ url: '', categories: [''] })}
        >
          Add service host
        </button>
      </menuitem>
      {#if data.servicesHosts && data.servicesHosts.length > 0}
        <menuitem>
          <button
            class="cursor-pointer text-sm hover:text-red-500 hover:underline"
            onclick={() => data.servicesHosts?.pop()}
            >Remove service host
          </button>
        </menuitem>
      {/if}
    </menu>
    <Hr />
      <Button
        outline
        onclick={() => {
          table.createGroup(data);
          open = false;
        }}
        class="self-start"
      >
        Create
      </Button>
  </form>
</Modal>
