import { invalidate } from '$app/navigation';
import api from '$lib/utils/api';
import { CLOUD_URL } from '$lib/utils/routes';
import { getContext, setContext } from 'svelte';

import type { StringKey, TableFns } from '$lib/utils/types';
import type { CreateProjectData } from 'netsblox-cloud-client/src/types/CreateProjectData';
import type { ProjectMetadata } from 'netsblox-cloud-client/src/types/ProjectMetadata';
import { GenericTableContext } from './GenericTableContext.svelte';

const Fns: TableFns<ProjectMetadata, CreateProjectData, string> = {
  createFn: (data, _owner) => api.createProject(data),
  readFn: (owner) => api.listSharedProjects(owner),
  deleteFn: (entry) => api.deleteProject(entry.id),
  invalidateFn: (owner) =>
    invalidate(CLOUD_URL + '/projects/shared/' + owner),
};

export class ProjectSharedTableContext extends GenericTableContext<
  ProjectMetadata,
  CreateProjectData,
  string
> {
  constructor(
    owner: string,
    projects: ProjectMetadata[],
    keys: (keyof ProjectMetadata)[],
    searchKey: StringKey<ProjectMetadata>,
  ) {
    super(Fns, owner, projects, keys, searchKey);
  }
}

const key = Symbol('CollaborationTable');

export function setProjectSharedTableContext(value: ProjectSharedTableContext) {
  setContext(key, value);
}

export function getProjectSharedTableContext() {
  return getContext<ProjectSharedTableContext>(key);
}
