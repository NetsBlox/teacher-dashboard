import { goto, invalidate } from '$app/navigation';
import api from '$lib/utils/api';
import { CLOUD_URL } from '$lib/utils/routes';
import type { StringKey, TableEntryAction, TableFns } from '$lib/utils/types';
import type { CreateGroupData } from 'netsblox-cloud-client/src/types/CreateGroupData';
import type { Group } from 'netsblox-cloud-client/src/types/Group';
import { getContext, setContext } from 'svelte';
import { GenericTableContext } from './GenericTableContext.svelte';

const Fns: TableFns<Group, CreateGroupData> = {
  createFn: (data, owner) => api.createGroup(owner, data),
  readFn: (owner) => api.listGroups(owner),
  deleteFn: (entry) => api.deleteGroup(entry.id),
  invalidateFn: (owner) =>
    invalidate(CLOUD_URL + '/groups/user/' + owner + '/'),
};

const actions: TableEntryAction<Group>[] = [
  function view(entry) {
    goto('/groups/' + entry.value.id + '/');
  },
];

export class GroupTableContext extends GenericTableContext<
  Group,
  CreateGroupData
> {
  actions = actions;
  constructor(
    owner: string,
    groups: Group[],
    keys: (keyof Group)[],
    searchKey: StringKey<Group>,
  ) {
    super(Fns, owner, groups, keys, searchKey);
  }
}
const key = Symbol('GroupTable');

export function setGroupTableContext(value: GroupTableContext) {
  setContext(key, value);
}

export function getGroupTableContext() {
  return getContext<GroupTableContext>(key);
}
