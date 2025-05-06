import { goto, invalidate } from '$app/navigation';
import api from '$lib/utils/api';
import { CLOUD_URL } from '$lib/utils/routes';
import type { StringKey, TableEntryAction, TableFns } from '$lib/utils/types';
import type { CreateLibraryData } from 'netsblox-cloud-client/src/types/CreateLibraryData';
import type { LibraryMetadata } from 'netsblox-cloud-client/src/types/LibraryMetadata';
import { getContext, setContext } from 'svelte';
import { GenericTableContext } from './GenericTableContext.svelte';

const Fns: TableFns<LibraryMetadata, CreateLibraryData, string> = {
  createFn: (data, owner) => api.saveUserLibrary(owner, data),
  readFn: (owner) => api.listUserLibraries(owner),
  deleteFn: (entry) => api.deleteUserLibrary(entry.owner, entry.name),
  invalidateFn: (owner) =>
    invalidate(CLOUD_URL + '/libraries/user/' + owner + '/'),
};

export class LibraryTableContext extends GenericTableContext<
  LibraryMetadata,
  CreateLibraryData, 
  string
> {
  constructor(
    owner: string,
    libraries: LibraryMetadata[],
    keys: (keyof LibraryMetadata)[],
    searchKey: StringKey<LibraryMetadata>,
  ) {
    super(Fns, owner, libraries, keys, searchKey);
  }
}
const key = Symbol('LibraryTable');

export function setGroupTableContext(value: LibraryTableContext) {
  setContext(key, value);
}

export function getGroupTableContext() {
  return getContext<LibraryTableContext>(key);
}
