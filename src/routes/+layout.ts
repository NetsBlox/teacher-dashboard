import type { LayoutLoad } from './$types';

import { whoami } from '$lib/utils/api/users';

export const load: LayoutLoad = ({ fetch }) => {
  const result = whoami(fetch);
  return { sessionAR: result };
};
