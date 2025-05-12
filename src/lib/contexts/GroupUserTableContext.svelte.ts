import { goto, invalidate } from '$app/navigation';
import api from '$lib/utils/api';
import { CLOUD_URL } from '$lib/utils/routes';
import type {
  StringKey,
  TableEntryAction,
  TableErrors,
  TableFns,
} from '$lib/utils/types';
import type { GroupId } from 'netsblox-cloud-client/src/types/GroupId';
import type { NewUser } from 'netsblox-cloud-client/src/types/NewUser';
import type { User } from 'netsblox-cloud-client/src/types/User';
import { getContext, setContext } from 'svelte';
import { ErrorSetContext } from './Contexts.svelte';
import { GenericTableContext } from './GenericTableContext.svelte';

export type BatchData = {
  prefix: string;
  batchNumber: number;
  email: string;
};

const Fns: TableFns<User, NewUser, GroupId> = {
  createFn: (data, groupId) => {
    data.groupId = groupId;
    return api.createUser(data);
  },
  readFn: (groupId) => api.listMembers(groupId),
  deleteFn: (entry) => api.deleteUser(entry.username),
  invalidateFn: (groupId) =>
    invalidate(CLOUD_URL + '/groups/id/' + groupId + '/members'),
};

const actions: TableEntryAction<User, GroupId>[] = [
  function view(entry) {
    goto('/users/' + entry.value.username + '/');
  },
];

const errors: TableErrors = {
  createErr: Error('Failed to create user'),
  readErr: Error('Failed to refresh user list'),
  deleteErr: Error('Failed to delete user'),
};

export class GroupUserTableContext extends GenericTableContext<
  User,
  NewUser,
  GroupId
> {
  actions = actions;
  constructor(
    groupId: string,
    users: User[],
    keys: (keyof User)[],
    searchKey: StringKey<User>,
  ) {
    super(Fns, errors, ErrorSetContext, groupId, users, keys, searchKey);
  }

  async batchCreateEntry(data: BatchData) {
    type logEntry = { username: string; password: string };
    const log: logEntry[] = [];
    const errors: Error[] = [];
    const numbers = new Array(data.batchNumber).keys();
    const promises = numbers.map(async (number) => {
      const username = data.prefix + String(number).padStart(4, '0');
      const password = Math.random().toString(36).slice(-8);
      const userData: NewUser = { username, email: data.email, password };
      await this.createEntry(userData); // GroupId is added internally
      return { username, password };
    });
    for (const promise of promises) {
      try {
        log.push(await promise);
      } catch (err) {
        if (err instanceof Error) errors.push(err);
      }
    }

    if (errors.length > 0)
      ErrorSetContext.push(
        new Error(`Failed to create ${errors.length} user(s)`),
      );

    const initData = 'data:text/csv;charset=utf-8,username,password\n';
    const exportData = log.reduce((exportData, log) => {
      exportData += `${log.username},${log.password}\n`;
      return exportData;
    }, initData);

    return { log, exportData };
  }

  async createFromCSV(file: File) {
    let csv = (await file.text()).split('\n').map((row) => row.split(','));
    const promises = csv.map(async ([username, email, password]) => {
      if (username && email && password) {
        const userData: NewUser = { username, email, password };
        await this.createEntry(userData); // GroupId is added internally
      }
    });
    const errors: Error[] = [];
    for (const promise of promises) {
      try {
        await promise;
      } catch (err) {
        if (err instanceof Error) errors.push(err);
      }
    }
    if (errors.length > 0)
      ErrorSetContext.push(
        new Error(`Failed to create ${errors.length} user(s)`),
      );
  }
}
const key = Symbol('GroupUserContext');

export function setGroupUserTableContext(value: GroupUserTableContext) {
  setContext(key, value);
}

export function getGroupUserTableContext() {
  return getContext<GroupUserTableContext>(key);
}
