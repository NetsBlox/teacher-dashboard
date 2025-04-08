import { goto, invalidate } from '$app/navigation';
import api from '$lib/utils/api';
import { CLOUD_URL } from '$lib/utils/routes';
import type { StringKey, TableEntryAction, TableFns } from '$lib/utils/types';
import type { NewUser } from 'netsblox-cloud-client/src/types/NewUser';
import type { User } from 'netsblox-cloud-client/src/types/User';
import { getContext, setContext } from 'svelte';
import { GenericTableContext } from './GenericTableContext.svelte';

export type BatchData = {
  prefix: string;
  batchNumber: number;
  email: string;
};

// NOTE: GroupId is in the generic owner field.
// In the generic, it may be better to rename the owner field to something more 'generic'
const Fns: TableFns<User, NewUser> = {
  createFn: (data, groupId) => {
    data.groupId = groupId;
    return api.createUser(data);
  },
  readFn: (groupId) => api.listMembers(groupId),
  deleteFn: (entry) => api.deleteUser(entry.username),
  invalidateFn: (groupId) =>
    invalidate(CLOUD_URL + '/groups/id/' + groupId + '/members'),
};

const actions: TableEntryAction<User>[] = [
  function view(entry) {
    goto('/users/' + entry.value.username + '/');
  },
];

export class GroupUserTableContext extends GenericTableContext<User, NewUser> {
  actions = actions;
  constructor(
    groupId: string,
    users: User[],
    keys: (keyof User)[],
    searchKey: StringKey<User>,
  ) {
    super(Fns, groupId, users, keys, searchKey);
  }

  async batchCreateEntry(data: BatchData) {
    const numbers = new Array(data.batchNumber).keys();
    const log = await Promise.all(
      numbers.map(async (number) => {
        const username = data.prefix + String(number).padStart(4, '0');
        const password = Math.random().toString(36).slice(-8);
        const userData: NewUser = { username, email: data.email, password };
        // GroupId is added internally
        await this.createEntry(userData);
        return { username, password };
      }),
    );
    const initData = 'data:text/csv;charset=utf-8,username,password\n';
    const exportData = log.reduce((exportData, log) => {
      exportData += `${log.username},${log.password}\n`;
      return exportData;
    }, initData);

    return {log, exportData};
  }

  async createFromCSV(file: File) {
    let csv = (await file.text()).split('\n').map((row) => row.split(','));
    await Promise.all(
      csv.map(async ([username, email, password]) => {
        if (username && email && password) {
          const userData: NewUser = { username, email, password };
          // GroupId is added internally
          await this.createEntry(userData);
        }
      }),
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
