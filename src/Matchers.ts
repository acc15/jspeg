import {Expression, match, Matcher, MatchResult, toMatcher} from "./Matcher";

export const noMatch: Matcher = r => MatchResult.noMatch(r);

export function value(v: string): Matcher {
    return r => MatchResult.of(r, r.read(v.length), other => other === v);
}

export function range(low: string, high: string): Matcher {
    return r => MatchResult.of(r, r.read(1), v => v >= low && v <= high);
}

export function repeat(min: number, max: number, e: Expression): Matcher {
    return r => {
        const res = MatchResult.withMatch(0, r, []);
        if (max <= 0) {
            return res;
        }

        const m = toMatcher(e);

        let itemRes = m(res.next);
        while (itemRes.matches) {
            res.apply(itemRes);
            if (res.data.length >= max) {
                break;
            }
            itemRes = match(e, res.next);
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
    return r => {
        const res = MatchResult.withMatch(0, r, []);
        for (const m of e) {
            const itemRes = match(m, res.next);
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
    return r => {
        for (const m of e) {
            const itemRes = match(m, r);
            if (itemRes.matches) {
                return itemRes;
            }
        }
        return MatchResult.noMatch(r);
    };
}

export function recursive(self: (m: Matcher) => Matcher): Matcher {
    let ref = noMatch;
    const m: Matcher = r => ref(r);
    ref = self(m);
    return m;
}
