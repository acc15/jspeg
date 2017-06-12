import {Reader} from "./Reader";
import {value} from "./Matchers";
import {MatchResult} from "./MatchResult";

export type Matcher<T> = (reader: Reader) => MatchResult<T>;
export type Expression<T> = string | Matcher<T>;

export function toMatcher<T>(e: Expression<T>): Matcher<T | string | undefined> {
    if (typeof e === "string") {
        return value(e);
    }
    return e;
}
