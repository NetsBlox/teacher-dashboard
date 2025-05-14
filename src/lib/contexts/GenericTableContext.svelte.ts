import type {
  StringKey,
  TableContext,
  TableEntry,
  TableErrors,
  TableFns,
} from '$lib/utils/types';

export class GenericTableContext<T, CreateT, TOwner>
  implements TableContext<T, CreateT, TOwner>
{
  createOpen: boolean = $state(false);
  editOpen: boolean = $state(false);
  deleteOpen: boolean = $state(false);

  owner: TOwner;
  entries: TableEntry<T>[] = $state([]);
  keys: (keyof T)[];
  searchKey: StringKey<T>;

  get search() {
    return this._search;
  }
  set search(v) {
    this._search = v;
    this.applyFilter();
  }

  private _search: string = $state('');
  private fns: TableFns<T, CreateT, TOwner>;
  private errs: TableErrors;
  private errSetContext: Error[];

  constructor(
    data: TableFns<T, CreateT, TOwner>,
    errs: TableErrors,
    errContext: Error[],
    owner: TOwner,
    values: T[],
    keys: (keyof T)[],
    searchKey: StringKey<T>,
  ) {
    this.fns = data;
    this.errs = errs;
    this.errSetContext = errContext;
    this.owner = owner;
    this.searchKey = searchKey;
    this.keys = keys;
    this.entries = values.map((value) => {
      return {
        selected: false,
        value: value,
        visible: true,
        expand: false,
      };
    });
  }

  async refreshEntries() {
    try {
      const values = await this.fns.readFn(this.owner);
      this.entries = values.map((value) => {
        return { selected: false, value: value, visible: true, expand: false };
      });
    } catch (err) {
      this.errSetContext.push(this.errs.readErr);
      throw err;
    }
  }

  applyFilter() {
    this.entries.forEach((entry) => {
      entry.visible = (entry.value[this.searchKey] as string)
        .toLowerCase()
        .includes(this.search.toLowerCase());
    });
  }

  async deleteSelected() {
    const promises = this.entries.reduce((filtered, current) => {
      if (current.selected && current.visible) {
        filtered.push(this.fns.deleteFn(current.value, this.owner));
      }
      return filtered;
    }, new Array<Promise<T>>());

    Promise.all(promises)
      .then(() => {
        this.refreshEntries();
        this.fns.invalidateFn(this.owner);
      })
      .catch((err) => {
        this.errSetContext.push(this.errs.deleteErr);
        throw err;
      });
    this.deleteOpen = false;
  }

  async createEntry(data: CreateT) {
    try {
      this.createOpen = false;
      await this.fns.createFn(data, this.owner);
      await this.fns.invalidateFn(this.owner);
      this.refreshEntries();
    } catch (err) {
      this.errSetContext.push(this.errs.createErr);
      throw err;
    }
  }
}
