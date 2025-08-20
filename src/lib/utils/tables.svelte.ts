import type { StringKey } from '$lib/utils/types';
import { DashboardError } from './errors';

export type Action = () => void;

export type TableEntry<T> = {
  selected: boolean;
  value: T;
  visible: boolean;
  expand: boolean;
  actions?: Action[];
};

export type ActionMaker<T> = (value: T) => Action[];

export interface HasEntries<T> {
  entries: TableEntry<T>[];
}

export interface Deleteable {
  deleteSelected: () => Promise<void>;
}

export interface Searchable<T> {
  searchKey: StringKey<T>;
  search: string;
  filter: () => void;
}

export interface hasKeys<T> {
  keys: (keyof T)[];
}

export function initEntries<T>(
  values: T[],
  actionMaker?: ActionMaker<T>,
): TableEntry<T>[] {
  return values.map((value) => ({
    selected: false,
    value: value,
    visible: true,
    expand: false,
    actions: actionMaker?.(value),
  }));
}

export function filter<T>(context: HasEntries<T> & Searchable<T>) {
  context.entries.forEach((entry) => {
    entry.visible = (entry.value[context.searchKey] as string)
      .toLowerCase()
      .includes(context.search.toLowerCase());
  });
}

type URI = string;

class CSV {
  uri: URI;

  constructor(uri: URI) {
    this.uri = encodeURI(uri);
  }

  open() {
    window.open(this.uri, 'users_log.csv')
  }
}

type Cell = string | number;

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
      throw DashboardError.create("CSV row contained illegal characters.")      
    }
    const formatted = args.toString().concat('\r\n');

    this.uri = this.uri.concat(formatted);
    return this;
  }

  build() {
    return new CSV(this.uri);
  }
}

export default { filter, initEntries };
