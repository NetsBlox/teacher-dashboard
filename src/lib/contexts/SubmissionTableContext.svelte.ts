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
import type { Submission } from 'netsblox-cloud-client/src/types/Submission';
import type { ErrorContext } from './ErrorContext.svelte';
import type { GroupId } from 'netsblox-cloud-client/src/types/GroupId';
import type { AssignmentId } from 'netsblox-cloud-client/src/types/AssignmentId';

export type SubmissionOwner = {
  groupId: GroupId;
  assignmentId: AssignmentId;
};

type TableType = HasEntries<Submission> & Searchable<Submission> & Deleteable;

export class SubmissionTableContext implements TableType {
  owner: SubmissionOwner;
  entries: TableEntry<Submission>[] = $state([]);

  toaster: ErrorContext;

  keys: (keyof Submission)[];
  searchKey: StringKey<Submission>;
  private _search: string = $state('');
  get search() {
    return this._search;
  }
  set search(value: string) {
    this._search = value;
    this.filter();
  }

  constructor(
    owner: SubmissionOwner,
    submissions: Submission[],
    keys: (keyof Submission)[],
    searchKey: StringKey<Submission>,
    toaster: ErrorContext,
  ) {
    this.owner = owner;
    this.entries = utils.initEntries(submissions, this.createActions);
    this.keys = keys;
    this.searchKey = searchKey;
    this.toaster = toaster;
  }

  filter() {
    utils.filter(this);
  }

  async invalidate() {
    await invalidate(
      CLOUD_URL +
        '/groups/id/' +
        this.owner.groupId +
        '/assignments/' +
        this.owner.assignmentId +
        '/submissions/',
    );
  }

  async refresh() {
    try {
      await this.invalidate();
      const submissions = await api.viewAssignmentSubmissions(
        this.owner.groupId,
        this.owner.assignmentId,
      );
      this.entries = utils.initEntries(submissions, this.createActions);
    } catch (_e) {
      DashboardError.create('Failed to refresh entries').toast(this.toaster);
    }
  }

  async deleteSelected() {
    const promises: Promise<Submission>[] = [];
    this.entries.forEach((entry) => {
      if (entry.selected && entry.visible) {
        promises.push(
          api.deleteSubmission(
            this.owner.groupId,
            this.owner.assignmentId,
            entry.value.id,
          ),
        );
      }
    });
    try {
      await Promise.all(promises);
      await this.refresh();
    } catch (_e) {
      DashboardError.create('Failed to delete all submissions.').toast(
        this.toaster,
      );
    }
  }

  private createActions = (value: Submission) => {
    const Open = () =>
      window.open(
        BROWSER_URL +
          '/?action=review&groupId=' +
          encodeURIComponent(this.owner.groupId) +
          '&assignmentId=' +
          encodeURIComponent(value.assignmentId) +
          '&submissionId=' +
          encodeURIComponent(value.id),
      );
    return [Open];
  };
}

const key = Symbol('SubmissionTable');

export function setSubmissionTableContext(value: SubmissionTableContext) {
  setContext(key, value);
}

export function getSubmissionTableContext() {
  return getContext<SubmissionTableContext>(key);
}
