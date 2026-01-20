import { getGroups } from '$lib/utils/api/groups';
import { getLibraries } from '$lib/utils/api/libraries';
import { getCollabs, getProjects } from '$lib/utils/api/projects';
import { getUser } from '$lib/utils/api/users';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
  const userAR = getUser(fetch, params.username);
  const projectsAR = getProjects(fetch, params.username);
  const sharedAR = getCollabs(fetch, params.username);
  const librariesAR = getLibraries(fetch, params.username);
  const groupsAR = getGroups(fetch, params.username);
  return { userAR, projectsAR, sharedAR, librariesAR, groupsAR };
};
