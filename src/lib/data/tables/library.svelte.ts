import type { ErrorContext } from '$lib/contexts/ErrorContext.svelte';
import type { ConstructParams, Deleteable } from '$lib/utils/tables';

import type { HasEntries, Searchable, TableEntry } from '$lib/utils/tables';
import type { StringKey } from '$lib/utils/types';
import type { CreateLibraryData } from 'netsblox-cloud-client/src/types/CreateLibraryData';
import type { LibraryMetadata } from 'netsblox-cloud-client/src/types/LibraryMetadata';

import { createLibrary, deleteLibrary } from '$lib/utils/api/libraries';
import { DashboardError } from '$lib/utils/errors';
import u from '$lib/utils/tables';
import { watch } from 'runed';

export class LibraryTable
  implements
    HasEntries<LibraryMetadata>,
    Searchable<LibraryMetadata>,
    Deleteable<LibraryMetadata>
{
  owner: string;
  entries: TableEntry<LibraryMetadata>[];
  toaster: ErrorContext;
  keys: (keyof LibraryMetadata)[];
  searchKey: StringKey<LibraryMetadata>;
  search: string;
  refresh: () => void;

  constructor(params: ConstructParams<LibraryTable, LibraryMetadata>) {
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

  deletor = (v: LibraryMetadata) => deleteLibrary(fetch, this.owner, v.name);

  deleteSelected() {
    const DeletionFailed = DashboardError.create(
      'Failed to delete selected libraries.',
    );
    const result = u
      .deleteEntries(this, this.deletor)
      .andTee((_libs) => this.refresh())
      .orTee((_error) => {
        DeletionFailed.toast(this.toaster);
        this.refresh();
      });
    return result;
  }

  createLibrary(data: CreateLibraryData) {
    const result = createLibrary(fetch, this.owner, data)
      .orTee((e) => e.prepend('Failed to create library: ').toast(this.toaster))
      .andTee(() => this.refresh());
    return result;
  }
}
