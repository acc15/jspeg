import {Expression, match, Matcher, MatchResult} from "../Matcher";

export default function any(...e: Expression[]): Matcher {
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