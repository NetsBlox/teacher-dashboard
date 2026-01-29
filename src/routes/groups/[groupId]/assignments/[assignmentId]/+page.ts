import { getAssignment, getSubmissions } from '$lib/utils/api/groups';
import type { AssignmentId } from 'netsblox-cloud-client/src/types/AssignmentId';
import type { GroupId } from 'netsblox-cloud-client/src/types/GroupId';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ fetch, params }) => {
  const groupId: GroupId = params.groupId;
  const assignmentId: AssignmentId = params.assignmentId;
  const assignmentAR = getAssignment(fetch, groupId, assignmentId);
  const submissionsAR = getSubmissions(fetch, groupId, assignmentId);
  return { assignmentAR, submissionsAR };
};
