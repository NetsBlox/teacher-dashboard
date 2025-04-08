import type { Snippet } from 'svelte';

export type NetsbloxTime = {
  secs_since_epoch: number;
  nanos_since_epoch: number;
};

export type StringKey<T> = {
  [K in keyof T]: T[K] extends String ? K : never;
}[keyof T];


export type TableEntry<T> = { selected: boolean; value: T; visible: boolean, expand: boolean};

export type TableEntryAction<T> = ((entry: TableEntry<T>) => void);

export interface TableFns<T, CreateT> {
  createFn: (data: CreateT, owner: string) => Promise<T> 
  readFn: (owner: string) => Promise<T[]>;
  deleteFn: (entry: T) => Promise<T>;
  invalidateFn: (owner: string) => Promise<void>;
}


export interface TableContext<T, CreateT> {
  createOpen: boolean
  editOpen: boolean
  deleteOpen: boolean

  entries: TableEntry<T>[];
  keys: (keyof T)[];
 
  actions?: TableEntryAction<T>[];

  refreshEntries: () => void
  deleteSelected: () => void
  createEntry: (data: CreateT) => void
};
