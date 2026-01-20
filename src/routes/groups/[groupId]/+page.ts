import { getAssignments, getGroup, getMembers } from '$lib/utils/api/groups';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
  const groupAR = getGroup(fetch, params.groupId);
  const membersAR = getMembers(fetch, params.groupId);
  const assignmentsAR = getAssignments(fetch, params.groupId);
  return { groupAR, membersAR, assignmentsAR };
};
