import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import type { PageLoad, PageParentData } from './$types';

export const load: PageLoad  = async ({ parent }) => {
  let { authUser }: PageParentData =  await parent()
  if (authUser && browser) {
    goto(`/users/${authUser}`)
  }
};
