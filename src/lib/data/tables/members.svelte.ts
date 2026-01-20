import type { ErrorContext } from '$lib/contexts/ErrorContext.svelte';
import type { ConstructParams, Deleteable } from '$lib/utils/tables';

import type { DashboardError } from '$lib/utils/errors';
import type { HasEntries, Searchable, TableEntry } from '$lib/utils/tables';
import type { StringKey } from '$lib/utils/types';
import type { Group } from 'netsblox-cloud-client/src/types/Group';
import type { NewUser } from 'netsblox-cloud-client/src/types/NewUser';
import type { User } from 'netsblox-cloud-client/src/types/User';
import type { ResultAsync } from 'neverthrow';

import { goto } from '$app/navigation';
import { createUser, createUserBatch, deleteUser } from '$lib/utils/api/users';
import { generatePassword, parseCSV } from '$lib/utils/misc';
import tu from '$lib/utils/tables';
import { isNewUserErrorResponseArray } from '$lib/utils/validators';
import { watch } from 'runed';

export type Batch = { prefix: string; amount: number; email: string };

export class MemberTable
  implements HasEntries<User>, Searchable<User>, Deleteable<User>
{
  owner: Group;
  entries: TableEntry<User>[];
  toaster: ErrorContext;
  keys: (keyof User)[];
  searchKey: StringKey<User>;
  search: string;
  refresh: () => void;

  constructor(params: ConstructParams<MemberTable, User>) {
    this.owner = params.owner;
    this.keys = params.keys;
    this.searchKey = params.searchKey;
    this.toaster = params.toaster;
    this.refresh = params.refresher;
    this.search = $state('');
    this.entries = $state(tu.initEntries(params.values, this.actionMaker));
    watch(
      () => this.search,
      () => tu.filter(this),
    );
  }

  deletor = (user: User) => deleteUser(fetch, user.username);

  deleteSelected() {
    const result = tu
      .deleteEntries(this, this.deletor)
      .andTee(this.refresh)
      .orTee((error) => {
        error.prepend('Member Deletion Failed: ').toast(this.toaster);
        this.refresh();
      });
    return result;
  }

  createUser(data: NewUser) {
    const result = createUser(fetch, { ...data, groupId: this.owner.id })
      .orTee((e) => e.prepend('User Creation Failed: ').toast(this.toaster))
      .andTee(() => this.refresh());

    return result;
  }

  createUsers({ prefix, amount, email }: Batch) {
    const groupId = this.owner.id;
    const userPassPairs: ArrayIterator<[string, string]> = Array(amount)
      .keys()
      .map((idx) => idx.toString().padStart(3, '0'))
      .map((suffix) => prefix + suffix)
      .map((username) => [username, generatePassword()]);

    const userPassMap = new Map(userPassPairs);

    const newUsers: NewUser[] = userPassMap
      .entries()
      .map(([username, password]) => ({ username, email, password, groupId }))
      .toArray();

    const result = createUserBatch(fetch, { users: newUsers })
      .mapErr((de) => {
        if (isNewUserErrorResponseArray(de.inner)) {
          const builder = tu.CSVBuilder.new().addRow('username', 'error');
          for (const e of de.inner) {
            builder.addRow(e.username, e.message);
          }
          de.prepend('An error report has been generated: ');
          de.wrap(builder.build());
        }
        return de;
      })
      .map((users) => {
        const builder = tu.CSVBuilder.new().addRow('username', 'password');
        for (const u of users) {
          builder.addRow(u.username, String(userPassMap.get(u.username)));
        }
        return builder.build();
      })
      .andTee(this.refresh);
    return result;
  }

  createUsersFromCSV(file: File): ResultAsync<User[], DashboardError> {
    const groupId = this.owner.id;
    const result = parseCSV(file, ['username', 'email', 'password'])
      .map((rows) =>
        rows.map(([username, email, password]): NewUser => {
          return { username, email, password, groupId };
        }),
      )
      .andThen((newUsers) => createUserBatch(fetch, { users: newUsers }))
      .andTee(() => this.refresh())
      .orTee((e) => e.toast(this.toaster));

    return result;
  }

  private actionMaker = (value: User) => {
    const View = () => void goto('/users/' + value.username + '/');
    View.title = "View"
    return [View];
  };
}
