import type { RoleData } from "netsblox-cloud-client/src/types/RoleData";

export type Fetch = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

export type NetsbloxTime = {
  secs_since_epoch: number;
  nanos_since_epoch: number;
};

export type PartialCreateProjectData = {
  name: string
  roles: RoleData[]
}

export type StringKey<T> = {
  [K in keyof T]: T[K] extends String ? K : never;
}[keyof T];

