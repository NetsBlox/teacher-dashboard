import type { DashboardError } from "$lib/utils/errors";
import { getContext, setContext } from "svelte";

export class ErrorContext {
  errors:DashboardError[] = $state([])

  push(value: DashboardError){
    this.errors.push(value)
  }

  shift(){
    return this.errors.shift()
  }
}

const key = Symbol("ErrorContextKey")

export function setErrorContext(value: ErrorContext) {
  setContext(key, value);
}

export function getErrorContext() {
  return getContext<ErrorContext>(key);
}
