import {Matcher} from "./Matcher";
import StringReader from "./readers/StringReader";

export interface Reader {
    read(n: number): ReadResult;
    ignore(p: Matcher): Reader;
}

export type MatchSource = Reader | string;

export function toReader(m: MatchSource) {
    return typeof m === "string" ? new StringReader(m) : m;
}

export class ReadResult {
    public static empty(r: Reader) {
        return new ReadResult("", r);
    }

    public static of(value: string, r: Reader) {
        return new ReadResult(value, r);
    }

    public value: string;
    public next: Reader;

    constructor(value: string, next: Reader) {
        this.value = value;
        this.next = next;
    }

}
