import { goto, invalidate } from '$app/navigation';
import api from '$lib/utils/api';
import { CLOUD_URL } from '$lib/utils/routes';
import { getContext, setContext } from 'svelte';

import { DashboardError } from '$lib/utils/errors';
import type {
  Deleteable,
  HasEntries,
  Searchable,
  TableEntry,
} from '$lib/utils/tables.svelte';
import utils from '$lib/utils/tables.svelte';
import type { StringKey } from '$lib/utils/types';
import type { CreateGroupData } from 'netsblox-cloud-client/src/types/CreateGroupData';
import type { Group } from 'netsblox-cloud-client/src/types/Group';
import type { ErrorContext } from './ErrorContext.svelte';

type TableType = HasEntries<Group> & Searchable<Group> & Deleteable;

export class GroupTableContext implements TableType {
  owner: string;
  entries: TableEntry<Group>[] = $state([]);

  toaster: ErrorContext;

  keys: (keyof Group)[];
  searchKey: StringKey<Group>;
  private _search: string = $state('');
  get search() {
    return this._search;
  }
  set search(value: string) {
    this._search = value;
    this.filter();
  }

  constructor(
    owner: string,
    groups: Group[],
    keys: (keyof Group)[],
    searchKey: StringKey<Group>,
    toaster: ErrorContext,
  ) {
    this.owner = owner;
    this.entries = utils.initEntries(groups, this.createActions);
    this.keys = keys;
    this.searchKey = searchKey;
    this.toaster = toaster;
  }

  filter() {
    utils.filter(this);
  }

  async refresh() {
    try {
      await invalidate(CLOUD_URL + '/groups/user/' + this.owner + '/');
      const groups = await api.listGroups(this.owner);
      this.entries = utils.initEntries(groups, this.createActions);
    } catch (_e) {
      DashboardError.create('Failed to refresh entries').toast(this.toaster);
    }
  }

  async deleteSelected() {
    const promises: Promise<Group>[] = [];
    this.entries.forEach((entry) => {
      if (entry.selected && entry.visible) {
        promises.push(api.deleteGroup(entry.value.id));
      }
    });
    try {
      await Promise.all(promises);
      await this.refresh();
    } catch (_e) {
      DashboardError.create('Failed to delete all groups.').toast(this.toaster);
    }
  }

  async createGroup(data: CreateGroupData) {
    try {
      await api.createGroup(this.owner, data);
      await this.refresh();
    } catch (_e) {
      DashboardError.create('Failed to create group.').toast(this.toaster);
    }
  }

  private createActions = (value: Group) => {
    const View = () => {goto('/groups/' + value.id + '/')};
    Object.defineProperty(View, "name", {value: "View"})
    return [View];
  };
}

const key = Symbol('GroupTable');

export function setGroupTableContext(value: GroupTableContext) {
  setContext(key, value);
}

export function getGroupTableContext() {
  return getContext<GroupTableContext>(key);
}
