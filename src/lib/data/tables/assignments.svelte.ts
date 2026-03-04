import type { ErrorContext } from '$lib/contexts/ErrorContext.svelte';
import type { ConstructParams, Deleteable } from '$lib/utils/tables';

import type { HasEntries, Searchable, TableEntry } from '$lib/utils/tables';
import type { StringKey } from '$lib/utils/types';
import type { Assignment } from 'netsblox-cloud-client/src/types/Assignment';
import type { CreateAssignmentData } from 'netsblox-cloud-client/src/types/CreateAssignmentData';
import type { GroupId } from 'netsblox-cloud-client/src/types/GroupId';

import { goto } from '$app/navigation';
import { createAssignment, deleteAssignment } from '$lib/utils/api/groups';
import u from '$lib/utils/tables';
import { watch } from 'runed';

export class AssignmentTable
  implements
    HasEntries<Assignment>,
    Searchable<Assignment>,
    Deleteable<Assignment>
{
  owner: GroupId;
  entries: TableEntry<Assignment>[];
  toaster: ErrorContext;
  keys: (keyof Assignment)[];
  searchKey: StringKey<Assignment>;
  search: string;
  refresh: () => void;

  constructor(params: ConstructParams<AssignmentTable, Assignment>) {
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

  deletor = (a: Assignment) => deleteAssignment(fetch, this.owner, a.id);

  deleteSelected() {
    const result = u
      .deleteEntries(this, this.deletor)
      .andTee(() => this.refresh())
      .orTee((e) => {
        this.refresh();
        e.prepend('Failed to delete all entries: ').toast(this.toaster);
      });
    return result;
  }

  async createAssignment(data: CreateAssignmentData) {
    const result = createAssignment(fetch, this.owner, data)
      .orTee((e) => e.prepend('Failed to create entry: ').toast(this.toaster))
      .andTee(() => this.refresh());
    return result;
  }

  private createActions = (value: Assignment) => {
    const View =  () => void goto(`/groups/${value.groupId}/assignments/${value.id}/`)
    View.label = "View"
    return [View];
  };
}
