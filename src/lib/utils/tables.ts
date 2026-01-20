import type { ErrorContext } from '$lib/contexts/ErrorContext.svelte';
import type { StringKey } from '$lib/utils/types';
import { ResultAsync } from 'neverthrow';
import { DashboardError } from './errors';

export type Action = (() => void) & { title: string };

export type TableEntry<T> = {
  selected: boolean;
  value: T;
  visible: boolean;
  expanded: boolean;
  editing: boolean;
  actions?: Action[];
};

export type ActionMaker<T> = (value: T) => Action[];

export interface HasEntries<T> {
  entries: TableEntry<T>[];
}

export interface Deleteable<T> {
  deletor: (v: T) => ResultAsync<T, DashboardError>;
  deleteSelected: () => ResultAsync<T[], DashboardError>;
}

export interface Refreshable {
  refresh: () => void;
}

export interface Searchable<T> {
  searchKey: StringKey<T>;
  search: string;
}

export interface Searchable<T> {
  searchKey: StringKey<T>;
  search: string;
}

export interface HasKeys<T> {
  keys: (keyof T)[];
}

export type OwnerType<T> = {
  [K in keyof T]: K extends 'owner' ? T[K] : never;
}[keyof T];

export type ConstructParams<Class, T> = {
  owner: OwnerType<Class>;
  values: Class extends HasEntries<T> ? T[] : never;
  keys: Class extends HasKeys<T> ? (keyof T)[] : never;
  searchKey: Class extends Searchable<T> ? StringKey<T> : never;
  toaster: ErrorContext;
  refresher: () => void;
};

export function initEntries<T>(
  values: T[],
  actionMaker?: ActionMaker<T>,
): TableEntry<T>[] {
  return values.map((value) => ({
    selected: false,
    value: value,
    visible: true,
    expanded: false,
    editing: false,
    actions: actionMaker?.(value),
  }));
}

export function filter<T>(table: HasEntries<T> & Searchable<T>) {
  table.entries.forEach((entry) => {
    entry.visible = (entry.value[table.searchKey] as string)
      .toLowerCase()
      .includes(table.search.toLowerCase());
  });
}

export function deleteEntries<T>(
  table: HasEntries<T>,
  deletor: (v: T) => ResultAsync<T, DashboardError>,
) {
  const results = table.entries.flatMap((entry) => {
    if (entry.selected && entry.visible) {
      return deletor(entry.value);
    } else return [];
  });

  return ResultAsync.combine(results);
}

type URI = string;
type Cell = string | number;

export class CSV {
  uri: URI;
  constructor(uri: URI) {
    this.uri = encodeURI(uri);
  }
  download(filename: string) {
    const link = document.createElement('a');
    link.href = this.uri;
    link.download = filename;
    link.click();
  }
}

function isInvalidCell(cell: Cell): boolean {
  const Regex = /[,;"'\r\n\t]/;
  if (typeof cell !== 'string') {
    return true;
  }
  const isInvalid = Regex.test(cell);
  return isInvalid;
}

export class CSVBuilder {
  uri: string = 'data:text/csv;charset=utf-8,';

  static new() {
    return new CSVBuilder();
  }

  addRow(...args: Cell[]) {
    const illegal = args
      .map((cell) => isInvalidCell(cell))
      .some((value) => value);
    if (illegal) {
      throw DashboardError.create('CSV row contained illegal characters.');
    }
    const formatted = args.toString().concat('\r\n');

    this.uri = this.uri.concat(formatted);
    return this;
  }

  build() {
    return new CSV(this.uri);
  }
}

export default { filter, initEntries, CSVBuilder, deleteEntries };
