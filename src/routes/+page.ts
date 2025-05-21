import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad  = async ({ parent }) => {
  const { authUser } = await parent()
  if (authUser) redirect(307, '/users/' + authUser)
  return {}
};
