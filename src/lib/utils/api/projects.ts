import type { CreateProjectData } from 'netsblox-cloud-client/src/types/CreateProjectData';
import type { ProjectId } from 'netsblox-cloud-client/src/types/ProjectId';
import type { ProjectMetadata } from 'netsblox-cloud-client/src/types/ProjectMetadata';
import type { Fetch } from '../types';

import { fromPromise } from 'neverthrow';
import { NetworkError } from '../errors';
import { CLOUD_URL } from '../routes';
import { FetchBuilder, mapResponse } from './common';

export function createProject(fetch: Fetch, data: CreateProjectData) {
  const endpoint = CLOUD_URL + '/projects/';
  const { url, opt } = FetchBuilder.to(endpoint).method('POST').payload(data);
  const result = fromPromise(fetch(url, opt), () => NetworkError())
    .andThen((rsp) => mapResponse(rsp, {parse: 'json'}))
    .map((json) => json as ProjectMetadata);
  return result;
}

export function getProjects(fetch: Fetch, username: string) {
  const endpoint = `${CLOUD_URL}/projects/user/${username}`;
  const { url, opt } = FetchBuilder.to(endpoint);
  const result = fromPromise(fetch(url, opt), () => NetworkError())
    .andThen((rsp) => mapResponse(rsp, {parse: 'json'}))
    .map((json) => json as ProjectMetadata[]);
  return result;
}

export function deleteProject(fetch: Fetch, id: ProjectId) {
  const endpoint = `${CLOUD_URL}/projects/id/${id}`;
  const { url, opt } = FetchBuilder.to(endpoint).method('DELETE');
  const result = fromPromise(fetch(url, opt), () => NetworkError())
    .andThen((rsp) => mapResponse(rsp, {parse: 'json'}))
    .map((json) => json as ProjectMetadata);
  return result;
}

export function getCollabs(fetch: Fetch, username: string) {
  const endpoint = `${CLOUD_URL}/projects/shared/${username}`;
  const { url, opt } = FetchBuilder.to(endpoint);
  const result = fromPromise(fetch(url, opt), () => NetworkError())
    .andThen((rsp) => mapResponse(rsp, {parse: 'json'}))
    .map((json) => json as ProjectMetadata[]);
  return result;
}
