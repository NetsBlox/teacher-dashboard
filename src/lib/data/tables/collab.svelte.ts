import type { ConstructParams, HasEntries } from '$lib/utils/tables';

import type { HasKeys, Searchable, TableEntry } from '$lib/utils/tables';
import type { StringKey } from '$lib/utils/types';
import type { ProjectMetadata } from 'netsblox-cloud-client/src/types/ProjectMetadata';
import type { ErrorContext } from '../../contexts/ErrorContext.svelte';

import { BROWSER_URL } from '$lib/utils/routes';
import u from '$lib/utils/tables';
import { watch } from 'runed';

export class CollabTable
  implements
    HasEntries<ProjectMetadata>,
    HasKeys<ProjectMetadata>,
    Searchable<ProjectMetadata>
{
  owner: string;
  entries: TableEntry<ProjectMetadata>[];
  keys: (keyof ProjectMetadata)[];
  searchKey: StringKey<ProjectMetadata>;
  toaster: ErrorContext;
  search: string;
  refresh: () => void;

  constructor(params: ConstructParams<CollabTable, ProjectMetadata>) {
    this.search = $state('');
    this.owner = params.owner;
    this.keys = params.keys;
    this.searchKey = params.searchKey;
    this.toaster = params.toaster;
    this.refresh = params.refresher;
    this.entries = $state(u.initEntries(params.values, this.actionMaker));
    watch(
      () => this.search,
      () => u.filter(this),
    );
  }

  private actionMaker = (value: ProjectMetadata) => {
    const url = encodeURI(
      `${BROWSER_URL}/?action=present&Username=${value.owner}&ProjectName=${value.name}`,
    );
    const Open = () => void window.open(url);
    Open.title = "Open"
    return [Open];
  };
}
