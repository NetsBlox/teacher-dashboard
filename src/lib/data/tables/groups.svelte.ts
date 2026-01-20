import type { ConstructParams, Deleteable } from '$lib/utils/tables';

import type { HasEntries, Searchable, TableEntry } from '$lib/utils/tables';
import type { StringKey } from '$lib/utils/types';
import type { CreateGroupData } from 'netsblox-cloud-client/src/types/CreateGroupData';
import type { Group } from 'netsblox-cloud-client/src/types/Group';
import type { ErrorContext } from '../../contexts/ErrorContext.svelte';

import { goto } from '$app/navigation';
import { createGroup, deleteGroup } from '$lib/utils/api/groups';
import { DashboardError } from '$lib/utils/errors';
import u from '$lib/utils/tables';
import { watch } from 'runed';

export class GroupTable
  implements HasEntries<Group>, Searchable<Group>, Deleteable<Group>
{
  owner: string;
  entries: TableEntry<Group>[];
  toaster: ErrorContext;
  keys: (keyof Group)[];
  searchKey: StringKey<Group>;
  search: string;
  refresh: () => void;

  constructor(params: ConstructParams<GroupTable, Group>) {
    this.search = $state('');
    this.owner = params.owner;
    this.keys = params.keys;
    this.searchKey = params.searchKey;
    this.toaster = params.toaster;
    this.refresh = params.refresher;
    this.entries = $state(u.initEntries(params.values, this.createActions));
    watch(
      () => this.search,
      () => u.filter(this),
    );
  }

  deletor = (v: Group) => deleteGroup(fetch, v.id);

  deleteSelected() {
    const DeletionFailed = DashboardError.create(
      'Failed to delete some groups.',
    );
    const result = u
      .deleteEntries(this, this.deletor)
      .andTee(() => this.refresh())
      .orTee(() => {
        this.refresh();
        DeletionFailed.toast(this.toaster);
      });

    return result;
  }

  createGroup(data: CreateGroupData) {
    const result = createGroup(fetch, this.owner, data)
      .orTee((e) => e.prepend('failed to create group: ').toast(this.toaster))
      .andTee(() => this.refresh());
    return result;
  }

  private createActions = (value: Group) => {
    const View = () => void goto('/groups/' + value.id + '/')
    View.title = "View";
    return [View];
  };
}
