import type { Assignment } from 'netsblox-cloud-client/src/types/Assignment';
import type { CreateGroupData } from 'netsblox-cloud-client/src/types/CreateGroupData';
import type { Group } from 'netsblox-cloud-client/src/types/Group';
import type { Submission } from 'netsblox-cloud-client/src/types/Submission';
import type { User } from 'netsblox-cloud-client/src/types/User';
import type { Fetch } from '../types';

import type { AssignmentId } from 'netsblox-cloud-client/src/types/AssignmentId';
import type { CreateAssignmentData } from 'netsblox-cloud-client/src/types/CreateAssignmentData';
import type { GroupId } from 'netsblox-cloud-client/src/types/GroupId';
import type { SubmissionId } from 'netsblox-cloud-client/src/types/SubmissionId';
import { fromPromise } from 'neverthrow';
import { NetworkError } from '../errors';
import { CLOUD_URL } from '../routes';
import { FetchBuilder, mapResponse } from './common';

export function getGroup(fetch: Fetch, groupId: string) {
  const { url, opt } = FetchBuilder.to(`${CLOUD_URL}/groups/id/${groupId}`);
  const result = fromPromise(fetch(url, opt), () => NetworkError())
    .andThen((rsp) => mapResponse(rsp, {parse: 'json'}))
    .map((json) => json as Group);
  return result;
}

export function getGroups(fetch: Fetch, username: string) {
  const { url, opt } = FetchBuilder.to(`${CLOUD_URL}/groups/user/${username}/`);
  const result = fromPromise(fetch(url, opt), () => NetworkError())
    .andThen((rsp) => mapResponse(rsp, {parse: 'json'}))
    .map((json) => json as Group[]);
  return result;
}

export function createGroup(
  fetch: Fetch,
  username: string,
  data: CreateGroupData,
) {
  const endpoint = `${CLOUD_URL}/groups/user/${username}/`;
  const { url, opt } = FetchBuilder.to(endpoint).payload(data).method('POST');
  const result = fromPromise(fetch(url, opt), () => NetworkError())
    .andThen((rsp) => mapResponse(rsp, {parse: 'json'}))
    .map((json) => json as Group);
  return result;
}

export function deleteGroup(fetch: Fetch, groupId: string) {
  const endpoint = `${CLOUD_URL}/groups/id/${groupId}`;
  const { url, opt } = FetchBuilder.to(endpoint).method('DELETE');
  const result = fromPromise(fetch(url, opt), () => NetworkError())
    .andThen((rsp) => mapResponse(rsp, {parse: 'json'}))
    .map((json) => json as Group);
  return result;
}

export function getMembers(fetch: Fetch, groupId: string) {
  const endpoint = `${CLOUD_URL}/groups/id/${groupId}/members`;
  const { url, opt } = FetchBuilder.to(endpoint);
  const result = fromPromise(fetch(url, opt), () => NetworkError())
    .andThen((rsp) => mapResponse(rsp, {parse: 'json'}))
    .map((json) => json as User[]);
  return result;
}

export function createAssignment(
  fetch: Fetch,
  id: GroupId,
  data: CreateAssignmentData,
) {
  const endpoint = `${CLOUD_URL}/groups/id/${id}/assignments/`;
  const { url, opt } = FetchBuilder.to(endpoint).payload(data).method('POST');
  const result = fromPromise(fetch(url, opt), () => NetworkError())
    .andThen((rsp) => mapResponse(rsp, {parse: 'json'}))
    .map((json) => json as Assignment[]);
  return result;
}

export function getAssignments(fetch: Fetch, groupId: string) {
  const endpoint = `${CLOUD_URL}/groups/id/${groupId}/assignments/`;
  const { url, opt } = FetchBuilder.to(endpoint);
  const result = fromPromise(fetch(url, opt), () => NetworkError())
    .andThen((rsp) => mapResponse(rsp, {parse: 'json'}))
    .map((json) => json as Assignment[]);
  return result;
}

export function getAssignment(
  fetch: Fetch,
  groupId: string,
  assignmentId: string,
) {
  const endpoint = `${CLOUD_URL}/groups/id/${groupId}/assignments/id/${assignmentId}/`;
  const { url, opt } = FetchBuilder.to(endpoint);
  const result = fromPromise(fetch(url, opt), () => NetworkError())
    .andThen((rsp) => mapResponse(rsp, {parse: 'json'}))
    .map((json) => json as Assignment);
  return result;
}

export function deleteAssignment(
  fetch: Fetch,
  groupId: string,
  assignmentId: string,
) {
  const endpoint = `${CLOUD_URL}/groups/id/${groupId}/assignments/id/${assignmentId}/`;
  const { url, opt } = FetchBuilder.to(endpoint).method('DELETE');
  const result = fromPromise(fetch(url, opt), () => NetworkError())
    .andThen((rsp) => mapResponse(rsp, {parse: 'json'}))
    .map((json) => json as Assignment);
  return result;
}

export function getSubmissions(
  fetch: Fetch,
  groupId: string,
  assignmentId: string,
) {
  const endpoint = `${CLOUD_URL}/groups/id/${groupId}/assignments/id/${assignmentId}/submissions/`;
  const { url, opt } = FetchBuilder.to(endpoint);
  const result = fromPromise(fetch(url, opt), () => NetworkError())
    .andThen((rsp) => mapResponse(rsp, {parse: 'json'}))
    .map((json) => json as Submission[]);
  return result;
}

export function deleteSubmission(
  fetch: Fetch,
  gid: GroupId,
  aid: AssignmentId,
  id: SubmissionId,
) {
  const endpoint = `${CLOUD_URL}/groups/id/${gid}/assignments/id/${aid}/submissions/id/${id}/`;
  const { url, opt } = FetchBuilder.to(endpoint).method('DELETE');
  const result = fromPromise(fetch(url, opt), () => NetworkError())
    .andThen((rsp) => mapResponse(rsp, {parse: 'json'}))
    .map((json) => json as Submission);
  return result;
}
