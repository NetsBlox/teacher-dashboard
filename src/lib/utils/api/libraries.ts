import type { CreateLibraryData } from 'netsblox-cloud-client/src/types/CreateLibraryData';
import type { LibraryMetadata } from 'netsblox-cloud-client/src/types/LibraryMetadata';
import { fromPromise } from 'neverthrow';
import { NetworkError } from '../errors';
import { CLOUD_URL } from '../routes';
import type { Fetch } from '../types';
import { FetchBuilder, mapResponse } from './common';

export function getLibraries(fetch: Fetch, username: string) {
  const endpoint = `${CLOUD_URL}/libraries/user/${username}/`;
  const { url, opt } = FetchBuilder.to(endpoint);
  const result = fromPromise(fetch(url, opt), () => NetworkError())
    .andThen((rsp) => mapResponse(rsp, {parse: 'json'}))
    .map((json) => json as LibraryMetadata[]);
  return result;
}

export function deleteLibrary(fetch: Fetch, username: string, libname: string) {
  const endpoint = `${CLOUD_URL}/libraries/user/${username}/${libname}`;
  const { url, opt } = FetchBuilder.to(endpoint).method('DELETE');
  const result = fromPromise(fetch(url, opt), () => NetworkError())
    .andThen((rsp) => mapResponse(rsp, {parse: 'json'}))
    .map((json) => json as LibraryMetadata);
  return result;
}

export function createLibrary(
  fetch: Fetch,
  username: string,
  data: CreateLibraryData,
) {
  const endpoint = `${CLOUD_URL}/libraries/user/${username}/`;
  const { url, opt } = FetchBuilder.to(endpoint).payload(data).method('POST');
  const result = fromPromise(fetch(url, opt), () => NetworkError())
    .andThen((rsp) => mapResponse(rsp, {parse: 'json'}))
    .map((json) => json as LibraryMetadata);
  return result;
}
