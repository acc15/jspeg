import {Matcher, MatchResult} from "../Matcher";

export default function range(low: string, high: string): Matcher {
    return r => MatchResult.of(r, r.read(1), v => v >= low && v <= high);
}
