import { invalidate } from '$app/navigation';
import api from '$lib/utils/api';
import { BROWSER_URL, CLOUD_URL } from '$lib/utils/routes';
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
import type { CreateProjectData } from 'netsblox-cloud-client/src/types/CreateProjectData';
import type { ProjectMetadata } from 'netsblox-cloud-client/src/types/ProjectMetadata';
import type { ErrorContext } from './ErrorContext.svelte';

type TableType = HasEntries<ProjectMetadata> &
  Searchable<ProjectMetadata> &
  Deleteable;

export class OwnedProjectTableContext implements TableType {
  owner: string;
  entries: TableEntry<ProjectMetadata>[] = $state([]);

  toaster: ErrorContext;

  keys: (keyof ProjectMetadata)[];
  searchKey: StringKey<ProjectMetadata>;
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

  filter() {
    utils.filter(this);
  }

  async refresh() {
    try {
      await invalidate(CLOUD_URL + '/projects/user/' + this.owner);
      const projects = await api.listUserProjects(this.owner);
      this.entries = utils.initEntries(projects, this.createActions);
    } catch (_e) {
      DashboardError.create('Failed to refresh entries').toast(
        this.toaster,
      );
    }
  }

  async deleteSelected() {
    const promises: Promise<ProjectMetadata>[] = [];
    this.entries.forEach((entry) => {
      if (entry.selected && entry.visible) {
        promises.push(api.deleteProject(entry.value.id));
      }
    });
    try {
      await Promise.all(promises);
      await this.refresh();
    } catch (_e) {
      DashboardError.create('Failed to delete all projects.').toast(
        this.toaster,
      );
    }
  }

  async createProject(data: CreateProjectData) {
    try {
      await api.createProject({ ...data, saveState: 'Saved' });
      await this.refresh();
    } catch (_e) {
      DashboardError.create('Failed to create project.').toast(
        this.toaster,
      );
    }
  }

  private createActions = (value: ProjectMetadata) => {
    const url = `${BROWSER_URL}/?action=present&Username=${encodeURIComponent(this.owner)}&ProjectName=${encodeURIComponent(value.name)}`;
    const Open = function () {void window.open(url)};
    Object.defineProperty(Open, "name", {value: "Open"})
    return [Open];
  };
}

const key = Symbol('OwnedProjectTable');

export function setOwnedProjectTableContext(value: OwnedProjectTableContext) {
  setContext(key, value);
}

export function getOwnedProjectTableContext() {
  return getContext<OwnedProjectTableContext>(key);
}
