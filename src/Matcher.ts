import {Reader} from "./Reader";
import {value} from "./Matchers";
import {MatchResult} from "./MatchResult";

export type Matcher = (reader: Reader) => MatchResult;
export type Expression = string | Matcher;

export function toMatcher(e: Expression): Matcher {
    if (typeof e === "string") {
        return value(e);
    }
    return e;
}
