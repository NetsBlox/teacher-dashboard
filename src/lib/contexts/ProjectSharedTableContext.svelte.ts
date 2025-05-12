import { invalidate } from '$app/navigation';
import api from '$lib/utils/api';
import { BROWSER_URL, CLOUD_URL } from '$lib/utils/routes';
import { getContext, setContext } from 'svelte';

import type { StringKey, TableEntryAction, TableErrors, TableFns } from '$lib/utils/types';
import type { CreateProjectData } from 'netsblox-cloud-client/src/types/CreateProjectData';
import type { ProjectMetadata } from 'netsblox-cloud-client/src/types/ProjectMetadata';
import { GenericTableContext } from './GenericTableContext.svelte';
import { ErrorSetContext } from './Contexts.svelte';

const Fns: TableFns<ProjectMetadata, CreateProjectData, string> = {
  createFn: (data, _owner) => api.createProject(data),
  readFn: (owner) => api.listSharedProjects(owner),
  deleteFn: (entry) => api.deleteProject(entry.id),
  invalidateFn: (owner) =>
    invalidate(CLOUD_URL + '/projects/shared/' + owner),
};

const errors: TableErrors = {createErr: Error("Failed to import project"),
                             readErr: Error("Failed to refresh projects list"),
                             deleteErr: Error("Failed to delete project")}

const actions: TableEntryAction<ProjectMetadata, string>[] = [
  function open_project(entry, owner) {
    window.open(
      BROWSER_URL +
        '/?action=present&Username=' +
        encodeURIComponent(entry.value.owner) +
        '&ProjectName=' +
        encodeURIComponent(entry.value.name),
    );
  },
];

export class ProjectSharedTableContext extends GenericTableContext<
  ProjectMetadata,
  CreateProjectData,
  string
> {
  actions=actions
  constructor(
    owner: string,
    projects: ProjectMetadata[],
    keys: (keyof ProjectMetadata)[],
    searchKey: StringKey<ProjectMetadata>,
  ) {
    super(Fns, errors, ErrorSetContext, owner, projects, keys, searchKey);
  }
}

const key = Symbol('CollaborationTable');

export function setProjectSharedTableContext(value: ProjectSharedTableContext) {
  setContext(key, value);
}

export function getProjectSharedTableContext() {
  return getContext<ProjectSharedTableContext>(key);
}
