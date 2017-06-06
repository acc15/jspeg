import {Matcher, MatchResult} from "../Matcher";

export default function value(v: string): Matcher {
    return r => MatchResult.of(r, r.read(v.length), other => other === v);
}
