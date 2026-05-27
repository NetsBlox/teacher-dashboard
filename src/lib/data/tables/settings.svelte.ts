import type { ConstructParams, Deleteable } from '$lib/utils/tables';

import type { HasEntries, Searchable, TableEntry } from '$lib/utils/tables';
import type { FlatServiceSetting, StringKey } from '$lib/utils/types';
import type { ErrorContext } from '../../contexts/ErrorContext.svelte';

import { createUserSetting, deleteUserSetting } from '$lib/utils/api/services';
import { DashboardError } from '$lib/utils/errors';
import u from '$lib/utils/tables';
import { watch } from 'runed';

export class SettingsTable
  implements
    HasEntries<FlatServiceSetting>,
    Searchable<FlatServiceSetting>,
    Deleteable<FlatServiceSetting, Response>
{
  owner: string;
  entries: TableEntry<FlatServiceSetting>[];
  toaster: ErrorContext;
  keys: (keyof FlatServiceSetting)[];
  searchKey: StringKey<FlatServiceSetting>;
  search: string;
  refresh: () => void;

  constructor(params: ConstructParams<SettingsTable, FlatServiceSetting>) {
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

  deletor = (v: FlatServiceSetting) => deleteUserSetting(fetch, this.owner, v);

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
    const result = createUserSetting(fetch, this.owner, data)
      .orTee((e) => e.prepend('failed to create setting: ').toast(this.toaster))
      .andTee(() => this.refresh());
    return result;
  }
}
