import "mocha";
import {expect} from "chai";

import {match, Matcher} from "./Matcher";
import {any, noMatch, range, repeat, seq, value, zeroOrOne} from "./Matchers";

function expectMatch(m: Matcher, s: string, matches: boolean, consumed: number, data: any, nextThree: string): void {
    const res = match(m, s);
    expect(res.matches).eq(matches);
    expect(res.consumed).eq(consumed);
    expect(res.next.read(3).value).eq(nextThree);
    expect(res.data).eql(data);
}

describe("Matchers", () => {
    describe("noMatch", () => {
        it("must return result without match", () => {
            expectMatch(noMatch(), "abcdefgh", false, 0, undefined, "abc");
        });
    });

    describe("range", () => {
        it("must match if value in range", () => {
            for (let i = 0; i < 26; i++) {
                const letter = String.fromCharCode(65 + i);
                expectMatch(range("A", "Z"), letter + "ZZZ", true, 1, letter, "ZZZ");
            }
        });
        it("must not match if value out of range", () => {
            expectMatch(range("a", "z"), "AB", false, 0, undefined, "AB");
        });
    });

    describe("value", () => {
        it("must match if string eq value", () => {
            expectMatch(value("a"), "abcdef", true, 1, "a", "bcd");
        });
        it("must not match if value not eq", () => {
            expectMatch(value("b"), "abc", false, 0, undefined, "abc");
        });
    });

    describe("any", () => {
        it("matches abc | def", () => {
            const m = any("abc", "def");
            expectMatch(m, "abcdef", true, 3, "abc", "def");
            expectMatch(m, "defabc", true, 3, "def", "abc");
        });
    });

    describe("seq", () => {
        it("must match if string eq value", () => {
            expectMatch(seq("a", "b", "c"), "abcdef", true, 3, ["a", "b", "c"], "def");
        });
    });

    describe("repeat", () => {
        it("must match 3AAA", () => {
            expectMatch(repeat(3, 3, "A"), "AAABC", true, 3, ["A", "A", "A"], "BC");
        });
    });

    describe("zeroOrOne", () => {
        it("must match even if child not matches", () => {
            expectMatch(zeroOrOne("X"), "abc", true, 0, [], "abc");
        });
    });

});
