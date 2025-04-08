import { CLOUD_URL } from '$lib/utils/routes';
import type { LayoutLoad } from './$types';

async function whoami(fetch: any) {
  const response = await fetch(CLOUD_URL + '/users/whoami', {
    credentials: 'include',
  });
  if (!response.ok) {
    return { status: response.status };
  }
  const authUser = await response.text();
  return { authUser };
}

export const load: LayoutLoad = async ({ fetch }) => {
  try {
    return await whoami(fetch);
  } catch {
    return { status: 600 };
  }
};
