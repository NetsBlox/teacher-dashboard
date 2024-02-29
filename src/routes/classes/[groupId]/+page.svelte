<script lang="ts">

  import { Tabs, TabItem } from 'flowbite-svelte';
  import UserTable from '$lib/UserTable.svelte';
  import { page } from '$app/stores';

  let slug = $page.params.slug;

  // TODO: create the user listing page
  // what needs to be shown?
  //  - username
  //  - email
  //  - actions:
  //    - view
  //    - set password button (maybe only on "edit"?)
  //    - delete
  //    - import project?

  // TODO: what things need to be attached to the context?
  //   - username?
  //   - let's constrain this to groups
  const groupId = $page.params.groupId;
  // TODO: Add breadcrumbs
  // TODO: Add buttons to:
  //   - [ ] add members
  //   - selection:
  //     - [ ] delete?
  //     - [ ] import projects
  //     - [ ] reset password (email)
</script>

<Tabs>
  <TabItem open title="Students">
    <UserTable groupId={groupId} />
  </TabItem>
  <TabItem title="Robots"> <!-- TODO: make this a services tab instead? -->
  </TabItem>
</Tabs>
