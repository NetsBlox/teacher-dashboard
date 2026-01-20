import type { NewUser } from 'netsblox-cloud-client/src/types/NewUser';
import type { User } from 'netsblox-cloud-client/src/types/User';
import { fromPromise } from 'neverthrow';
import { NetworkError } from '../errors';
import { CLOUD_URL } from '../routes';
import type { Fetch } from '../types';
import { FetchBuilder, mapResponse } from './common';

export function whoami(fetch: Fetch) {
  const { url, opt } = FetchBuilder.to(`${CLOUD_URL}/users/whoami`);
  const result = fromPromise(fetch(url, opt), () => NetworkError()).andThen(
    (rsp) => mapResponse(rsp, { parse: 'text' }),
  );
  return result;
}

const endpoint = `${CLOUD_URL}/users/logout`;
export function logout(fetch: Fetch) {
  const { url, opt } = FetchBuilder.to(endpoint).method('POST');
  const res = fromPromise(fetch(url, opt), () => NetworkError()).andThrough(
    (rsp) => mapResponse(rsp),
  );
  return res;
}

export function getUser(fetch: Fetch, username: string) {
  const { url, opt } = FetchBuilder.to(`${CLOUD_URL}/users/${username}`);
  const result = fromPromise(fetch(url, opt), () => NetworkError())
    .andThen((rsp) => mapResponse(rsp, { parse: 'json' }))
    .map((json) => json as User);
  return result;
}

export function createUser(fetch: Fetch, data: NewUser) {
  const endpoint = `${CLOUD_URL}/users/create`;
  const { url, opt } = FetchBuilder.to(endpoint).payload(data).method('POST');
  const result = fromPromise(fetch(url, opt), () => NetworkError())
    .andThen((rsp) => mapResponse(rsp, { parse: 'json' }))
    .map((json) => json as User);
  return result;
}

//FIXME: REPLACE WITH netsblox-cloud-client BINDING on UPDATE
type TEMP_NEWUSERBATCH = { users: NewUser[] };

export function createUserBatch(fetch: Fetch, data: TEMP_NEWUSERBATCH) {
  const endpoint = `${CLOUD_URL}/users/batch`;
  const { url, opt } = FetchBuilder.to(endpoint).payload(data).method('POST');
  const result = fromPromise(fetch(url, opt), () => NetworkError())
    .andThen((rsp) => mapResponse(rsp, { parse: 'json', parseErr: 'json' }))
    .map((json) => json as User[]);
  return result;
}

export function deleteUser(fetch: Fetch, username: string) {
  const endpoint = `${CLOUD_URL}/users/${username}/delete`;
  const { url, opt } = FetchBuilder.to(endpoint).method('POST');
  const result = fromPromise(fetch(url, opt), () => NetworkError())
    .andThen((rsp) => mapResponse(rsp, { parse: 'json' }))
    .map((json) => json as User);
  return result;
}
