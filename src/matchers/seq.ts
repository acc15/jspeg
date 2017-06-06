import {Expression, match, Matcher, MatchResult} from "../Matcher";

export default function seq(...e: Expression[]): Matcher {
    return r => {
        const res = MatchResult.match(0, r, []);
        for (const m of e) {
            const itemRes = match(m, res.next);
            if (!itemRes.matches) {
                return MatchResult.noMatch(r);
            }
            res.consumed += itemRes.consumed;
            res.next = itemRes.next;
            res.data.push(itemRes.data);
        }
        return res;
    };
}
