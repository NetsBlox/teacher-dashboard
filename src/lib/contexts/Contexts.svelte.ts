import { getContext, setContext } from 'svelte';

type NavTitleContext = { title: String };
const key = Symbol('NavbarContextKey');

export function setNavbarContext(value: NavTitleContext) {
  setContext(key, value);
}

export function getNavbarContext() {
  return getContext<NavTitleContext>(key);
}
