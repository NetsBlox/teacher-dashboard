import type { RoleData } from 'netsblox-cloud-client/src/types/RoleData';
import type { ServiceHostId } from 'netsblox-cloud-client/src/types/ServiceHostId';
import type { ServiceName } from 'netsblox-cloud-client/src/types/ServiceName';
import type { SettingName } from 'netsblox-cloud-client/src/types/SettingName';
import type { SettingValue } from 'netsblox-cloud-client/src/types/SettingValue';
import type { SettingVisiblity } from 'netsblox-cloud-client/src/types/SettingVisiblity';

export type FlatServiceSetting = {
    host: ServiceHostId;
    service: ServiceName;
    name: SettingName;
    value: string;
    visibility: SettingVisiblity
};

export type Fetch = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

export type NetsbloxTime = {
  secs_since_epoch: number;
  nanos_since_epoch: number;
};

export type PartialCreateProjectData = {
  name: string;
  roles: RoleData[];
};

export type StringKey<T> = {
  [K in keyof T]: T[K] extends String ? K : never;
}[keyof T];

export type UpTo<
  Max extends number,
  Tuple extends number[] = [],
> = Max extends Tuple['length']
  ? Tuple['length']
  : UpTo<Max, [...Tuple, Tuple['length']]>;

export type Range<Min extends number, Max extends number> = Exclude<
  UpTo<Max>,
  UpTo<Min>
>;
