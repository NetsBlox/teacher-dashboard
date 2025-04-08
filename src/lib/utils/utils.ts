import type { RoleData } from "netsblox-cloud-client/src/types/RoleData";

export class DataFileError extends Error {
  constructor(filename: string, inner: Error) {
    const msg = `${inner.message} (${filename})`;
    super(msg);
  }
}

export class NoFileContentsError extends Error {
  constructor() {
    super("Unable to read file.")
  }
}

export async function readFile(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.readAsText(file, 'utf-8')
    reader.onload = evt => {
      if (evt.target) {
        res(evt.target.result as string);
      } else {
        rej(new NoFileContentsError());
      }
    };
  });
}

// export function getRoleData(xml: string): RoleData[] {
//   const roles = [];
//   let name, code, snippet;
//   let index = 0;
//   while (index < xml.length) {
//     const nameSpan = stringBtwn(xml, '<role name="', '">');
//     if (!nameSpan)
//       throw new NoFileContentsError()

//     snippet = '<role name="';
//     index = xml.indexOf(snippet)
//     const startIndex = index + snippet.length;

//     snippet = '</role>';
//     index = xml.indexOf(snippet, startIndex)

//     name = xml.substring(startIndex, index)
//   }
//   // TODO

// }

interface RoleSpan {
  name: Span,
  code: Span,
  media: Span,
}

// This function returns the indices for the beginning and end of 
// role data
function findRoleSpan(xml: string, start: number | undefined): RoleSpan | undefined {
  if (!start) start = 0;

  const nameSpan = stringBtwn(xml, '<role name="', '">');
  if (!nameSpan) return;

  const mediaStart = xml.indexOf('<media', nameSpan.end);
  if (mediaStart === -1) return;

  const mediaEnd = xml.indexOf('</media>', mediaStart);
  if (mediaEnd === -1) return;

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
      end: mediaEnd + 7,
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
    return { start, end: start + searchText.length };

  }
}

