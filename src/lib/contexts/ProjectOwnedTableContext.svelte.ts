import { invalidate } from '$app/navigation';
import api from '$lib/utils/api';
import { CLOUD_URL } from '$lib/utils/routes';
import { getContext, setContext } from 'svelte';

import type { StringKey, TableErrors, TableFns } from '$lib/utils/types';
import type { CreateProjectData } from 'netsblox-cloud-client/src/types/CreateProjectData';
import type { ProjectMetadata } from 'netsblox-cloud-client/src/types/ProjectMetadata';
import { GenericTableContext } from './GenericTableContext.svelte';
import { errorSetContext } from './ErrorDialogContext.svelte';

const Fns: TableFns<ProjectMetadata, CreateProjectData, string> = {
  createFn: (data, owner) => api.createProject({owner: owner, ...data}),
  readFn: (owner) => api.listUserProjects(owner),
  deleteFn: (entry) => api.deleteProject(entry.id),
  invalidateFn: (owner) =>
    invalidate(CLOUD_URL + '/projects/user/' + owner),
};

const errors: TableErrors = {createErr: Error("Failed to import project"),
                             readErr: Error("Failed to refresh projects list"),
                             deleteErr: Error("Failed to delete project")}

export class ProjectOwnedTableContext extends GenericTableContext<
  ProjectMetadata,
  CreateProjectData,
  string
> {
  constructor(
    owner: string,
    groups: ProjectMetadata[],
    keys: (keyof ProjectMetadata)[],
    searchKey: StringKey<ProjectMetadata>,
  ) {
    super(Fns, errors, errorSetContext, owner, groups, keys, searchKey);
  }
}

const key = Symbol('ProjectTable');

export function setProjectTableContext(value: ProjectOwnedTableContext) {
  setContext(key, value);
}

export function getProjectTableContext() {
  return getContext<ProjectOwnedTableContext>(key);
}
