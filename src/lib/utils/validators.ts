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
