import type { Fetch } from '../types';

import type { FlatServiceSetting } from '$lib/utils/types';
import type { AllServiceHostSettings } from 'netsblox-cloud-client/src/types/AllServiceHostSettings';
import type { ServiceHostId } from 'netsblox-cloud-client/src/types/ServiceHostId';
import type { ServiceHostSettings } from 'netsblox-cloud-client/src/types/ServiceHostSettings';

import { fromPromise } from 'neverthrow';
import { NetworkError } from '../errors';
import { CLOUD_URL } from '../routes';
import { FetchBuilder, mapResponse } from './common';
import type { GroupId } from 'netsblox-cloud-client/src/types/GroupId';

function flattenServiceSettings(
  settings: Record<ServiceHostId, ServiceHostSettings>,
): FlatServiceSetting[] {
  const res: FlatServiceSetting[] = [];
  for (const [host, hostSettings] of Object.entries(settings)) {
    for (const [service, serviceSettings] of Object.entries(hostSettings)) {
      for (const [name, value] of Object.entries(serviceSettings)) {
        res.push({ host, service, name, ...value });
      }
    }
  }
  return res;
}

export function getUserSettings(fetch: Fetch, username: string) {
  const { url, opt } = FetchBuilder.to(
    `${CLOUD_URL}/services/settings/user/${username}/all`,
  );
  const result = fromPromise(fetch(url, opt), () => NetworkError())
    .andThen((rsp) => mapResponse(rsp, { parse: 'json' }))
    .map((json) => json as AllServiceHostSettings)
    .map((settings) => flattenServiceSettings(settings.user));
  return result;
}

export function createUserSetting(
  fetch: Fetch,
  username: string,
  data: FlatServiceSetting,
) {
  const payload: ServiceHostSettings = {
    [data.service]: {
      [data.name]: {
        value: data.value,
        visibility: data.visibility,
      },
    },
  };

  const { url, opt } = FetchBuilder.to(
    `${CLOUD_URL}/services/settings/user/${username}/host/${data.host}`,
  )
    .method('PATCH')
    .payload(payload);
  const result = fromPromise(fetch(url, opt), () => NetworkError())
    .andThen((rsp) => mapResponse(rsp))
    .map((_) => _ as never);
  return result;
}

export function deleteUserSetting(
  fetch: Fetch,
  username: string,
  data: FlatServiceSetting,
) {
  const { url, opt } = FetchBuilder.to(
    `${CLOUD_URL}/services/settings/user/${username}/host/${data.host}/service/${data.service}/setting/${data.name}`,
  ).method('DELETE');
  const result = fromPromise(fetch(url, opt), () => NetworkError())
    .andThen((rsp) => mapResponse(rsp))
    .map((_) => _ as never);
  return result;
}

export function getGroupSettings(fetch: Fetch, groupId: GroupId) {
  const { url, opt } = FetchBuilder.to(
    `${CLOUD_URL}/services/settings/group/${groupId}/all`,
  );
  const result = fromPromise(fetch(url, opt), () => NetworkError())
    .andThen((rsp) => mapResponse(rsp, { parse: 'json' }))
    .map((json) => json as Record<ServiceHostId, ServiceHostSettings>)
    .map((settings) => flattenServiceSettings(settings));
  return result;
}

export function createGroupSetting(
  fetch: Fetch,
  groupId: GroupId,
  data: FlatServiceSetting,
) {
  const payload: ServiceHostSettings = {
    [data.service]: {
      [data.name]: {
        value: data.value,
        visibility: data.visibility,
      },
    },
  };

  const { url, opt } = FetchBuilder.to(
    `${CLOUD_URL}/services/settings/group/${groupId}/host/${data.host}`,
  )
    .method('PATCH')
    .payload(payload);
  const result = fromPromise(fetch(url, opt), () => NetworkError())
    .andThen((rsp) => mapResponse(rsp))
    .map((_) => _ as never);
  return result;
}

export function deleteGroupSetting(
  fetch: Fetch,
  groupId: GroupId,
  data: FlatServiceSetting,
) {
  const { url, opt } = FetchBuilder.to(
    `${CLOUD_URL}/services/settings/group/${groupId}/host/${data.host}/service/${data.service}/setting/${data.name}`,
  ).method('DELETE');
  const result = fromPromise(fetch(url, opt), () => NetworkError())
    .andThen((rsp) => mapResponse(rsp))
    .map((_) => _ as never);
  return result;
}
