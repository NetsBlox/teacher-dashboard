export const CLOUD_URL = import.meta.env.VITE_CLOUD_URL;
export const BROWSER_URL = import.meta.env.VITE_BROWSER_URL;
export const LOGIN_URL = import.meta.env.VITE_LOGIN_URL;

export function loginUrl(redirectUrl: URL): string {
  const loginBase: String = LOGIN_URL;
  const cloudUrl: String = CLOUD_URL;
  return `${loginBase}?redirect=${redirectUrl.toString()}&url=${cloudUrl}`;
}

export function editorUrl(contentUrl: string): string {
  const EDITOR_URL = 'https://editor.netsblox.org';
  return `${EDITOR_URL}?action=open&data=${encodeURIComponent(contentUrl)}`;
}

export function libraryUrl(owner: string, name: string): string {
  [owner, name] = encode(owner, name);
  return `${CLOUD_URL}/libraries/user/${owner}/${name}`;
}

export namespace dashboard {
  export function classUrl(id: string): string {
    [id] = encode(id);
    return `/classes/${id}`;
  }
}

function encode(...params: string[]): string[] {
  return params.map((param) => encodeURIComponent(param));
}
