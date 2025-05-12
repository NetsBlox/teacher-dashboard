import { ErrorSetContext } from '$lib/contexts/Contexts.svelte';
import { CLOUD_URL } from '$lib/utils/routes';
import type { LayoutLoad } from './$types';

async function whoami(fetch: any) {
  const response = await fetch(CLOUD_URL + '/users/whoami', {
    credentials: 'include',
  });
  if (response.ok) {
    return { authUser: await response.text() };
  } else if (response.status === 403) {
    return { authUser: undefined };
  } else throw Error;
}

export const load: LayoutLoad = async ({ fetch }) => {
  try {
    return await whoami(fetch);
  } catch {
    ErrorSetContext.push(new Error('Failed to reach cloud.'));
    return { authUser: undefined };
  }
};
