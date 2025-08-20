import { DashboardError } from '$lib/utils/errors';
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
  } else throw null;
}

export const load: LayoutLoad = async ({ fetch }) => {
  try {
    return await whoami(fetch);
  } catch(_e) {
    DashboardError.create('Failed to reach cloud.');
    return { authUser: undefined };
  }
};
