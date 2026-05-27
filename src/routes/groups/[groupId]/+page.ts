import {
  getAssignments,
  getGroup,
  getJoinCode,
  getMembers,
} from '$lib/utils/api/groups';
import { getGroupSettings } from '$lib/utils/api/services';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ fetch, params }) => {
  const groupAR = getGroup(fetch, params.groupId);
  const joinCodeAR = getJoinCode(fetch, params.groupId);
  const membersAR = getMembers(fetch, params.groupId);
  const assignmentsAR = getAssignments(fetch, params.groupId);
  const serviceSettingsAR = getGroupSettings(fetch, params.groupId);
  return { groupAR, joinCodeAR, membersAR, assignmentsAR, serviceSettingsAR };
};
