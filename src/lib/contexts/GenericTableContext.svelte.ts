import type { TableContext, TableFns, TableEntry, StringKey } from "$lib/utils/types";

export class GenericTableContext<T, CreateT, TOwner>
implements TableContext<T, CreateT, TOwner> {
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

  constructor(
    data: TableFns<T, CreateT, TOwner>,
    owner: TOwner,
    values: T[],
    keys: (keyof T)[],
    searchKey: StringKey<T>,
  ) {
    this.fns = data;
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
    const values = await this.fns.readFn(this.owner);
    this.entries = values.map((value) => {
      return { selected: false, value: value, visible: true, expand: false };
    });
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

    await Promise.all(promises);
    this.refreshEntries();
    this.fns.invalidateFn(this.owner);
    this.deleteOpen = false;
  }

  async createEntry(data: CreateT) {
    await this.fns.createFn(data, this.owner);
    await this.fns.invalidateFn(this.owner);
    await this.refreshEntries();
    this.createOpen = false;
  }
}
