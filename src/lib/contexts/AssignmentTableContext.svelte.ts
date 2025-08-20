import { DashboardError } from '$lib/utils/errors';
import type {
  Deleteable,
  HasEntries,
  Searchable,
  TableEntry,
} from '$lib/utils/tables.svelte';
import utils from '$lib/utils/tables.svelte';
import type { Assignment } from 'netsblox-cloud-client/src/types/Assignment';
import type { CreateAssignmentData } from 'netsblox-cloud-client/src/types/CreateAssignmentData';
import type { GroupId } from 'netsblox-cloud-client/src/types/GroupId';
import type { StringKey } from '$lib/utils/types';
import type { ErrorContext } from './ErrorContext.svelte';
import { goto, invalidate } from '$app/navigation';
import { getContext, setContext } from 'svelte';
import api from '$lib/utils/api';
import { CLOUD_URL } from '$lib/utils/routes';

type TableType = HasEntries<Assignment> & Searchable<Assignment> & Deleteable;

export class AssignmentTableContext implements TableType {
  owner: GroupId;
  entries: TableEntry<Assignment>[] = $state([]);

  toaster: ErrorContext;

  keys: (keyof Assignment)[];
  searchKey: StringKey<Assignment>;
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
    assignments: Assignment[],
    keys: (keyof Assignment)[],
    searchKey: StringKey<Assignment>,
    toaster: ErrorContext,
  ) {
    this.owner = owner;
    this.entries = utils.initEntries(assignments, this.createActions);
    this.keys = keys;
    this.searchKey = searchKey;
    this.toaster = toaster;
  }

  filter() {
    utils.filter(this);
  }

  async refresh() {
    try {
      await invalidate(CLOUD_URL + '/groups/id/' + this.owner + '/assignments/')
      const assignments = await api.listGroupAssignments(this.owner);
      this.entries = utils.initEntries(assignments, this.createActions);
    } catch (_e) {
      DashboardError.create('Failed to refresh entries').toast(this.toaster);
    }
  }

  async deleteSelected() {
    const promises: Promise<Assignment>[] = [];
    this.entries.forEach((entry) => {
      if (entry.selected && entry.visible) {
        promises.push(api.deleteAssignment(this.owner, entry.value.id));
      }
    });
    try {
      await Promise.all(promises);
      await this.refresh();
    } catch (_e) {
      DashboardError.create('Failed to delete all assignments.').toast(this.toaster);
    }
  }

  async createAssignment(data: CreateAssignmentData) {
    try {
      await api.createAssignment(this.owner, data);
      await this.refresh();
    } catch (_e) {
      DashboardError.create('Failed to create assignment.').toast(this.toaster);
    }
  }

  private createActions = (value: Assignment) => {
    const View = () => goto(`/groups/${value.groupId}/assignments/${value.id}/`);
    Object.defineProperty(View, "name", {value: "View"})
    return [View];
  };
}

const key = Symbol('AssignmentTable');

export function setAssignmentTableContext(value: AssignmentTableContext) {
  setContext(key, value);
}

export function getAssignmentTableContext() {
  return getContext<AssignmentTableContext>(key);
}
