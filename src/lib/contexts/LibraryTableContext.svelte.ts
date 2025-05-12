import { invalidate } from '$app/navigation';
import api from '$lib/utils/api';
import { CLOUD_URL } from '$lib/utils/routes';
import type { StringKey, TableErrors, TableFns } from '$lib/utils/types';
import type { CreateLibraryData } from 'netsblox-cloud-client/src/types/CreateLibraryData';
import type { LibraryMetadata } from 'netsblox-cloud-client/src/types/LibraryMetadata';
import { getContext, setContext } from 'svelte';
import { GenericTableContext } from './GenericTableContext.svelte';
import { errorSetContext } from './ErrorDialogContext.svelte';

const Fns: TableFns<LibraryMetadata, CreateLibraryData, string> = {
  createFn: (data, owner) => api.saveUserLibrary(owner, data),
  readFn: (owner) => api.listUserLibraries(owner),
  deleteFn: (entry) => api.deleteUserLibrary(entry.owner, entry.name),
  invalidateFn: (owner) =>
    invalidate(CLOUD_URL + '/libraries/user/' + owner + '/'),
};

const errors: TableErrors = {createErr: Error("Failed to import library"),
                             readErr: Error("Failed to refresh library list"),
                             deleteErr: Error("Failed to delete library(s)")}

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
    super(Fns, errors, errorSetContext, owner, libraries, keys, searchKey);
  }
}
const key = Symbol('LibraryTable');

export function setGroupTableContext(value: LibraryTableContext) {
  setContext(key, value);
}

export function getGroupTableContext() {
  return getContext<LibraryTableContext>(key);
}
