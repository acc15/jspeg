
import {Matcher, MatchResult} from "../Matcher";

export default function noMatch(): Matcher {
    return r => MatchResult.noMatch(r);
}
