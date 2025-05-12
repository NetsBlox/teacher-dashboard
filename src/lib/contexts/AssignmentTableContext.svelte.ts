import { goto, invalidate } from '$app/navigation';
import api from '$lib/utils/api';
import { CLOUD_URL } from '$lib/utils/routes';
import type { StringKey, TableEntryAction, TableErrors, TableFns } from '$lib/utils/types';
import { getContext, setContext } from 'svelte';
import { GenericTableContext } from './GenericTableContext.svelte';

import type { Assignment } from 'netsblox-cloud-client/src/types/Assignment';
import type { CreateAssignmentData } from 'netsblox-cloud-client/src/types/CreateAssignmentData';
import type { GroupId } from 'netsblox-cloud-client/src/types/GroupId';
import { errorSetContext } from './ErrorDialogContext.svelte';

const Fns: TableFns<Assignment, CreateAssignmentData, GroupId> = {
  createFn: (data, owner) => api.createAssignment(owner, data),
  readFn: (owner) => api.listGroupAssignments(owner),
  deleteFn: (entry) => api.deleteAssignment(entry.groupId, entry.id),
  invalidateFn: (owner) =>
    invalidate(CLOUD_URL + '/groups/id/' + owner + '/assignments/'),
};

const actions: TableEntryAction<Assignment, GroupId>[] = [
  function view_submissions(entry) {
    goto(
      '/groups/' + entry.value.groupId + '/assignments/' + entry.value.id + '/',
    );
  },
];

const errors: TableErrors = {
  createErr: Error('Failed to create assignment'),
  readErr: Error('Failed to get assignment list'),
  deleteErr: Error('Failed to delete assignment'),
};

export class AssignmentTableContext extends GenericTableContext<
  Assignment,
  CreateAssignmentData,
  GroupId
> {
  actions = actions;
  constructor(
    owner: string,
    assignments: Assignment[],
    keys: (keyof Assignment)[],
    searchKey: StringKey<Assignment>,
  ) {
    super(Fns, errors, errorSetContext, owner, assignments, keys, searchKey);
  }
}
const key = Symbol('AssignmentTable');

export function setAssignmentTableContext(value: AssignmentTableContext) {
  setContext(key, value);
}

export function getAssignmentTableContext() {
  return getContext<AssignmentTableContext>(key);
}
