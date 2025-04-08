import { CLOUD_URL } from '$lib/utils/routes';
import { RequestError } from 'netsblox-cloud-client/src/error';
import type { Group } from 'netsblox-cloud-client/src/types/Group';
import type { User } from 'netsblox-cloud-client/src/types/User';
import type { PageLoad } from './$types';

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

export const load: PageLoad = async ({ fetch, params }) => {
  const groupP = getGroup(fetch, params.groupId)
  const membersP = getMembers(fetch, params.groupId)
  const [group, members] = await Promise.all([groupP, membersP])

  return {group, members}
};
