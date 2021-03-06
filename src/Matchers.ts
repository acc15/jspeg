import {Expression, Matcher, toMatcher} from "./Matcher";
import {DataMap, MatchResult} from "./MatchResult";

export const noMatch: Matcher = r => MatchResult.withoutMatch(r);

export function value(v: string): Matcher {
    return r => MatchResult.of(r, r.read(v.length), other => other === v);
}

export function range(low: string, high: string): Matcher {
    return r => MatchResult.of(r, r.read(1), v => v >= low && v <= high);
}

export function repeat(min: number, max: number, e: Expression): Matcher {
    const m = toMatcher(e);
    return r => {
        const res = MatchResult.withMatch(0, r, []);
        if (max <= 0) {
            return res;
        }

        let itemRes = m(res.next);
        while (itemRes.matches) {
            res.apply(itemRes);
            if (res.data.length >= max) {
                break;
            }
            itemRes = m(res.next);
        }

        res.matches = (res.data.length >= min);
        return res;
    };
}

export function zeroOrOne(e: Expression): Matcher {
    return repeat(0, 1, e);
}

export function zeroOrMore(e: Expression): Matcher {
    return repeat(0, Infinity, e);
}

export function oneOrMore(e: Expression): Matcher {
    return repeat(1, Infinity, e);
}

export function seq(...e: Expression[]): Matcher {
    const matchers = e.map(toMatcher);
    return r => {
        const res = MatchResult.withMatch(0, r, []);
        for (const m of matchers) {
            const itemRes = m(res.next);
            if (!itemRes.matches) {
                res.matches = false;
                break;
            }
            res.apply(itemRes);
        }
        return res;
    };
}

export function any(...e: Expression[]): Matcher {
    const matchers = e.map(toMatcher);
    return r => {
        for (const m of matchers) {
            const itemRes = m(r);
            if (itemRes.matches) {
                return itemRes;
            }
        }
        return MatchResult.withoutMatch(r);
    };
}

export type Mapper = DataMap | number;

export function map(e: Expression, mapper: Mapper): Matcher {
    const m = toMatcher(e);
    const mapFn: DataMap = typeof mapper === "number" ? (d => d[mapper]) : mapper;
    return r => {
        const res = m(r);
        if (!res.matches) {
            return res;
        }
        return res.map(mapFn);
    };
}

function toPlainString(d: any): string {
    return Array.isArray(d) ? d.map(toPlainString).join("") : String(d);
}

export function str(e: Expression): Matcher {
    return map(e, toPlainString);
}

export function recursive(self: (m: Matcher) => Matcher): Matcher {
    const f: Matcher = r => self(f)(r);
    return f;
}

export function skip(i: Expression, e: Expression): Matcher {
    const m = toMatcher(e);
    return r => m(r.ignore(i)).mapReader(k => k.ignore(r.ignoreMatcher()));
}
