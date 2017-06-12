import {Expression, Matcher} from "./Matcher";
import StringReader from "./readers/StringReader";
import {ReadResult} from "./ReadResult";

export interface Reader {
    read(n: number): ReadResult;
    ignore(p: Expression): Reader;
    ignoreMatcher(): Matcher;
}

export type MatchSource = Reader | string;

export function toReader(m: MatchSource) {
    return typeof m === "string" ? new StringReader(m) : m;
}
