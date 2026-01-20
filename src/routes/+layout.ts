import type { LayoutLoad } from './$types';

import { whoami } from '$lib/utils/api/users';

export const load: LayoutLoad = async ({ fetch }) => {
  const result = whoami(fetch);
  return { session: result };
};
