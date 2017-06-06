import {MatchSource, Reader, ReadResult, toReader} from "./Reader";
import {value} from "./Matchers";

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
        return isOk ? MatchResult.withMatch(res.value.length, res.next, res.value) : MatchResult.noMatch(reader);
    }

    public static withMatch(consumed: number, next: Reader, data: any): MatchResult {
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

    public apply(child: MatchResult): MatchResult {
        this.consumed += child.consumed;
        this.next = child.next;
        this.data.push(child.data);
        return this;
    }

    public applyIfMatches(child: MatchResult): MatchResult {
        return child.matches ? this.apply(child) : this;
    }

}
