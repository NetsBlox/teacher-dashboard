import type { RoleData } from 'netsblox-cloud-client/src/types/RoleData';
import type { NetsbloxTime, PartialCreateProjectData } from './types';
import { ErrorSetContext } from '$lib/contexts/Contexts.svelte';

export class DataFileError extends Error {
  constructor(filename: string, inner: Error) {
    const msg = `${inner.message} (${filename})`;
    super(msg);
  }
}

export class NoFileContentsError extends Error {
  constructor() {
    super('Unable to read file.');
  }
}

export function toError(err: unknown): Error {
  if (err instanceof Error) return err;
  else return Error(err?.toString());
}

export async function parseCreateUserCSV(file: File): Promise<string[][]> {
  const headers = ['username', 'email', 'password']
  if(file.type !== 'text/csv') throw new Error('File must be a CSV')
  const array = (await file.text()).split('\n').map((row) => row.split(',')).slice(0, -1);
  if(array[0].length !== 3) throw new Error('Headers (username, email, password) missing')
  if(array[0].some((item, i) => item !== headers[i])) throw new Error('Headers (username, email, password) missing')
  array.forEach((arr, i) => {if(arr.length !== 3) throw new Error(`CSV malformed at row: ${i}`) })
  return array.slice(1)
}


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

export async function readFile(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.readAsText(file, 'utf-8');
    reader.onload = (evt) => {
      if (evt.target) {
        res(evt.target.result as string);
      } else {
        rej(new NoFileContentsError());
      }
    };
  });
}

export async function parseProject(xml: string): Promise<PartialCreateProjectData> {
  const parser = new DOMParser();
  const res = parser.parseFromString(xml, 'application/xml');
  if (res.querySelector('parsererror') !== null) {
    const err = Error('Failed to parse project');
    ErrorSetContext.push(err)
    throw err
  }

  const room = res.documentElement;
  const name = room.getAttribute('name');
  if (!name) {
    const err = Error('Failed to parse name from project file');
    ErrorSetContext.push(err)
    throw err
  }

  const rolePs = Array.from(room.children).map(parseRole);
  const roles = await Promise.all(rolePs);

  return { name, roles };
}

export async function parseRole(el: Element): Promise<RoleData> {
  const name = el.getAttribute('name');
  if (!name) {
    const err = Error('Failed to parse role name');
    ErrorSetContext.push(err)
    throw err
  }
  const code = el.querySelector('role > project')?.outerHTML;
  if (!code) {
    const err = Error('Failed to parse code from role');
    ErrorSetContext.push(err)
    throw err
  }
  const media = el.querySelector('role > media')?.outerHTML;
  if (!media) {
    const err = Error('Failed to parse media from role');
    ErrorSetContext.push(err)
    throw err
  } 
  return { name, code, media };
}
