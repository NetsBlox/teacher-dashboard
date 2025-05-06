import { getContext, setContext } from 'svelte';



const key = Symbol('ErrorsContext');

export function setErrorsContext(value: Array<Error>) {
  setContext(key, value);
}

export function getErrorsContext() {
  return getContext<Array<Error>>(key);
}
