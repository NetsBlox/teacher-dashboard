import { ErrorContext } from '$lib/contexts/ErrorContext.svelte';

export class DashboardError {
  inner: unknown;
  msg: string;
  constructor(msg: string) {
    this.msg = msg;
  }

  static create(msg: string): DashboardError {
    return new DashboardError(msg);
  }

  prepend(prefix: string): DashboardError {
    this.msg = prefix + this.msg;
    return this;
  }

  append(suffix: string): DashboardError {
    this.msg = this.msg + suffix;
    return this;
  }

  wrap(e: unknown) {
    this.inner = e;
    return this;
  }

  toast(context: ErrorContext): DashboardError {
    context.push(this);
    return this;
  }
}

export function NetworkError(url?: string) {
  if (url) return DashboardError.create('Failed to reach cloud at ' + url);
  else return DashboardError.create('failed to reach cloud');
}

export function InternalError() {
  return DashboardError.create('The cloud experienced an InternalError');
}

export function UserError(text?: string) {
  if (text) return DashboardError.create(text);
  else return DashboardError.create('The cloud experienced a UserError');
}

export function NotFound(text?: string) {
  if (text) return DashboardError.create(text);
  else return DashboardError.create('Resource was not found');
}

export function UnknownError(text?: string) {
  if (text) return DashboardError.create(text);
  else return DashboardError.create('An unknown error occured');
}

export function LoginRequired(text?: string) {
  if (text) return DashboardError.create(text);
  else return DashboardError.create('Failed to logout from account');
}

export function NotAllowed(text?: string) {
  if (text) return DashboardError.create(text);
  else return DashboardError.create('Action not allowed');
}

export function ParsingFailed() {
  return DashboardError.create('Failed to parse cloud response');
}
