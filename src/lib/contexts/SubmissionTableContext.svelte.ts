import { invalidate } from '$app/navigation';
import api from '$lib/utils/api';
import { BROWSER_URL, CLOUD_URL } from '$lib/utils/routes';
import type {
  StringKey,
  TableEntryAction,
  TableErrors,
  TableFns,
} from '$lib/utils/types';
import { getContext, setContext } from 'svelte';
import { GenericTableContext } from './GenericTableContext.svelte';

import type { AssignmentId } from 'netsblox-cloud-client/src/types/AssignmentId';
import type { CreateSubmissionData } from 'netsblox-cloud-client/src/types/CreateSubmissionData';
import type { GroupId } from 'netsblox-cloud-client/src/types/GroupId';
import type { Submission } from 'netsblox-cloud-client/src/types/Submission';
import { ErrorSetContext } from './Contexts.svelte';

export type SubmissionOwner = {
  groupId: GroupId;
  assignmentId: AssignmentId;
};

const Fns: TableFns<Submission, CreateSubmissionData, SubmissionOwner> = {
  createFn: (data, owner) =>
    api.createSubmission(owner.groupId, owner.assignmentId, data),
  readFn: (owner) =>
    api.viewAssignmentSubmissions(owner.groupId, owner.assignmentId),
  deleteFn: (entry, owner) =>
    api.deleteSubmission(owner.groupId, entry.assignmentId, entry.id),
  invalidateFn: (owner) =>
    invalidate(
      CLOUD_URL +
        '/groups/id/' +
        owner.groupId +
        '/assignments/' +
        owner.assignmentId +
        '/submissions/',
    ),
};

const errors: TableErrors = {
  createErr: Error('Failed to create submission'),
  readErr: Error('Failed to get submission list'),
  deleteErr: Error('Failed to delete submission'),
};

const actions: TableEntryAction<Submission, SubmissionOwner>[] = [
  {
    name: 'Open',
    func: (entry, owner) =>
      window.open(
        BROWSER_URL +
          '/?action=review&groupId=' +
          encodeURIComponent(owner.groupId) +
          '&assignmentId=' +
          encodeURIComponent(entry.value.assignmentId) +
          '&submissionId=' +
          encodeURIComponent(entry.value.id),
      ),
  },
];

export class SubmissionTableContext extends GenericTableContext<
  Submission,
  CreateSubmissionData,
  SubmissionOwner
> {
  actions = actions;
  constructor(
    owner: SubmissionOwner,
    submissions: Submission[],
    keys: (keyof Submission)[],
    searchKey: StringKey<Submission>,
  ) {
    super(Fns, errors, ErrorSetContext, owner, submissions, keys, searchKey);
  }
}
const key = Symbol('SubmissionTable');

export function setSubmissionTableContext(value: SubmissionTableContext) {
  setContext(key, value);
}

export function getSubmissionTableContext() {
  return getContext<SubmissionTableContext>(key);
}
