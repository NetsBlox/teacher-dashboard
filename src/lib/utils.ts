import type { RoleData } from "netsblox-cloud-client/src/types/RoleData";

  export class DataFileError extends Error {
    constructor(filename: string, inner: Error) {
      const msg = `${inner.message} (${filename})`;
      super(msg);
    }
  }

export class NoFileContentsError extends Error{
  constructor() {
    super("Unable to read file.")
  }
}

  export async function readFile(file: File) {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.readAsText(file, 'utf-8')
      reader.onload = evt => {
        if (evt.target) {
          res(evt.target.result);
        } else {
          rej(new NoFileContentsError());
        }
    };});
  }

export function getRoleData(xml: string): RoleData[] {
  const roles = [];
  let name, code, snippet;
  let index = 0;
  while (index < xml.length) {
    const nameSpan = stringBtwn(xml, '<role name="', '">');
    if (nameSpan)

    snippet = '<role name="';
    index = xml.indexOf(snippet)
    const startIndex = index + snippet.length;

    snippet = '</role>';
    index = xml.indexOf(snippet, startIndex)

    name = xml.substring(startIndex, index)
    
    snippet = '</role>';
    index = xml.indexOf(snippet, startIndex)

    name = xml.substring(startIndex, index)
  }
  // TODO
  
}

interface RoleSpan {
  name: Span,
  code: Span,
  media: Span,
}

function findRoleSpan(xml: string): Span | undefined {
    const nameSpan = stringBtwn(xml, '<role name="', '">');
    if (!nameSpan) return;

    const mediaStart = xml.indexOf('<media', nameSpan.end);
    if (mediaStart === -1) return;

    const roleEnd = xml.indexOf('</role>', mediaStart);
    if (roleEnd === -1) return;

    return {
      name: nameSpan,
      code: {
        start: nameSpan.end + 2,
        end: mediaStart - 1,
      },
      media: {
        start: mediaStart,
        end: ,
      }
    
    };
}

interface Span {
  start: number,
  end: number,
}

function spanText(text: string, span: Span): string {
  return text.substring(span.start, span.end);
}

function stringBtwn(str: string, startText: string, endText: string): Span | undefined {
    const start = findSpan(str, startText)
    if (start) {
      const end = findSpan(str.slice(start.end), endText);
      if (end) {
        return {
          start: start.end,
          end: end.start - 1,
        };
      }
    }
}

function findSpan(str: string, searchText: string): Span | undefined {
    const start = str.indexOf(searchText);
    if (start > -1) {
      return {start, end: start + searchText.length};
    
    }
}
