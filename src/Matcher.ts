import {IReader, ReadResult} from "./Reader";

export type Matcher = (reader: IReader) => MatchResult;

export class MatchResult {

    public static of(res: ReadResult, test: (val: string) => boolean) {
        const isOk = test(res.value);
        return new MatchResult(isOk, isOk ? res.value.length : 0, res.next, res.value);
    }

    public static noMatch(reader: IReader) {
        return new MatchResult(false, 0, reader, undefined);
    }

    public matches: boolean;
    public consumed: number;
    public next: IReader;
    public data: any;

    constructor(ok: boolean, consumed: number, next: IReader, data: any) {
        this.matches = ok;
        this.consumed = consumed;
        this.next = next;
        this.data = data;
    }

}
