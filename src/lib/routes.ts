export const CLOUD_URL = "https://cloud.netsblox.org";

/**
 * Generate a URL for the login server set to redirect to the provided
 * URL on successful login.
 *
 * @param redirectUrl
 */
export function loginUrl(redirectUrl: string): string {
  const LOGIN_URL = "https://login.netsblox.org";
  return `${LOGIN_URL}?redirect=${encodeURIComponent(redirectUrl)}&url=${
    encodeURIComponent(CLOUD_URL)
  }`;
}

export function editorUrl(contentUrl: string): string {
  const EDITOR_URL = "https://editor.netsblox.org";
  return `${EDITOR_URL}?action=open&data=${encodeURIComponent(contentUrl)}`;
}

export function libraryUrl(owner: string, name: string): string {
  [owner, name] = encode(owner, name);
  return `${CLOUD_URL}/libraries/user/${owner}/${name}`;
}

function encode(...params: string[]): string[] {
  return params.map((param) => encodeURIComponent(param));
}
