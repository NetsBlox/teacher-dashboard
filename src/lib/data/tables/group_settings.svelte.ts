import type { ConstructParams, Deleteable } from '$lib/utils/tables';

import type { HasEntries, Searchable, TableEntry } from '$lib/utils/tables';
import type { FlatServiceSetting, StringKey } from '$lib/utils/types';
import type { ErrorContext } from '../../contexts/ErrorContext.svelte';
import type { GroupId } from 'netsblox-cloud-client/src/types/GroupId';

import { DashboardError } from '$lib/utils/errors';
import u from '$lib/utils/tables';
import { watch } from 'runed';
import { createGroupSetting, deleteGroupSetting } from '$lib/utils/api/services';

export class GroupSettingsTable
  implements
    HasEntries<FlatServiceSetting>,
    Searchable<FlatServiceSetting>,
    Deleteable<FlatServiceSetting, Response>
{
  owner: GroupId;
  entries: TableEntry<FlatServiceSetting>[];
  toaster: ErrorContext;
  keys: (keyof FlatServiceSetting)[];
  searchKey: StringKey<FlatServiceSetting>;
  search: string;
  refresh: () => void;

  constructor(params: ConstructParams<GroupSettingsTable, FlatServiceSetting>) {
    this.search = $state('');
    this.owner = params.owner;
    this.keys = params.keys;
    this.searchKey = params.searchKey;
    this.toaster = params.toaster;
    this.refresh = params.refresher;
    this.entries = $state(u.initEntries(params.values));
    watch(
      () => this.search,
      () => u.filter(this),
    );
  }

  deletor = (v: FlatServiceSetting) => deleteGroupSetting(fetch, this.owner, v);

  deleteSelected() {
    const DeletionFailed = DashboardError.create(
      'Failed to delete some settings.',
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

  createSetting(data: FlatServiceSetting) {
    const result = createGroupSetting(fetch, this.owner, data)
      .orTee((e) => e.prepend('failed to create setting: ').toast(this.toaster))
      .andTee(() => this.refresh());
    return result;
  }
}
