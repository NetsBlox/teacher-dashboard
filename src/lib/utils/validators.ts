import type { NetsbloxTime } from "./types";
import type { PartialCreateProjectData } from "./types";

export function isProjectObj(value: unknown): value is PartialCreateProjectData {
    return Boolean(
        value &&
        typeof value === 'object' &&
        "room" in value &&
        value.room 
    )
}


export function isNetsbloxTime(value: unknown): value is NetsbloxTime {
    return Boolean(
        value &&
        typeof value === 'object' &&
        Object.keys(value).length === 2 &&
        'secs_since_epoch' in value &&
        'nanos_since_epoch' in value &&
        typeof value.secs_since_epoch === 'number' &&
        typeof value.nanos_since_epoch === 'number'
    );
}

export interface TEMP_NEWUSERERRORRESPONSE {
  username: string;
  status: number;
  message: string;
}

export function isNewUserErrorResponseArray(value: unknown): value is TEMP_NEWUSERERRORRESPONSE[]{
    return Boolean(
        value &&
        value instanceof Array &&
        (value.length === 0 ||
          Object.keys(value[0]).length === 3 &&
          'username' in value[0] &&
          'status' in value[0] &&
          'message' in value[0] &&
          typeof value[0].username === 'string' &&
          typeof value[0].status === 'number' && 
          typeof value[0].message === 'string' )
    );
}
