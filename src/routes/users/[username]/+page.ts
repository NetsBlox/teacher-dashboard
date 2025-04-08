import { CLOUD_URL } from '$lib/utils/routes';
import { RequestError } from 'netsblox-cloud-client/src/error';
import type { Group } from 'netsblox-cloud-client/src/types/Group';
import type { LibraryMetadata } from 'netsblox-cloud-client/src/types/LibraryMetadata';
import type { User } from 'netsblox-cloud-client/src/types/User';
import type { PageLoad } from './$types';
import type { ProjectMetadata } from 'netsblox-cloud-client/src/types/ProjectMetadata';

type Fetch = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

const getUser = async (fetch: Fetch, username: string) => {
  const response = await fetch(CLOUD_URL + '/users/' + username, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw RequestError.from(response);
  }

  return (await response.json()) as User;
};

const getProjects = async (fetch: Fetch, username: string) => {
  const response = await fetch(CLOUD_URL + '/projects/user/' + username, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw RequestError.from(response);
  }
  return (await response.json()) as ProjectMetadata[];
};

const getSharedProjects = async (fetch: Fetch, username: string) => {
  const response = await fetch(CLOUD_URL + '/projects/shared/' + username, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw RequestError.from(response);
  }
  return (await response.json()) as ProjectMetadata[];
};

const getGroups = async (fetch: Fetch, username: string) => {
  const response = await fetch(CLOUD_URL + '/groups/user/' + username + '/', {
    credentials: 'include',
  });
  if (!response.ok) {
    throw RequestError.from(response);
  }
  return (await response.json()) as Group[];
};

const getLibraries = async (fetch: Fetch, username: string) => {
  const response = await fetch(
    CLOUD_URL + '/libraries/user/' + username + '/',
    { credentials: 'include' },
  );
  if (!response.ok) {
    throw RequestError.from(response);
  }
  return (await response.json()) as LibraryMetadata[];
};

export const load: PageLoad = async ({ fetch, params }) => {
  const userP = getUser(fetch, params.username);
  const projectsP = getProjects(fetch, params.username);
  const sharedP = getSharedProjects(fetch, params.username);
  const librariesP = getLibraries(fetch, params.username);
  const groupsP = getGroups(fetch, params.username);
  const allPs = Promise.all([userP, projectsP, sharedP, librariesP, groupsP]);
  const [user, projects, shared, libraries, groups] = await allPs;
  return { user, projects, shared, libraries, groups };
};
