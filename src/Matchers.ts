import {Expression, Matcher, toMatcher} from "./Matcher";
import {DataMap, MatchResult} from "./MatchResult";

export function noMatch<T>(): Matcher<T | undefined> {
    return r => MatchResult.withoutMatch<T>(r);
}

export function value(v: string): Matcher<string | undefined> {
    return r => MatchResult.of(r, r.read(v.length), other => other === v);
}

export function range(low: string, high: string): Matcher<string | undefined> {
    return r => MatchResult.of(r, r.read(1), v => v >= low && v <= high);
}

export function repeat<T>(min: number, max: number, e: Expression<T>): Matcher<T[]> {
    const m = toMatcher(e);
    return r => {
        const res = MatchResult.withMatch(0, r, []);
        if (max <= 0) {
            return res;
        }

        let itemRes = m(res.next);
        while (itemRes.matches) {
            MatchResult.apply(res, itemRes);
            if (res.data.length >= max) {
                break;
            }
            itemRes = m(res.next);
        }

        res.matches = (res.data.length >= min);
        return res;
    };
}

export function zeroOrOne<T>(e: Expression<T>): Matcher<T[]> {
    return repeat(0, 1, e);
}

export function zeroOrMore<T>(e: Expression<T>): Matcher<T[]> {
    return repeat(0, Infinity, e);
}

export function oneOrMore<T>(e: Expression<T>): Matcher<T[]> {
    return repeat(1, Infinity, e);
}

export function seq<T>(...e: Array<Expression<T>>): Matcher<T[]> {
    const matchers = e.map(toMatcher);
    return r => {
        const res = MatchResult.withMatch(0, r, []);
        for (const m of matchers) {
            const itemRes = m(res.next);
            if (!itemRes.matches) {
                res.matches = false;
                break;
            }
            MatchResult.apply(res, itemRes);
        }
        return res;
    };
}

export function any<T>(...e: Array<Expression<T>>): Matcher<T | string | undefined> {
    const matchers = e.map(toMatcher);
    return r => {
        for (const m of matchers) {
            const itemRes = m(r);
            if (itemRes.matches) {
                return itemRes;
            }
        }
        return MatchResult.withoutMatch<T>(r);
    };
}

export type Mapper<S, R> = DataMap<S, R> | number;

export function map<S, R>(e: Expression<S>, mapper: DataMap<S, R>): Matcher<S | R> {
    const m = toMatcher(e);
    return r => m(r).map(mapper);
}

function toPlainString(d: any): string {
    return Array.isArray(d) ? d.map(toPlainString).join("") : String(d);
}

export function str<T>(e: Expression<T>): Matcher<T | string> {
    return map<T, string>(e, toPlainString);
}

export function recursive<T>(self: (m: Matcher<T>) => Matcher<T>): Matcher<T> {
    const f: Matcher<T> = r => self(f)(r);
    return f;
}

export function skip<T>(i: Expression<any>, e: Expression<T>): Matcher<T | string | undefined> {
    const m = toMatcher(e);
    return r => m(r.ignore(i)).mapReader(k => k.ignore(r.ignoreMatcher()));
}
