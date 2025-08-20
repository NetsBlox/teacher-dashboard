import { goto, invalidate } from '$app/navigation';
import api from '$lib/utils/api';
import { DashboardError } from '$lib/utils/errors';
import { CLOUD_URL } from '$lib/utils/routes';
import type {
  Deleteable,
  HasEntries,
  Searchable,
  TableEntry,
} from '$lib/utils/tables.svelte';
import utils, { CSVBuilder } from '$lib/utils/tables.svelte';
import type { StringKey } from '$lib/utils/types';
import type { Group } from 'netsblox-cloud-client/src/types/Group';
import type { NewUser } from 'netsblox-cloud-client/src/types/NewUser';
import type { User } from 'netsblox-cloud-client/src/types/User';
import { getContext, setContext } from 'svelte';
import type { ErrorContext } from './ErrorContext.svelte';

export type Batch = {
  prefix: string;
  amount: number;
  email: string;
};

type TableType = HasEntries<User> & Searchable<User> & Deleteable;

export class MemberTableContext implements TableType {
  group: Group;
  entries: TableEntry<User>[] = $state([]);

  toaster: ErrorContext;

  keys: (keyof User)[];
  searchKey: StringKey<User>;
  private _search: string = $state('');
  get search() {
    return this._search;
  }
  set search(value: string) {
    this._search = value;
    this.filter();
  }

  constructor(
    group: Group,
    members: User[],
    keys: (keyof User)[],
    searchKey: StringKey<User>,
    toaster: ErrorContext,
  ) {
    this.group = group;
    this.entries = utils.initEntries(members, this.createActions);
    this.keys = keys;
    this.searchKey = searchKey;
    this.toaster = toaster;
  }

  filter() {
    utils.filter(this);
  }

  async refresh() {
    try {
      await invalidate(CLOUD_URL + '/groups/id/' + this.group.id + '/members');
      const members = await api.listMembers(this.group.id);
      this.entries = utils.initEntries(members, this.createActions);
    } catch (_e) {
      DashboardError.create('Failed to refresh entries').toast(this.toaster);
    }
  }

  async deleteSelected() {
    const promises: Promise<User>[] = [];
    this.entries.forEach((entry) => {
      if (entry.selected && entry.visible) {
        promises.push(api.deleteUser(entry.value.username));
      }
    });
    try {
      await Promise.all(promises);
      await this.refresh();
    } catch (_e) {
      DashboardError.create('Failed to delete all users.').toast(this.toaster);
    }
  }

  async createUser(data: NewUser) {
    try {
      await api.createUser({ ...data, groupId: this.group.id });
      await this.refresh();
    } catch (_e) {
      DashboardError.create('Failed to create user.').toast(this.toaster);
    }
  }

  async createUsers({ prefix, amount, email }: Batch) {
    type LogEntry = { username: string; password: string };
    type ErrorEntry = { username: string; msg: string };

    const log: LogEntry[] = [];
    const errors: ErrorEntry[] = [];
    const limit = amount / 2 + 2;
    const groupId = this.group.id;

    const condition = () => log.length < amount && errors.length < limit;
    for (let number = 1; condition(); number++) {
      const username = prefix + String(number).padStart(3, '0');
      const password = Math.random().toString(36).slice(-8);
      const data: NewUser = { username, email, password, groupId };
      const entry: LogEntry = { username, password };
      try {
        await api.createUser(data);
        log.push(entry);
      } catch (error) {
        if (error instanceof Error) {
          errors.push({ username, msg: error.message });
        }
      }
    }

    const builder = CSVBuilder.new().addRow('username', 'password', 'error');

    try {
      log.map(({ username, password }) =>
        builder.addRow(username, password, ''),
      );
      errors.map(({ username, msg }) => builder.addRow(username, '', msg));
    } catch (e) {
      (e as DashboardError).toast(this.toaster);
    }
    if (errors.length > 0) {
      DashboardError.create(
        errors.length + ' failures encountered. Please see CSV file.',
      ).toast(this.toaster);
    }
    this.refresh();
    return builder.build();
  }

  async createUsersFromCSV(file: File) {
    const array = await parseCreateUserCSV(file);
    const groupId = this.group.id;
    const promises = array.map(async ([username, email, password]) => {
      const userData: NewUser = { username, email, password, groupId };
      try {
        await api.createUser(userData);
      } catch (_) {
        return username;
      }
    });
    const failedNames = (await Promise.all(promises)).filter((name) => name);
    if (failedNames.length > 0) {
      let preview = failedNames.slice(0, 3).join(', ');
      if (failedNames.length > 3) {
        preview += ` and ${failedNames.length - 3} more`;
      }
      DashboardError.create("Failed to create " + preview).toast(this.toaster);
    }

    await this.refresh()
  }

  private createActions = (value: User) => {
    const View = () => goto('/users/' + value.username + '/');
    return [View];
  };
}

const key = Symbol('GroupUserContext');

export function setMemberTableContext(value: MemberTableContext) {
  setContext(key, value);
}

export function getMemberTableContext() {
  return getContext<MemberTableContext>(key);
}

export async function parseCreateUserCSV(file: File): Promise<string[][]> {
  const headers = ['username', 'email', 'password'];
  const split_regex = /\n|\r\n|\r/;
  if (file.type !== 'text/csv')
    throw DashboardError.create('File must be a CSV.');
  const array = (await file.text())
    .split(split_regex)
    .map((row) => row.split(','))
    .slice(0, -1);
  if (array[0].length !== 3) {
    throw DashboardError.create('Headers (username, email, password) missing.');
  }
  if (array[0].some((item, i) => item !== headers[i])) {
    throw DashboardError.create('Headers (username, email, password) missing.');
  }
  array.forEach((arr, i) => {
    if (arr.length !== 3)
      throw DashboardError.create(`CSV malformed at row: ${i}.`);
  });
  return array.slice(1);
}
