import type { ErrorContext } from '$lib/contexts/ErrorContext.svelte';
import type { ConstructParams, Deleteable } from '$lib/utils/tables';

import type { HasEntries, Searchable, TableEntry } from '$lib/utils/tables';
import type { StringKey } from '$lib/utils/types';
import type { CreateProjectData } from 'netsblox-cloud-client/src/types/CreateProjectData';
import type { ProjectMetadata } from 'netsblox-cloud-client/src/types/ProjectMetadata';

import { createProject, deleteProject } from '$lib/utils/api/projects';
import { BROWSER_URL } from '$lib/utils/routes';
import u from '$lib/utils/tables';
import { watch } from 'runed';

export class ProjectTable
  implements
    HasEntries<ProjectMetadata>,
    Searchable<ProjectMetadata>,
    Deleteable<ProjectMetadata>
{
  owner: string;
  entries: TableEntry<ProjectMetadata>[];
  toaster: ErrorContext;
  keys: (keyof ProjectMetadata)[];
  searchKey: StringKey<ProjectMetadata>;
  search: string;
  refresh: () => void;

  constructor(params: ConstructParams<ProjectTable, ProjectMetadata>) {
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

  deletor = (project: ProjectMetadata) => deleteProject(fetch, project.id);

  deleteSelected() {
    const result = u
      .deleteEntries(this, this.deletor)
      .andTee((_libs) => this.refresh())
      .orTee((error) => {
        error.prepend('Failed to delete some projects: ').toast(this.toaster);
        this.refresh();
      });
    return result;
  }

  createProject(data: CreateProjectData) {
    const result = createProject(fetch, { ...data, saveState: 'Saved' })
      .orTee((e) => e.prepend('Failed to create project: ').toast(this.toaster))
      .andTee(() => this.refresh());
    return result;
  }

  private createActions = (value: ProjectMetadata) => {
    const url = `${BROWSER_URL}/?action=present&Username=${encodeURIComponent(value.owner)}&ProjectName=${encodeURIComponent(value.name)}`;
    const Open = () => void window.open(url);
    Open.label = 'Open';
    return [Open];
  };
}
