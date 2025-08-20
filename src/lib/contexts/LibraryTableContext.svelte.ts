import { invalidate } from '$app/navigation';
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
import type { LibraryMetadata } from 'netsblox-cloud-client/src/types/LibraryMetadata';
import type { ErrorContext } from './ErrorContext.svelte';
import type { CreateLibraryData } from 'netsblox-cloud-client/src/types/CreateLibraryData';


type TableType = HasEntries<LibraryMetadata> &
  Searchable<LibraryMetadata> &
  Deleteable;

export class LibraryTableContext implements TableType {
  owner: string;
  entries: TableEntry<LibraryMetadata>[] = $state([]);

  toaster: ErrorContext;

  keys: (keyof LibraryMetadata)[];
  searchKey: StringKey<LibraryMetadata>;
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
    libraries: LibraryMetadata[],
    keys: (keyof LibraryMetadata)[],
    searchKey: StringKey<LibraryMetadata>,
    toaster: ErrorContext,
  ) {
    this.owner = owner;
    this.entries = utils.initEntries(libraries);
    this.keys = keys;
    this.searchKey = searchKey;
    this.toaster = toaster;
  }

  filter() {
    utils.filter(this);
  }

  async refresh() {
    try {
      await invalidate(CLOUD_URL + '/libraries/user/' + this.owner + '/');
      const libraries = await api.listUserLibraries(this.owner);
      this.entries = utils.initEntries(libraries);
    } catch (_e) {
      DashboardError.create('Failed to refresh entries').toast(this.toaster);
    }
  }

  async deleteSelected() {
    const promises: Promise<LibraryMetadata>[] = [];
    this.entries.forEach((entry) => {
      if (entry.selected && entry.visible) {
        promises.push(api.deleteUserLibrary(this.owner, entry.value.name));
      }
    });
    try {
      await Promise.all(promises);
      await this.refresh();
    } catch (_e) {
      DashboardError.create('Error deleting libraries.').toast(this.toaster);
    }
  }

  async createLibrary(data: CreateLibraryData) {
    try {
      await api.saveUserLibrary(this.owner, data);
      await this.refresh();
    } catch (_e) {
      DashboardError.create('Failed to create library.').toast(this.toaster);
    }
  }
}

const key = Symbol('LibraryTable');

export function setLibraryTableContext(value: LibraryTableContext) {
  setContext(key, value);
}

export function getLibraryTableContext() {
  return getContext<LibraryTableContext>(key);
}
