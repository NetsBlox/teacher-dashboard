import type { RoleData } from 'netsblox-cloud-client/src/types/RoleData';
import { DashboardError } from './errors';
import type { NetsbloxTime, PartialCreateProjectData } from './types';

/**
Create a time object format that the cloud expects. 
@param time must be Sanitized to be \d\d:\d\d string
**/
export function createNetsbloxTime(date: Date, time: string): NetsbloxTime {
  if (!RegExp(/\d{2}:\d{2}/).test(time)) {
    throw new Error('time parameter not of format \d\d:\d\d');
  }

  const [hour, minute] = time.split(':').map((str) => Number.parseInt(str));
  const second = 59;
  date.setHours(hour);
  date.setMinutes(minute);
  date.setSeconds(second);
  return {
    secs_since_epoch: Math.floor(date.getTime() / 1000),
    nanos_since_epoch: (date.getTime() % 1000) * 1000000,
  };
}

export async function parseProject(
  xml: string,
): Promise<PartialCreateProjectData> {
  const parser = new DOMParser();
  const res = parser.parseFromString(xml, 'application/xml');
  if (res.querySelector('parsererror') !== null) {
    throw DashboardError.create('Failed to parse project.');
  }

  const room = res.documentElement;
  let name = room.getAttribute('name');
  if (!name) {
    throw DashboardError.create('Failed to parse project name.');
  }
  const rolePs = Array.from(room.children).map(parseRole);
  const roles = await Promise.all(rolePs);

  return { name, roles };
}

export async function parseRole(el: Element): Promise<RoleData> {
  const name = el.getAttribute('name');
  if (!name) {
    throw DashboardError.create('Failed to parse role name');
  }
  const code = el.querySelector('role > project')?.outerHTML;
  if (!code) {
    throw DashboardError.create('Failed to parse code from role');
  }
  const media = el.querySelector('role > media')?.outerHTML;
  if (!media) {
    throw DashboardError.create('Failed to parse media from role');
  }
  return { name, code, media };
}
