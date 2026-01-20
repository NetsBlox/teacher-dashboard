import type { ConstructParams, Deleteable } from '$lib/utils/tables';

import type { HasEntries, Searchable, TableEntry } from '$lib/utils/tables';
import type { StringKey } from '$lib/utils/types';
import type { AssignmentId } from 'netsblox-cloud-client/src/types/AssignmentId';
import type { GroupId } from 'netsblox-cloud-client/src/types/GroupId';
import type { Submission } from 'netsblox-cloud-client/src/types/Submission';
import type { ErrorContext } from '../../contexts/ErrorContext.svelte';

import { deleteSubmission } from '$lib/utils/api/groups';
import { BROWSER_URL } from '$lib/utils/routes';
import u from '$lib/utils/tables';
import { watch } from 'runed';

export type SubmissionOwner = {
  groupId: GroupId;
  assignmentId: AssignmentId;
};

export class SubmissionTable
  implements
    HasEntries<Submission>,
    Searchable<Submission>,
    Deleteable<Submission>
{
  owner: SubmissionOwner;
  entries: TableEntry<Submission>[];
  toaster: ErrorContext;
  keys: (keyof Submission)[];
  searchKey: StringKey<Submission>;
  search: string;
  refresh: () => void;
  constructor(params: ConstructParams<SubmissionTable, Submission>) {
    this.owner = params.owner;
    this.keys = params.keys;
    this.searchKey = params.searchKey;
    this.toaster = params.toaster;
    this.search = $state('');
    this.refresh = params.refresher;
    this.entries = $state(u.initEntries(params.values, this.createActions));
    watch(
      () => this.search,
      () => u.filter(this),
    );
  }

  deletor = (v: Submission) =>
    deleteSubmission(fetch, this.owner.groupId, this.owner.assignmentId, v.id);

  deleteSelected() {
    const result = u
      .deleteEntries(this, this.deletor)
      .andTee(() => this.refresh())
      .orTee((e) => {
        e.prepend('Failed to delete entries: ').toast(this.toaster);
        this.refresh();
      });
    return result;
  }

  private createActions = (value: Submission) => {
    const Open = () =>
      void window.open(
        BROWSER_URL +
          '/?action=review&groupId=' +
          encodeURIComponent(this.owner.groupId) +
          '&assignmentId=' +
          encodeURIComponent(value.assignmentId) +
          '&submissionId=' +
          encodeURIComponent(value.id),
      );
    Open.label = 'Open';
    return [Open];
  };
}
