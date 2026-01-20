import * as de from '$lib/utils/errors';
import {
  err,
  errAsync,
  fromPromise,
  fromSafePromise,
  okAsync,
} from 'neverthrow';

export class FetchBuilder {
  opt: RequestInit = {};
  url: string = '';

  static to(endpoint: string) {
    const fetchBuilder = new FetchBuilder();
    fetchBuilder.url = encodeURI(endpoint);
    fetchBuilder.opt.credentials = 'include';
    fetchBuilder.opt.method = 'GET';
    return fetchBuilder;
  }

  method(method: Uppercase<string>) {
    this.opt.method = method;
    return this;
  }

  payload(data: object) {
    this.opt.body = JSON.stringify(data);
    this.opt.headers = {
      ...this.opt.headers,
      'Content-Type': 'application/json',
    };
    return this;
  }
}

export function mapResponse(
  rsp: Response,
  options?: {
    parse?: 'json' | 'text';
    parseErr?: 'json';
    name?: string;
  },
) {
  if (rsp.ok) return mapOkRsp(rsp, options?.parse);
  else return mapErrRsp({ rsp, parse: options?.parseErr });
}

function mapOkRsp(rsp: Response, parse?: 'json' | 'text') {
  if (parse === 'text') {
    return fromPromise(rsp.text(), de.ParsingFailed);
  } else if (parse === 'json') {
    return fromPromise(rsp.json(), de.ParsingFailed);
  } else {
    return okAsync();
  }
}

function mapErrRsp(opt: { rsp: Response; parse?: 'json' }) {
  if (opt.parse === 'json') {
    return fromPromise(opt.rsp.json(), de.ParsingFailed)
      .orElse(() => mapStatusCode(opt.rsp))
      .andThen((text) => err(de.UserError().wrap(text)));
  } else {
    return mapStatusCode(opt.rsp);
  }
}

function mapStatusCode(rsp: Response) {
  const promise = rsp.text().catch(() => undefined);
  const result = fromSafePromise(promise).andThen((text) => {
    if (rsp.status >= 500) {
      return errAsync(de.InternalError().wrap(rsp));
    } else if (rsp.status === 404) {
      return errAsync(de.NotFound(text).wrap(rsp));
    } else if (rsp.status === 403) {
      return errAsync(de.NotAllowed(text).wrap(rsp));
    } else if (rsp.status === 401) {
      return errAsync(de.LoginRequired(text).wrap(rsp));
    } else if (rsp.status >= 400) {
      return errAsync(de.UserError(text).wrap(rsp));
    } else {
      return errAsync(de.UnknownError());
    }
  });
  return result;
}
