export type NetsbloxTime = {
  secs_since_epoch: number;
  nanos_since_epoch: number;
};

export type ProjectObj = {
  room: {
    "@_name": string
    role: Array<Object> | {role: Object}
  }
} & Record<string, unknown >

export type StringKey<T> = {
  [K in keyof T]: T[K] extends String ? K : never;
}[keyof T];

export type TableEntry<T> = {
  selected: boolean;
  value: T;
  visible: boolean;
  expand: boolean;
};

export type TableEntryAction<T, TOwner> = (entry: TableEntry<T>, owner: TOwner) => void;

export interface TableFns<T, CreateT, TOwner> {
  createFn: (data: CreateT, owner: TOwner) => Promise<T>;
  readFn: (owner: TOwner) => Promise<T[]>;
  deleteFn: (entry: T, owner: TOwner) => Promise<T>;
  invalidateFn: (owner: TOwner) => Promise<void>;
}

export interface TableContext<T, CreateT, TOwner> {
  createOpen: boolean;
  editOpen: boolean;
  deleteOpen: boolean;

  owner: TOwner
  entries: TableEntry<T>[];
  keys: (keyof T)[];

  actions?: TableEntryAction<T, TOwner>[];

  refreshEntries: () => void;
  deleteSelected: () => void;
  createEntry: (data: CreateT) => void;
}
