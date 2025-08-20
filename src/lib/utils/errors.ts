import { ErrorContext, getErrorContext } from "$lib/contexts/ErrorContext.svelte";

export class DashboardError extends Error {
  constructor(msg: string) {
    super(msg);
  }

  static create(msg: string): DashboardError {
    return new DashboardError(msg);
  }

  toast(context: ErrorContext): DashboardError {
    context.push(this)
    return this;
  }
}
