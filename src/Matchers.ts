
import {Matcher, MatchResult} from "./Matcher";

export function noMatch(): Matcher {
    return r => MatchResult.noMatch(r);
}

export function value(v: string): Matcher {
    return r => MatchResult.of(r.read(v.length), other => other === v);
}

export function range(low: string, high: string): Matcher {
    return r => MatchResult.of(r.read(1), v => v >= low && v <= high);
}

