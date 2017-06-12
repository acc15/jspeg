import {Expression, Matcher, MatchResult, toMatcher} from "./Matcher";

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

export function map(e: Expression, mapper: (data: any) => any): Matcher {
    const m = toMatcher(e);
    return r => MatchResult.copyOf(m(r)).map(mapper);
}

export function recursive(self: (m: Matcher) => Matcher): Matcher {
    const f: Matcher = r => self(f)(r);
    return f;
}

export function ignore(i: Expression, e: Expression): Matcher {
    const m = toMatcher(e);
    return r => m(r.ignore(i)).mapReader(k => k.ignore(r.ignoreMatcher()));
}
