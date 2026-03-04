import type { RoleData } from 'netsblox-cloud-client/src/types/RoleData';
import { err, errAsync, ok, Result, ResultAsync } from 'neverthrow';
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

export function parseProject(
  xml: string,
): Result<PartialCreateProjectData, DashboardError> {
  const parser = new DOMParser();
  const res = parser.parseFromString(xml, 'application/xml');
  if (res.querySelector('parsererror') !== null) {
    return err(DashboardError.create('Failed to parse project.'));
  }
  const room = res.documentElement;
  let name = room.getAttribute('name');
  if (!name) {
    return err(DashboardError.create('Failed to parse project name.'));
  }
  const result = Result.combine(Array.from(room.children).map(parseRole)).map(
    (roles) => ({ name, roles }),
  );

  return result;
}

export function parseRole(el: Element): Result<RoleData, DashboardError> {
  const name = el.getAttribute('name');
  if (!name) {
    return err(DashboardError.create('Failed to parse role name'));
  }
  const code = el.querySelector('role > project')?.outerHTML;
  if (!code) {
    return err(DashboardError.create('Failed to parse code from ' + name));
  }
  const media = el.querySelector('role > media')?.outerHTML;
  if (!media) {
    return err(DashboardError.create('Failed to parse media from ' + name));
  }
  return ok({ name, code, media });
}

export function parseCSV(file: File, headers: string[]) {
  const split_regex = /\n|\r\n|\r/;

  if (file.type !== 'text/csv')
    return errAsync(DashboardError.create('file is not a csv.'));

  const result = ResultAsync.fromPromise(file.text(), () => null)
    .mapErr(() => DashboardError.create('Failed to extract text from file.'))
    .map((text) => text.split(split_regex))
    .map((rows) => (rows.at(-1) === '' ? rows.slice(0, -1) : rows))
    .map((rows) => rows.map((row) => row.split(',')))
    .andThrough((rows) => {
      if (!arraysEqual(rows[0], headers)) {
        const msg = `Headers (${headers.join(',')}) missing.`;
        return err(DashboardError.create(msg));
      } else return ok(rows);
    })
    .andThrough((rows) => {
      for (const [idx, row] of rows.entries()) {
        if (row.length !== headers.length) {
          return err(DashboardError.create(`CSV malformed at row: ${idx}.`));
        }
      }
      return ok();
    })
    .map((rows) => rows.slice(1));

  return result;
}

export function arraysEqual<T>(ref: T[], ...arrays: T[][]) {
  const lengthsEqual = (array: T[]) => array.length === ref.length;
  const entriesEqual = (array: T[]) =>
    array.every((item, i) => item === ref[i]);

  return arrays.every((array) => lengthsEqual(array) && entriesEqual(array));
}

export function generatePassword() {
  return Math.random().toString(36).slice(-8);
}
