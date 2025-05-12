import { CLOUD_URL } from '$lib/utils/routes';
import { RequestError } from 'netsblox-cloud-client/src/error';
import type { Group } from 'netsblox-cloud-client/src/types/Group';
import type { User } from 'netsblox-cloud-client/src/types/User';
import type { PageLoad } from './$types';
import type { Assignment } from 'netsblox-cloud-client/src/types/Assignment';
import { errorSetContext } from '$lib/contexts/ErrorDialogContext.svelte';

type Fetch = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

const getGroup = async (fetch: Fetch, groupId: string) => {
  const response = await fetch(CLOUD_URL + '/groups/id/' + groupId, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw RequestError.from(response);
  }

  return (await response.json()) as Group;
};

const getMembers = async (fetch: Fetch, groupId: string) => {
  const response = await fetch(CLOUD_URL + '/groups/id/' + groupId + '/members', {
    credentials: 'include',
  });
  if (!response.ok) {
    throw RequestError.from(response);
  }

  return (await response.json()) as User[];
};


const getAssignments = async (fetch: Fetch, groupId: string) => {
  const response = await fetch(CLOUD_URL + '/groups/id/' + groupId + '/assignments/', {
    credentials: 'include',
  });
  if (!response.ok) {
    throw RequestError.from(response);
  }

  return (await response.json()) as Assignment[];
};

export const load: PageLoad = async ({ fetch, params }) => {
  const groupP = getGroup(fetch, params.groupId)
  const membersP = getMembers(fetch, params.groupId)
  const assignmentsP = getAssignments(fetch, params.groupId)
  try {
    const [group, members, assignments] = await Promise.all([groupP, membersP, assignmentsP])
    return {group, members, assignments}
  } catch(rawErr) {
    errorSetContext.push(new Error("Failed to get group data."))
    return {group: [], members: [], assignments: []}
  }
};
