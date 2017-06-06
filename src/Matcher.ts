import {MatchSource, Reader, ReadResult, toReader} from "./Reader";
import value from "./matchers/value";

export type Matcher = (reader: Reader) => MatchResult;
export type Expression = string | Matcher;

export function toMatcher(expr: Expression): Matcher {
    if (typeof expr === "string") {
        return value(expr);
    }
    return expr;
}

export function match(e: Expression, s: MatchSource): MatchResult {
    return toMatcher(e)(toReader(s));
}

export class MatchResult {

    public static of(reader: Reader, res: ReadResult, test: (val: string) => boolean): MatchResult {
        const isOk = test(res.value);
        return isOk ? MatchResult.match(res.value.length, res.next, res.value) : MatchResult.noMatch(reader);
    }

    public static match(consumed: number, next: Reader, data: any): MatchResult {
        const res = new MatchResult();
        res.matches = true;
        res.consumed = consumed;
        res.next = next;
        res.data = data;
        return res;
    }

    public static noMatch(reader: Reader) {
        const res = new MatchResult();
        res.matches = false;
        res.consumed = 0;
        res.next = reader;
        res.data = undefined;
        return res;
    }

    public matches: boolean;
    public consumed: number;
    public next: Reader;
    public data: any;

}
