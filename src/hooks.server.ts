import { CLOUD_URL } from '$lib/utils/routes';
import type { HandleFetch } from '@sveltejs/kit';

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
  console.log(request.url.toString())
  if (request.url.startsWith(CLOUD_URL) && request.credentials === 'include') {
    const cookie = event.request.headers.get('netsblox') || '';
    request.headers.set('netsblox', cookie);
  }
  return fetch(request);
};
