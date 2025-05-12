import { CLOUD_URL } from '$lib/utils/routes';
import { RequestError } from 'netsblox-cloud-client/src/error';
import type { Group } from 'netsblox-cloud-client/src/types/Group';
import type { GroupId } from 'netsblox-cloud-client/src/types/GroupId';
import type { AssignmentId } from 'netsblox-cloud-client/src/types/AssignmentId';
import type { PageLoad } from './$types';
import type { Submission } from 'netsblox-cloud-client/src/types/Submission';
import { errorSetContext } from '$lib/contexts/ErrorDialogContext.svelte';

type Fetch = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

const getSubmissions = async (fetch: Fetch, groupId: string, assignmentId: string) => {
  const response = await fetch(CLOUD_URL + '/groups/id/' + groupId + '/assignments/id/' + assignmentId + '/submissions/', {
    credentials: 'include',
  });
  if (!response.ok) {
    throw RequestError.from(response);
  }
  return (await response.json()) as Submission[];
};

export const load: PageLoad = async ({ fetch, params }) => {
  const groupId: GroupId = params.groupId
  const assignmentId: AssignmentId = params.assignmentId
  const submissionsP = getSubmissions(fetch, groupId, assignmentId)
  try {
    const [ submissions ] = await Promise.all([submissionsP])
    return {submissions, groupId, assignmentId}
  } catch(err){
    errorSetContext.push(new Error("Failed to load submissions."))
    console.error(err)
    return {submissions: [], groupId, assignmentId}
  }


};
