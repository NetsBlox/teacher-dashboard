import { invalidate } from '$app/navigation';
import api from '$lib/utils/api';
import { BROWSER_URL, CLOUD_URL } from '$lib/utils/routes';
import { getContext, setContext } from 'svelte';

import type {
  StringKey,
  TableEntryAction,
  TableErrors,
  TableFns,
} from '$lib/utils/types';
import type { CreateProjectData } from 'netsblox-cloud-client/src/types/CreateProjectData';
import type { ProjectMetadata } from 'netsblox-cloud-client/src/types/ProjectMetadata';
import { ErrorSetContext } from './Contexts.svelte';
import { GenericTableContext } from './GenericTableContext.svelte';

const Fns: TableFns<ProjectMetadata, CreateProjectData, string> = {
  createFn: (data, owner) => api.createProject({ owner: owner, ...data }),
  readFn: (owner) => api.listUserProjects(owner),
  deleteFn: (entry) => api.deleteProject(entry.id),
  invalidateFn: (owner) => invalidate(CLOUD_URL + '/projects/user/' + owner),
};

const errors: TableErrors = {
  createErr: Error('Failed to import project'),
  readErr: Error('Failed to refresh projects list'),
  deleteErr: Error('Failed to delete project'),
};

const actions: TableEntryAction<ProjectMetadata, string>[] = [
  function open_project(entry, owner) {
    window.open(
      BROWSER_URL +
        '/?action=present&Username=' +
        encodeURIComponent(owner) +
        '&ProjectName=' +
        encodeURIComponent(entry.value.name),
    );
  },
];

export class ProjectOwnedTableContext extends GenericTableContext<
  ProjectMetadata,
  CreateProjectData,
  string
> {
  actions=actions
  constructor(
    owner: string,
    groups: ProjectMetadata[],
    keys: (keyof ProjectMetadata)[],
    searchKey: StringKey<ProjectMetadata>,
  ) {
    super(Fns, errors, ErrorSetContext, owner, groups, keys, searchKey);
  }
}

const key = Symbol('ProjectTable');

export function setProjectTableContext(value: ProjectOwnedTableContext) {
  setContext(key, value);
}

export function getProjectTableContext() {
  return getContext<ProjectOwnedTableContext>(key);
}
