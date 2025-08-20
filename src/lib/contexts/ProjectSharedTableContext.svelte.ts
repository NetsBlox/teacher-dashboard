import api from '$lib/utils/api';
import utils from '$lib/utils/tables.svelte';

import { BROWSER_URL, CLOUD_URL } from '$lib/utils/routes';
import { getContext, setContext } from 'svelte';

import { invalidate } from '$app/navigation';
import { DashboardError } from '$lib/utils/errors';
import type {
  HasEntries,
  Searchable,
  TableEntry,
} from '$lib/utils/tables.svelte';
import type { StringKey } from '$lib/utils/types';
import type { ProjectMetadata } from 'netsblox-cloud-client/src/types/ProjectMetadata';
import type { ErrorContext } from './ErrorContext.svelte';

type TableType = HasEntries<ProjectMetadata> & Searchable<ProjectMetadata>;

export class SharedProjectTableContext implements TableType {
  owner: string;
  entries: TableEntry<ProjectMetadata>[] = $state([]);

  keys: (keyof ProjectMetadata)[];
  searchKey: StringKey<ProjectMetadata>;

  toaster: ErrorContext;

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
    projects: ProjectMetadata[],
    keys: (keyof ProjectMetadata)[],
    searchKey: StringKey<ProjectMetadata>,
    toaster: ErrorContext,
  ) {
    this.owner = owner;
    this.entries = utils.initEntries(projects, this.createActions);
    this.keys = keys;
    this.searchKey = searchKey;
    this.toaster = toaster;
  }

  async refresh() {
    try {
      await invalidate(CLOUD_URL + '/projects/shared/' + this.owner);
      const projects = await api.listSharedProjects(this.owner);
      this.entries = utils.initEntries(projects, this.createActions);
    } catch (_e) {
      DashboardError.create('Failed to refresh entries.').toast(this.toaster);
    }
  }

  filter() {
    utils.filter(this);
  }

  private createActions = (value: ProjectMetadata) => {
    const url = `${BROWSER_URL}/?action=present&Username=${encodeURIComponent(value.owner)}&ProjectName=${encodeURIComponent(value.name)}`;
    const Open = () => void window.open(url);
    Object.defineProperty(Open, "name", {value: "Open"})
    return [Open];
  };
}
const key = Symbol('SharedProjectTable');

export function setProjectSharedTableContext(value: SharedProjectTableContext) {
  setContext(key, value);
}

export function getProjectSharedTableContext() {
  return getContext<SharedProjectTableContext>(key);
}
